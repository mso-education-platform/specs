import { Card } from "@/components/ui/card"
import { useTranslation } from "@/components/i18n/I18nProvider"

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
  const { t } = useTranslation()

  const stats = [
    { label: t("educator_dashboard.cohort.total_learners"), value: cohortSummary.totalLearners },
    { label: t("educator_dashboard.cohort.active_learners"), value: cohortSummary.activeLearners },
    { label: t("educator_dashboard.cohort.completed_onboarding"), value: cohortSummary.completedOnboarding },
    { label: t("educator_dashboard.cohort.onboarding_completion"), value: `${cohortSummary.onboardingCompletionRate}%` },
    { label: t("educator_dashboard.cohort.average_engagement"), value: `${cohortSummary.averageEngagementScore}%` },
    { label: t("educator_dashboard.cohort.average_path_completion"), value: `${cohortSummary.averagePathCompletionRate}%` },
  ]

  return (
    <Card className="p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{t("educator_dashboard.cohort.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("educator_dashboard.cohort.subtitle")}</p>
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
