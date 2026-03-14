export default function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Nav skeleton */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-lg shrink-0" />
        ))}
      </div>

      {/* Section title skeleton */}
      <div className="flex items-center gap-3 mb-5">
        <div className="skeleton h-7 w-40 rounded-md" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-surface-3/50 bg-surface-1 p-5 shadow-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="skeleton h-5 w-20 rounded-md" />
              <div className="flex-1" />
              <div className="skeleton h-4 w-14 rounded-md" />
            </div>
            <div className="skeleton h-5 w-full rounded-md mb-2" />
            <div className="skeleton h-5 w-3/4 rounded-md mb-3" />
            <div className="skeleton h-4 w-full rounded-md mb-1.5" />
            <div className="skeleton h-4 w-5/6 rounded-md mb-4" />
            <div className="flex justify-between pt-3 border-t border-surface-3/40">
              <div className="skeleton h-3 w-24 rounded-md" />
              <div className="skeleton h-3 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
