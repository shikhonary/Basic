"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

export interface MultiSelectProps {
  options: { label: string; value: string }[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item))
  }

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((i) => i !== item))
    } else {
      onChange([...value, item])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "inline-flex items-center w-full justify-between rounded-lg border border-outline-variant bg-white px-3 py-2.5 font-body-md text-sm outline-hidden focus:ring-2 focus:ring-primary/10 h-auto min-h-[46px] cursor-pointer hover:bg-white text-left relative",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            className
          )}
        >
          <div className="flex flex-wrap gap-1.5 pr-6">
            {value.length === 0 && (
              <span className="text-on-surface-variant/70 font-normal">
                {placeholder}
              </span>
            )}
            {value.map((val) => {
              const option = options.find((o) => o.value === val)
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="rounded-md border border-outline-variant/40 bg-surface-container-high px-2 py-0.5 text-xs font-semibold text-on-surface hover:bg-surface-container-highest cursor-default normal-case tracking-normal inline-flex items-center gap-1"
                >
                  {option ? option.label : val}
                  <button
                    type="button"
                    className="rounded-full outline-hidden hover:bg-outline-variant/30 transition-colors p-0.5"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUnselect(val)
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-outline-variant shadow-lg rounded-xl overflow-hidden" align="start">
        <Command className="w-full">
          <CommandInput placeholder="Search..." className="h-9 border-0 focus:ring-0 focus-visible:ring-0" />
          <CommandList className="max-h-[200px] overflow-y-auto no-scrollbar">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="p-1">
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high data-selected:bg-surface-container-high flex items-center"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
