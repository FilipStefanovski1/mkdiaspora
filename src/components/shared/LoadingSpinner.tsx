import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-surface-4 border-t-accent',
        SIZES[size],
        className,
      )}
    />
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <LoadingSpinner size="lg" />
    </div>
  )
}
