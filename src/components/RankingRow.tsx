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
    <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4 transition last:border-b-0 hover:bg-gray-50 active:bg-gray-100">
      <div className="flex items-center gap-6">
        <span className="w-8 text-gray-500">#{rank}</span>

        <div className="flex items-center gap-3">
          <CountryFlag country={country} />
          <p className="font-medium">{name}</p>
        </div>
      </div>

      <span className="font-semibold">{score}</span>
    </div>
  );
}