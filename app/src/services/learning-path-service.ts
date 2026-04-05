import { PathGenerator } from "@prisma/client"
import { learningPathRepository } from "@/repositories/learning-path-repository"
import { prisma } from "@/lib/db/prisma"

export const learningPathService = {
  async generateInitialPath(learnerId: string, programId: string) {
    const units = await prisma.learningUnit.findMany({
      where: { programId },
      orderBy: { orderIndex: "asc" },
      select: { id: true },
    })

    return learningPathRepository.createPathFromProgramUnits({
      learnerId,
      programId,
      unitIds: units.map((unit) => unit.id),
      generatedBy: PathGenerator.AI_PLUS_RULES,
    })
  },

  async getActiveLearningPath(learnerId: string) {
    return learningPathRepository.getActivePath(learnerId)
  },
}
