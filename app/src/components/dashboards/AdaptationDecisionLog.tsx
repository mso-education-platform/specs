import { Card } from "@/components/ui/card"
import { useTranslation } from "@/components/i18n/I18nProvider"

type AdaptationDecisionLogItem = {
  id: string
  learnerId: string
  learnerName: string
  decisionType: string
  source: string
  rationale: string
  createdAt: string
}

type AdaptationDecisionLogProps = {
  items: AdaptationDecisionLogItem[]
}

export function AdaptationDecisionLog({ items }: AdaptationDecisionLogProps) {
  const { t } = useTranslation()

  return (
    <Card className="p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{t("educator_dashboard.adaptation.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("educator_dashboard.adaptation.subtitle")}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("educator_dashboard.adaptation.empty")}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-border p-3 space-y-1">
              <p className="font-medium">{item.learnerName}</p>
              <p className="text-xs text-muted-foreground">
                {item.decisionType} {t("educator_dashboard.adaptation.via")} {item.source} • {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">{item.rationale}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
