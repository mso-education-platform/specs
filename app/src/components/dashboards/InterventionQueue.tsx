import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/components/i18n/I18nProvider"

type InterventionQueueItem = {
  learnerId: string
  learnerName: string
  programCode?: "WEB_DEV" | "AI_ORIENTED" | null
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
  reason: string
  openMentorshipRequests: number
  completionRate: number
}

type InterventionQueueProps = {
  items: InterventionQueueItem[]
}

const riskToVariant: Record<InterventionQueueItem["riskLevel"], "default" | "secondary" | "destructive"> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
}

export function InterventionQueue({ items }: InterventionQueueProps) {
  const { t } = useTranslation()

  return (
    <Card className="p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{t("educator_dashboard.intervention.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("educator_dashboard.intervention.subtitle")}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("educator_dashboard.intervention.empty")}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.learnerId} className="rounded-md border border-border p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{item.learnerName}</p>
                <Badge variant={riskToVariant[item.riskLevel]}>{t(`educator_dashboard.intervention.risk.${item.riskLevel}`)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.reason}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>{t("educator_dashboard.intervention.program")}: {item.programCode ?? t("educator_dashboard.intervention.not_selected")}</span>
                <span>{t("educator_dashboard.intervention.completion")}: {item.completionRate}%</span>
                <span>{t("educator_dashboard.intervention.open_mentorship")}: {item.openMentorshipRequests}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
