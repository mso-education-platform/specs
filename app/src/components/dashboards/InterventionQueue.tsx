import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

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
  return (
    <Card className="p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Intervention queue</h2>
        <p className="text-sm text-muted-foreground">Prioritized learners requiring educator support.</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active intervention items.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.learnerId} className="rounded-md border border-border p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{item.learnerName}</p>
                <Badge variant={riskToVariant[item.riskLevel]}>{item.riskLevel}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.reason}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>Program: {item.programCode ?? "Not selected"}</span>
                <span>Completion: {item.completionRate}%</span>
                <span>Open mentorship: {item.openMentorshipRequests}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
