import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import type { Hub } from '@/types'

interface GlobePoint {
  lat: number
  lng: number
  size: number
  color: string
  label: string
}

interface GlobeViewProps {
  hubs: Hub[]
  height?: number
}

export function GlobeView({ hubs, height = 420 }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(800)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(el)
    setWidth(el.clientWidth)

    return () => observer.disconnect()
  }, [])

  const points: GlobePoint[] = hubs.map((h) => ({
    lat: h.lat,
    lng: h.lng,
    size: Math.min(0.6, 0.15 + h.memberCount / 600),
    color: h.isActive ? '#e74c3c' : '#4a4a60',
    label: `${h.city} · ${h.memberCount} members`,
  }))

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden border border-border bg-surface-1"
      style={{ height }}
    >
      <Globe
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="#c0392b"
        atmosphereAltitude={0.12}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="size"
        pointColor="color"
        pointRadius={0.45}
        pointLabel="label"
        pointsMerge={false}
        animateIn
      />
    </div>
  )
}
