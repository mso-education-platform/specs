import { Card } from "@/components/ui/card"

type EducatorCohortAnalyticsProps = {
  cohortSummary: {
    totalLearners: number
    activeLearners: number
    completedOnboarding: number
    onboardingCompletionRate: number
    averageEngagementScore: number
    averagePathCompletionRate: number
  }
}

export function EducatorCohortAnalytics({ cohortSummary }: EducatorCohortAnalyticsProps) {
  const stats = [
    { label: "Total learners", value: cohortSummary.totalLearners },
    { label: "Active learners", value: cohortSummary.activeLearners },
    { label: "Completed onboarding", value: cohortSummary.completedOnboarding },
    { label: "Onboarding completion", value: `${cohortSummary.onboardingCompletionRate}%` },
    { label: "Average engagement", value: `${cohortSummary.averageEngagementScore}%` },
    { label: "Average path completion", value: `${cohortSummary.averagePathCompletionRate}%` },
  ]

  return (
    <Card className="p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Cohort analytics</h2>
        <p className="text-sm text-muted-foreground">Live metrics to monitor learner momentum.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-border p-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
