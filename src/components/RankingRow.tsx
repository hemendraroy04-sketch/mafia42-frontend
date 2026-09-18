import CountryFlag from "@/components/CountryFlag";
import type { RankingRowData } from "@/types/ranking";

type RankingRowProps = Omit<RankingRowData, "id">;

export default function RankingRow({
  rank,
  name,
  country,
  score,
}: RankingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-300 px-4 py-3 transition last:border-b-0 hover:bg-gray-50 active:bg-gray-100 sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        <span className="min-w-8 shrink-0 text-gray-500 tabular-nums">
          #{rank}
        </span>

        <div className="flex min-w-0 items-center gap-3">
          <CountryFlag country={country} />
          <p className="truncate font-medium">{name}</p>
        </div>
      </div>

      <span className="shrink-0 font-semibold tabular-nums">{score}</span>
    </div>
  );
}