"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientSession } from "@/lib/auth/client-session"
import { useRouter } from "next/navigation"

type Track = {
  code: "WEB_DEV" | "AI_ORIENTED"
  title: string
  description: string
  durationWeeks?: number
  level?: string
  outcomes?: string[]
  modules?: string[]
  finalProject?: string
  careers?: string[]
}

const publicTracks: Track[] = [
  {
    code: "WEB_DEV",
    title: "Parcours Web",
    description:
      "Apprenez les fondamentaux du développement web: HTML, CSS, JavaScript, React et projet final.",
    durationWeeks: 10,
    level: "Débutant à intermédiaire",
    outcomes: [
      "Construire une application web responsive",
      "Structurer un projet front-end moderne",
      "Consommer des APIs et gérer les états UI",
    ],
    modules: [
      "HTML5 et sémantique",
      "CSS moderne et design responsive",
      "JavaScript fondamental",
      "React et composants",
      "Architecture Next.js",
    ],
    finalProject: "Créer une plateforme d'apprentissage multi-pages avec authentification et suivi de progression.",
    careers: ["Développeur Front-end junior", "Intégrateur web", "Product builder junior"],
  },
  {
    code: "AI_ORIENTED",
    title: "Parcours IA",
    description:
      "Découvrez les bases de l'intelligence artificielle: prompting, données, workflow agentique et capstone.",
    durationWeeks: 8,
    level: "Débutant",
    outcomes: [
      "Concevoir des prompts robustes",
      "Utiliser les données pour prendre des décisions",
      "Prototyper des workflows IA orientés produit",
    ],
    modules: [
      "Fondamentaux de l'IA générative",
      "Prompt engineering",
      "Données, qualité et évaluation",
      "Automatisation et agents",
      "Éthique et sécurité IA",
    ],
    finalProject: "Réaliser un assistant IA pédagogique avec recommandations personnalisées.",
    careers: ["Assistant IA métier", "Automation builder", "AI Ops junior"],
  },
]

function withFallbackContent(track: Track): Track {
  const hasContent = (track.modules?.length ?? 0) > 0 && (track.outcomes?.length ?? 0) > 0
  if (hasContent) {
    return track
  }

  return {
    ...track,
    durationWeeks: track.durationWeeks ?? 6,
    level: track.level ?? "Débutant",
    outcomes: track.outcomes ?? [
      "Acquérir des bases solides",
      "Réaliser un mini-projet guidé",
      "Préparer la suite du parcours personnalisé",
    ],
    modules: track.modules ?? [
      "Introduction",
      "Compétences essentielles",
      "Pratique accompagnée",
      "Projet appliqué",
    ],
    finalProject: track.finalProject ?? "Construire un projet final démontrant les acquis du parcours.",
    careers: track.careers ?? ["Rôle junior orienté produit"],
  }
}

export default function TracksPage() {
  const [selectedCode, setSelectedCode] = useState<Track["code"] | null>(null)
  const [clientRole] = useState<string | null>(() => getClientSession()?.role ?? null)
  const router = useRouter()
  const enrichedTracks = useMemo(() => publicTracks.map(withFallbackContent), [])
  const selectedTrack = enrichedTracks.find((track) => track.code === selectedCode) ?? null

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4">
      <h1 className="text-3xl font-semibold">Parcours disponibles</h1>
      <p className="text-sm text-muted-foreground">
        Cliquez sur un parcours pour afficher son détail complet en bas de page.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {enrichedTracks.map((track) => (
          <Card
            key={track.code}
            className="p-4 space-y-3 cursor-pointer transition-colors hover:bg-muted/30"
            onClick={() => setSelectedCode(track.code)}
          >
            <h2 className="text-xl font-semibold">{track.title}</h2>
            <p className="text-sm text-muted-foreground">{track.description}</p>
            <Button
              type="button"
              variant="outline"
              onClick={(event) => {
                event.stopPropagation()
                setSelectedCode(track.code)
              }}
            >
              Voir le détail
            </Button>
            {clientRole === "LEARNER" ? (
              <Button
                type="button"
                className="ml-2"
                onClick={(event) => {
                  event.stopPropagation()
                  try {
                    window.sessionStorage.setItem("onboarding-default-program", track.code)
                  } catch {}
                  router.push("/onboarding/program")
                }}
              >
                S&apos;inscrire au parcours
              </Button>
            ) : null}
          </Card>
        ))}
      </div>

      {selectedTrack ? (
        <Card className="p-5 space-y-4">
          <h2 className="text-2xl font-semibold">Détail du parcours</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedTrack.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedTrack.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Durée estimée</p>
                <p className="text-sm font-medium">{selectedTrack.durationWeeks} semaines</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Niveau</p>
                <p className="text-sm font-medium">{selectedTrack.level}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Objectifs</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                {selectedTrack.outcomes?.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Modules</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                {selectedTrack.modules?.map((module) => (
                  <li key={module}>{module}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Projet final</h4>
              <p className="text-sm text-muted-foreground">{selectedTrack.finalProject}</p>
            </div>

            <div>
              <h4 className="font-semibold">Débouchés</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                {selectedTrack.careers?.map((career) => (
                  <li key={career}>{career}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
