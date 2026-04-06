import { PrismaClient } from "@prisma/client"
import { randomBytes, scryptSync } from "node:crypto"

const prisma = new PrismaClient()
const KEY_LENGTH = 64

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex")
  return `${salt}:${hash}`
}

const programSeeds = [
  {
    code: "WEB_DEV",
    title: "Web Development",
    description: "Project-based web development fundamentals and progression.",
    minUnits: 10,
    maxUnits: 10,
    units: [
      "web-foundations",
      "html-css-basics",
      "javascript-basics",
      "dom-and-events",
      "react-fundamentals",
      "state-management",
      "api-integration",
      "testing-fundamentals",
      "project-delivery",
      "portfolio-polish",
    ],
  },
  {
    code: "AI_ORIENTED",
    title: "AI Oriented",
    description: "AI literacy, practical prompt engineering, and safe model usage.",
    minUnits: 8,
    maxUnits: 12,
    units: [
      "ai-intro",
      "prompt-craft",
      "data-basics",
      "python-for-ai",
      "ml-concepts",
      "model-evaluation",
      "agentic-workflows",
      "ai-capstone",
    ],
  },
]

async function seedProgramsAndUnits() {
  for (const program of programSeeds) {
    const savedProgram = await prisma.program.upsert({
      where: { code: program.code },
      update: {
        title: program.title,
        description: program.description,
        minUnits: program.minUnits,
        maxUnits: program.maxUnits,
        isActive: true,
      },
      create: {
        code: program.code,
        title: program.title,
        description: program.description,
        minUnits: program.minUnits,
        maxUnits: program.maxUnits,
      },
    })

    for (const [index, unitSlug] of program.units.entries()) {
      await prisma.learningUnit.upsert({
        where: {
          programId_slug: {
            programId: savedProgram.id,
            slug: unitSlug,
          },
        },
        update: {
          title: unitSlug.replaceAll("-", " "),
          objective: `Complete outcomes for ${unitSlug.replaceAll("-", " ")}.`,
          difficulty: index < 3 ? "BEGINNER" : index < 6 ? "INTERMEDIATE" : "ADVANCED",
          estimatedMinutes: 45,
          orderIndex: index + 1,
        },
        create: {
          programId: savedProgram.id,
          slug: unitSlug,
          title: unitSlug.replaceAll("-", " "),
          objective: `Complete outcomes for ${unitSlug.replaceAll("-", " ")}.`,
          difficulty: index < 3 ? "BEGINNER" : index < 6 ? "INTERMEDIATE" : "ADVANCED",
          estimatedMinutes: 45,
          orderIndex: index + 1,
          isMandatory: true,
        },
      })
    }

    const orderedUnits = await prisma.learningUnit.findMany({
      where: { programId: savedProgram.id },
      orderBy: { orderIndex: "asc" },
      select: { id: true, orderIndex: true },
    })

    for (const unit of orderedUnits) {
      const previousUnit = orderedUnits.find((candidate: { orderIndex: number }) => candidate.orderIndex === unit.orderIndex - 1)
      if (!previousUnit) {
        continue
      }

      await prisma.unitPrerequisite.upsert({
        where: {
          unitId_prerequisiteUnitId: {
            unitId: unit.id,
            prerequisiteUnitId: previousUnit.id,
          },
        },
        update: {},
        create: {
          unitId: unit.id,
          prerequisiteUnitId: previousUnit.id,
        },
      })
    }
  }
}

async function seedTestEducator() {
  const email = "allou.abdelhafid+educator@gmail.com"
  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Educator Test",
      role: "EDUCATOR",
      passwordHash: hashPassword("mypass"),
    },
    create: {
      email,
      name: "Educator Test",
      role: "EDUCATOR",
      passwordHash: hashPassword("mypass"),
    },
  })
}

async function main() {
  await seedProgramsAndUnits()
  await seedTestEducator()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
