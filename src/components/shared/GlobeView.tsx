import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Globe from 'react-globe.gl'
import { MapPin, Users, ArrowRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatNumber } from '@/lib/utils'
import type { Hub } from '@/types'

// ─── GlobeBackground — cinematic, no interactions ────────────────────────────

interface GlobeBackgroundProps {
  hubs: Hub[]
  height?: number
}

export function GlobeBackground({ hubs, height = 600 }: GlobeBackgroundProps) {
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

  const pins = hubs.map((h) => ({
    lat: h.lat,
    lng: h.lng,
    size: Math.min(0.55, 0.15 + h.memberCount / 550),
    color: h.isActive ? '#e74c3c' : '#3a3a50',
  }))

  return (
    <div ref={containerRef} className="w-full h-full">
      <Globe
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="#c0392b"
        atmosphereAltitude={0.15}
        pointsData={pins}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="size"
        pointColor="color"
        pointRadius={0.4}
        pointsMerge={false}
        enablePointerInteraction={false}
        animateIn
      />
    </div>
  )
}

interface GlobePoint {
  lat: number
  lng: number
  size: number
  color: string
  label: string
  hub: Hub
}

interface GlobeHubCardProps {
  hub: Hub
  onClose: () => void
}

const COUNTRY_FLAGS: Record<string, string> = {
  DE: '🇩🇪', GB: '🇬🇧', US: '🇺🇸', CA: '🇨🇦',
  AT: '🇦🇹', CH: '🇨🇭', AU: '🇦🇺', AE: '🇦🇪',
}

function hubSlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, '-')
}

function GlobeHubCard({ hub, onClose }: GlobeHubCardProps) {
  const flag = COUNTRY_FLAGS[hub.countryCode] ?? '🌐'
  const slug = hubSlug(hub.city)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute bottom-4 left-4 w-64 bg-surface-1/95 backdrop-blur-sm border border-border rounded-2xl shadow-glass overflow-hidden"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 p-1 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-3 transition-colors z-10"
      >
        <X size={12} />
      </button>

      {/* Top: flag + city */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{flag}</span>
          <div>
            <h3 className="text-sm font-bold text-ink">{hub.city}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={10} className="text-ink-faint" />
              <span className="text-2xs text-ink-faint">{hub.country}</span>
              <Badge variant={hub.isActive ? 'green' : 'default'} className="ml-1">
                {hub.isActive ? 'Active' : 'Forming'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Users size={12} />
          <span>
            <span className="font-semibold text-ink">{formatNumber(hub.memberCount)}</span> members
          </span>
        </div>

        {hub.topIndustries.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hub.topIndustries.slice(0, 3).map((ind) => (
              <Badge key={ind} variant="outline" className="text-2xs">{ind}</Badge>
            ))}
          </div>
        )}

        {hub.recentActivity && (
          <p className="text-2xs text-ink-faint leading-relaxed">{hub.recentActivity}</p>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Link
          to={`/hubs/${slug}`}
          className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium rounded-xl bg-accent hover:bg-accent-light text-white transition-all"
        >
          View Hub <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  )
}

interface GlobeViewProps {
  hubs: Hub[]
  height?: number
  onHubSelect?: (hub: Hub) => void
}

export function GlobeView({ hubs, height = 420, onHubSelect }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(800)
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null)

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
    size: Math.min(0.65, 0.18 + h.memberCount / 500),
    color: h.isActive ? '#e74c3c' : '#4a4a60',
    label: `${h.city} · ${formatNumber(h.memberCount)} members`,
    hub: h,
  }))

  const handlePointClick = useCallback((point: object) => {
    const p = point as GlobePoint
    setSelectedHub(p.hub)
    onHubSelect?.(p.hub)
  }, [onHubSelect])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-border bg-surface-1"
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
        onPointClick={handlePointClick}
        animateIn
      />

      <AnimatePresence>
        {selectedHub && (
          <GlobeHubCard hub={selectedHub} onClose={() => setSelectedHub(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
