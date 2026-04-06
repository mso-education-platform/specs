#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    return null
  }
}

function collectLocaleKeysFromFile(file) {
  const obj = readJSON(file)
  if (!obj) return null
  const keys = new Set()
  function walk(o, prefix = '') {
    for (const k of Object.keys(o)) {
      const val = o[k]
      const key = prefix ? `${prefix}.${k}` : k
      if (typeof val === 'string') keys.add(key)
      else if (typeof val === 'object' && val !== null) walk(val, key)
    }
  }
  walk(obj)
  return keys
}

function walkFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git') continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) results = results.concat(walkFiles(full, exts))
    else if (exts.includes(path.extname(e.name))) results.push(full)
  }
  return results
}

function extractKeysFromFile(content) {
  const keys = new Set()
  const regexes = [
    /t\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    /i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g,
    /t?\.format\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
  ]
  for (const r of regexes) {
    let m
    while ((m = r.exec(content))) keys.add(m[1])
  }
  return keys
}

function main() {

  const messagesDir = path.join(process.cwd(), 'src', 'i18n', 'messages')
  if (!fs.existsSync(messagesDir)) {
    console.error('ERROR: messages directory not found at', messagesDir)
    process.exit(1)
  }

  const enFile = path.join(messagesDir, 'en.json')
  if (!fs.existsSync(enFile)) {
    console.error('ERROR: baseline en.json not found at', enFile)
    process.exit(1)
  }

  const localeKeys = collectLocaleKeysFromFile(enFile)
  if (!localeKeys) {
    console.error('ERROR: failed to read keys from en.json')
    process.exit(1)
  }

  const srcDir = path.join(process.cwd(), 'src')
  if (!fs.existsSync(srcDir)) {
    console.error('ERROR: src directory not found at', srcDir)
    process.exit(1)
  }

  const files = walkFiles(srcDir)
  const used = new Set()
  for (const f of files) {
    // skip translation files
    if (f.startsWith(messagesDir)) continue
    const content = fs.readFileSync(f, 'utf8')
    const keys = extractKeysFromFile(content)
    for (const k of keys) used.add(k)
  }

  const missingInEn = [...used].filter(k => !localeKeys.has(k))
  const report = {
    scannedFiles: files.length,
    usedKeys: [...used].length,
    missingInEn: missingInEn,
    locales: {},
  }

  // Check additional locales provided via LOCALES env var (comma-separated)
  const localesEnv = process.env.LOCALES || ''
  const locales = localesEnv.split(',').map(s => s.trim()).filter(Boolean)
  let failed = false
  if (locales.length) {
    for (const loc of locales) {
      const locFile = path.join(messagesDir, `${loc}.json`)
      const locReport = { exists: false, missingComparedToEn: [] }
      if (!fs.existsSync(locFile)) {
        locReport.exists = false
        report.locales[loc] = locReport
        failed = true
        continue
      }
      locReport.exists = true
      const locKeys = collectLocaleKeysFromFile(locFile)
      if (!locKeys) {
        locReport.readError = true
        report.locales[loc] = locReport
        failed = true
        continue
      }
      const missing = [...localeKeys].filter(k => !locKeys.has(k))
      locReport.missingComparedToEn = missing
      if (missing.length) failed = true
      report.locales[loc] = locReport
    }
  }

  // record missing in en
  if (missingInEn.length) failed = true

  // write report file for CI consumption
  try {
    const outDir = path.join(process.cwd(), 'reports')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    const outPath = path.join(outDir, 'i18n-report.json')
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8')
    // also write a markdown summary
    const mdLines = []
    mdLines.push('# i18n check report')
    mdLines.push(`- Scanned files: ${report.scannedFiles}`)
    mdLines.push(`- Used keys found: ${report.usedKeys}`)
    mdLines.push('')
    if (report.missingInEn.length) {
      mdLines.push('## Missing keys in `en.json`')
      for (const k of report.missingInEn.slice(0, 200)) mdLines.push(`- ${k}`)
      if (report.missingInEn.length > 200) mdLines.push(`- ...and ${report.missingInEn.length - 200} more`)
      mdLines.push('')
    } else {
      mdLines.push('✅ No missing keys in `en.json`')
      mdLines.push('')
    }

    if (Object.keys(report.locales).length) {
      mdLines.push('## Locale checks')
      for (const [loc, lr] of Object.entries(report.locales)) {
        if (!lr.exists) {
          mdLines.push(`- **${loc}**: MISSING file (expected src/i18n/messages/${loc}.json)`)
          continue
        }
        if (lr.readError) {
          mdLines.push(`- **${loc}**: could not read file`)
          continue
        }
        if (lr.missingComparedToEn.length) {
          mdLines.push(`- **${loc}**: missing ${lr.missingComparedToEn.length} keys:`)
          for (const k of lr.missingComparedToEn.slice(0, 50)) mdLines.push(`  - ${k}`)
          if (lr.missingComparedToEn.length > 50) mdLines.push(`  - ...and ${lr.missingComparedToEn.length - 50} more`)
        } else {
          mdLines.push(`- **${loc}**: ✅ OK`)
        }
      }
      mdLines.push('')
    }

    fs.writeFileSync(path.join(process.cwd(), 'reports', 'i18n-report.md'), mdLines.join('\n'), 'utf8')
  } catch (e) {
    console.error('Failed to write reports:', e.message)
  }

  if (failed) {
    console.error('i18n check failed — see reports/i18n-report.md for details')
    process.exit(1)
  }

  console.log('i18n check passed — all used keys exist in en.json and locales are present')
  process.exit(0)
}

main()
