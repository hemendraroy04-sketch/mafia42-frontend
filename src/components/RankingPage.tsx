"use client";

import HomeLink from "@/components/HomeLink";
import PageHeader from "@/components/PageHeader";
import NoData from "@/components/NoData";
import FullPageMessage from "@/components/FullPageMessage";
import RankingRow from "@/components/RankingRow";
import { useRanking } from "@/hooks/useRanking";
import type { BaseRankingResponse, RankingRowData } from "@/types/ranking";

interface RankingPageProps<TResponse extends BaseRankingResponse> {
  title: string;
  endpoint: string;
  errorMessage: string;
  /** Maps one API entry to the shape <RankingRow /> renders. */
  toRow: (entry: TResponse["rankings"][number]) => RankingRowData;
}

export default function RankingPage<TResponse extends BaseRankingResponse>({
  title,
  endpoint,
  errorMessage,
  toRow,
}: RankingPageProps<TResponse>) {
  const { data, loading, error, loadForDate } = useRanking<TResponse>(
    endpoint,
    errorMessage,
  );

  if (loading) return <FullPageMessage>Loading...</FullPageMessage>;
  if (error) return <FullPageMessage>{error}</FullPageMessage>;

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-4xl">
        <HomeLink />

        <PageHeader
          title={title}
          date={data?.date}
          onDateChange={loadForDate}
        />

        {!data?.rankings.length ? (
          <NoData />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-300">
            {data.rankings.map((entry) => {
              const { id, ...row } = toRow(entry);
              return <RankingRow key={id} {...row} />;
            })}
          </div>
        )}
      </div>
    </main>
  );
}