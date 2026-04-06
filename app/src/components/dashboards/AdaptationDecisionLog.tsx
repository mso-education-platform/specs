import { Card } from "@/components/ui/card"

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
  return (
    <Card className="p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Adaptation decision log</h2>
        <p className="text-sm text-muted-foreground">Transparent history of personalization decisions.</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No adaptation decisions recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-border p-3 space-y-1">
              <p className="font-medium">{item.learnerName}</p>
              <p className="text-xs text-muted-foreground">
                {item.decisionType} via {item.source} • {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">{item.rationale}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
