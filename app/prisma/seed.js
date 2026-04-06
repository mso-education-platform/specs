const { PrismaClient, ProgramCode, UnitDifficulty } = require('@prisma/client');

const prisma = new PrismaClient();

const programSeeds = [
  {
    code: ProgramCode.WEB_DEV,
    title: 'Web Development',
    description: 'Project-based web development fundamentals and progression.',
    minUnits: 10,
    maxUnits: 10,
    units: [
      'web-foundations',
      'html-css-basics',
      'javascript-basics',
      'dom-and-events',
      'react-fundamentals',
      'state-management',
      'api-integration',
      'testing-fundamentals',
      'project-delivery',
      'portfolio-polish',
    ],
  },
  {
    code: ProgramCode.AI_ORIENTED,
    title: 'AI Oriented',
    description: 'AI literacy, practical prompt engineering, and safe model usage.',
    minUnits: 8,
    maxUnits: 12,
    units: [
      'ai-intro',
      'prompt-craft',
      'data-basics',
      'python-for-ai',
      'ml-concepts',
      'model-evaluation',
      'agentic-workflows',
      'ai-capstone',
    ],
  },
];

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
    });

    for (const [index, unitSlug] of program.units.entries()) {
      await prisma.learningUnit.upsert({
        where: {
          programId_slug: {
            programId: savedProgram.id,
            slug: unitSlug,
          },
        },
        update: {
          title: unitSlug.replace(/-/g, ' '),
          objective: `Complete outcomes for ${unitSlug.replace(/-/g, ' ')}.`,
          difficulty: index < 3 ? UnitDifficulty.BEGINNER : index < 6 ? UnitDifficulty.INTERMEDIATE : UnitDifficulty.ADVANCED,
          estimatedMinutes: 45,
          orderIndex: index + 1,
        },
        create: {
          programId: savedProgram.id,
          slug: unitSlug,
          title: unitSlug.replace(/-/g, ' '),
          objective: `Complete outcomes for ${unitSlug.replace(/-/g, ' ')}.`,
          difficulty: index < 3 ? UnitDifficulty.BEGINNER : index < 6 ? UnitDifficulty.INTERMEDIATE : UnitDifficulty.ADVANCED,
          estimatedMinutes: 45,
          orderIndex: index + 1,
          isMandatory: true,
        },
      });
    }

    const orderedUnits = await prisma.learningUnit.findMany({
      where: { programId: savedProgram.id },
      orderBy: { orderIndex: 'asc' },
      select: { id: true, orderIndex: true },
    });

    for (const unit of orderedUnits) {
      const previousUnit = orderedUnits.find((candidate) => candidate.orderIndex === unit.orderIndex - 1);
      if (!previousUnit) continue;

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
      });
    }
  }
}

async function main() {
  try {
    await seedProgramsAndUnits();
    console.log('Seed completed');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
