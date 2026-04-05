"use client"

import React from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui-custom/PageHeader"
import EmptyState from "@/components/ui-custom/EmptyState"
import LoadingSpinner from "@/components/ui-custom/LoadingSpinner"
import ErrorMessage from "@/components/ui-custom/ErrorMessage"
import ConfirmDialog from "@/components/ui-custom/ConfirmDialog"

export default function Page() {

  return (
    <div className="space-y-8 p-8">
      <Toaster />

      <PageHeader title="Design System Reference" subtitle="Forest Mint theme" />

      <section>
        <h3 className="mb-3 text-lg font-semibold">Colors</h3>
        <div className="flex gap-4">
          {[
            ["primary", "Primary"],
            ["secondary", "Secondary"],
            ["accent", "Accent"],
            ["muted", "Muted"],
            ["destructive", "Destructive"],
          ].map(([k, label]) => (
            <div key={k as string} className="flex flex-col items-center gap-2">
              <div className="h-16 w-32 rounded-md" style={{ background: `var(--${k})` }} />
              <div className="text-sm text-muted-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{`var(--${k})`}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Typography</h3>
        <div className="space-y-2">
          <h1 className="text-4xl font-heading">H1 — Heading</h1>
          <h2 className="text-3xl font-heading">H2 — Heading</h2>
          <h3 className="text-2xl font-heading">H3 — Heading</h3>
          <h4 className="text-xl font-heading">H4 — Heading</h4>
          <p className="text-base">Body text — The quick brown fox jumps over the lazy dog.</p>
          <p className="text-sm text-muted-foreground">Muted text example.</p>
          <code className="block rounded bg-muted p-2 text-sm">const x = 42;</code>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Buttons</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "default",
            "secondary",
            "outline",
            "ghost",
            "destructive",
            "link",
          ].map((variant) => (
            <div key={variant} className="flex items-center gap-2">
              <Button variant={variant as any} size="xs">{variant} xs</Button>
              <Button variant={variant as any} size="sm">{variant} sm</Button>
              <Button variant={variant as any} size="default">{variant} md</Button>
              <Button variant={variant as any} size="lg">{variant} lg</Button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Primitives</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h4 className="mb-2 text-lg font-medium">Card</h4>
            <p className="text-sm text-muted-foreground">A sample card using theme tokens.</p>
            <div className="mt-3 flex gap-2">
              <Badge>New</Badge>
              <Badge>Beta</Badge>
            </div>
          </Card>

          <Card className="p-4">
            <Label htmlFor="demo-input">Label</Label>
            <Input id="demo-input" placeholder="Type something..." />
          </Card>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Custom Components</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState title="No content" description="There is nothing to show here yet." ctaText="Create" onCta={() => toast("Create clicked")} />
          <div className="space-y-2">
            <h4 className="text-lg font-medium">Loading & Error</h4>
            <LoadingSpinner size="lg" />
            <ErrorMessage message="Something went wrong" onRetry={() => toast("Retry clicked")} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Dialog & Toast</h3>
        <div className="flex items-center gap-2">
          <ConfirmDialog
            trigger={<Button>Open Confirm</Button>}
            title="Delete item"
            description="Are you sure you want to delete this item?"
            destructive
            confirmText="Delete"
            onConfirm={() => toast("Deleted")}
          />

          <Button onClick={() => toast("Info toast")}>Show Toast</Button>
        </div>
      </section>
    </div>
  )
}
 
