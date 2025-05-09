import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <Skeleton className="h-8 w-1/2 bg-white/20 mb-4" />
            <Skeleton className="h-12 w-full bg-white/20" />
          </div>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
        <Skeleton className="h-8 w-1/4 bg-white/20 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full bg-white/20" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <Skeleton className="h-8 w-1/3 bg-white/20 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-12 w-full bg-white/20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
