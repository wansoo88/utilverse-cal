'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  /** Optional label shown to users above the ad (AdSense policy: "Advertisement" disclosure) */
  showLabel?: boolean
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdSlot({ slot, format = 'auto', className = '', showLabel = true }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)
  const rawClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const clientId = rawClientId?.startsWith('ca-pub-') ? rawClientId : null

  useEffect(() => {
    if (!clientId) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense script not loaded yet — will retry on next mount
    }
  }, [clientId])

  // Render nothing until AdSense is configured. Avoids empty boxes / policy hits.
  if (!clientId) return null

  return (
    <aside className={`my-6 ${className}`} aria-label="Advertisement">
      {showLabel && (
        <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          Advertisement
        </p>
      )}
      <div className="overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  )
}
