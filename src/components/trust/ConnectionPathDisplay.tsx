import { ArrowRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import type { ConnectionPath } from '@/types'

interface ConnectionPathDisplayProps {
  path: ConnectionPath
}

export function ConnectionPathDisplay({ path }: ConnectionPathDisplayProps) {
  const { hops, degree } = path

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 text-2xs text-ink-faint">
        <span className="font-medium text-ink-muted">{degree}°</span>
        <span>connection ·</span>
        <span>connected through {hops.length - 2} person{hops.length - 2 !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {hops.map((hop, i) => (
          <div key={hop.id} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-1">
              <Avatar src={hop.avatarUrl} name={hop.fullName} size="sm" tier={hop.tier} />
              <span className="text-2xs text-ink-faint max-w-[56px] text-center leading-tight truncate">
                {hop.fullName.split(' ')[0]}
              </span>
            </div>
            {i < hops.length - 1 && (
              <ArrowRight size={12} className="text-ink-faint flex-shrink-0 mb-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
