declare module 'react-globe.gl' {
  import type { Component } from 'react'

  interface GlobePoint {
    lat: number
    lng: number
    size?: number
    color?: string
    label?: string
  }

  interface GlobeProps {
    width?: number
    height?: number
    backgroundColor?: string
    globeImageUrl?: string
    bumpImageUrl?: string
    backgroundImageUrl?: string
    showAtmosphere?: boolean
    atmosphereColor?: string
    atmosphereAltitude?: number
    pointsData?: GlobePoint[]
    pointLat?: string | ((d: GlobePoint) => number)
    pointLng?: string | ((d: GlobePoint) => number)
    pointAltitude?: string | number | ((d: GlobePoint) => number)
    pointColor?: string | ((d: GlobePoint) => string)
    pointRadius?: string | number | ((d: GlobePoint) => number)
    pointLabel?: string | ((d: GlobePoint) => string)
    pointsMerge?: boolean
    onGlobeClick?: (coords: { lat: number; lng: number }, event: MouseEvent) => void
    onPointClick?: (point: GlobePoint, event: MouseEvent) => void
    enablePointerInteraction?: boolean
    animateIn?: boolean
  }

  export default class GlobeComponent extends Component<GlobeProps> {}
}
