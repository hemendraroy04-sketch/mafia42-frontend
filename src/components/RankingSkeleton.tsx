export default function RankingSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading rankings"
      className="overflow-hidden rounded-xl border border-gray-300"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 border-b border-gray-300 px-4 py-3 last:border-b-0 sm:px-6 sm:py-4"
        >
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200 sm:w-40" />
            </div>
          </div>

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 sm:w-24" />
        </div>
      ))}
    </div>
  );
}