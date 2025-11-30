export const Skeleton = ({ className = '', variant = 'rectangular' }: { className?: string, variant?: 'rectangular' | 'circular' | 'text' }) => {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  }

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${variants[variant]} ${className}`}
      aria-live="polite"
      aria-busy="true"
    />
  )
}

export const CardSkeleton = () => (
  <div className="glass rounded-2xl p-6">
    <Skeleton className="h-6 w-1/3 mb-4" />
    <Skeleton className="h-20 w-full mb-4" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-5/6" />
      <Skeleton variant="text" className="w-4/6" />
    </div>
  </div>
)
