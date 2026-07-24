"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@workspace/ui/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

const Combobox = Popover

const ComboboxTrigger = PopoverTrigger

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      className={cn("w-[200px] p-0", className)}
      {...props}
    >
      <CommandPrimitive className="flex w-full flex-col overflow-hidden rounded-none bg-popover text-popover-foreground">
        {children}
      </CommandPrimitive>
    </PopoverContent>
  )
}

function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <CommandPrimitive.Input
      className={cn(
        "flex h-9 w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-1", className)}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  selected = false,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> & { selected?: boolean }) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-none px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="flex size-4 items-center justify-center">
        {selected && <CheckIcon className="size-4" />}
      </span>
      {children}
    </CommandPrimitive.Item>
  )
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxSeparator,
  useComboboxAnchor,
}
