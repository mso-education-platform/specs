import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/components/i18n/I18nProvider"
import type { ParentDashboardResponseDto } from "@/lib/validation/dashboard"

type ParentChildProgressProps = {
  childrenProgress: ParentDashboardResponseDto["children"]
}

const engagementVariant: Record<"LOW" | "MEDIUM" | "HIGH", "secondary" | "default" | "destructive"> = {
  LOW: "destructive",
  MEDIUM: "default",
  HIGH: "secondary",
}

export function ParentChildProgress({ childrenProgress }: ParentChildProgressProps) {
  const { t } = useTranslation()

  return (
    <Card className="p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{t("parent_dashboard.progress.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("parent_dashboard.progress.subtitle")}</p>
      </div>

      {childrenProgress.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("parent_dashboard.progress.empty")}</p>
      ) : (
        <div className="space-y-3">
          {childrenProgress.map((child) => (
            <div key={child.learnerId} className="rounded-md border border-border p-3 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{child.learnerName}</p>
                <Badge variant={engagementVariant[child.engagement.level]}>
                  {t(`parent_dashboard.progress.engagement.${child.engagement.level}`)}
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs text-muted-foreground">
                <span>{t("parent_dashboard.progress.score")}: {child.engagement.score}%</span>
                <span>{t("parent_dashboard.progress.path_completion")}: {child.engagement.pathCompletionRate}%</span>
                <span>{t("parent_dashboard.progress.active_units")}: {child.engagement.activeUnits}</span>
                <span>{t("parent_dashboard.progress.completed_units")}: {child.engagement.completedUnits}</span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("parent_dashboard.progress.milestones")}
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {child.milestones.map((milestone, index) => (
                    <li key={`${child.learnerId}-${index}`}>{milestone}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
