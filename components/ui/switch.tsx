'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { cn } from '@/lib/utils'

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input p-0.5 outline-none transition-colors',
        'focus-visible:ring-3 focus-visible:ring-ring/50',
        'data-[checked]:bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-background shadow-sm transition-transform data-[checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  )
}

export { Switch }