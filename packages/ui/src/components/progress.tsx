"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@workspace/ui/lib/utils"

function Progress({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(
        "relative h-0.5 w-full overflow-hidden rounded-none bg-muted",
        className
      )}
      {...props}
    >
      {children ?? (
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
      )}
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="progress-track"
      className={cn("relative size-full overflow-hidden bg-muted", className)}
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Indicator>) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full w-full flex-1 bg-primary transition-all", className)}
      {...props}
    />
  )
}

export { Progress, ProgressTrack, ProgressIndicator }
