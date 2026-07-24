"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@workspace/ui/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex touch-none select-none items-center",
        orientation === "horizontal" ? "w-full" : "h-full min-h-40 flex-col",
        className
      )}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      orientation={orientation}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-none bg-input/50",
          orientation === "horizontal" ? "h-0.5 w-full" : "h-full w-0.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary",
            orientation === "horizontal" ? "h-full" : "w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-3 shrink-0 rounded-full border-none bg-primary transition-colors select-none hover:ring-2 hover:ring-ring/30 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
