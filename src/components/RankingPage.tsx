"use client";

import HomeLink from "@/components/HomeLink";
import PageHeader from "@/components/PageHeader";
import NoData from "@/components/NoData";
import FullPageMessage from "@/components/FullPageMessage";
import RankingRow from "@/components/RankingRow";
import RankingSkeleton from "@/components/RankingSkeleton";
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

  // Only the very first load takes over the screen. After that the header
  // stays mounted, so changing the date never blanks the page or drops focus.
  if (loading && !data) return <FullPageMessage>Loading...</FullPageMessage>;

  let content;

  if (loading) {
    content = <RankingSkeleton />;
  } else if (error) {
    content = (
      <p
        role="alert"
        className="rounded-xl border border-gray-300 px-6 py-10 text-center text-gray-600"
      >
        {error}
      </p>
    );
  } else if (!data?.rankings.length) {
    content = <NoData />;
  } else {
    content = (
      <div className="overflow-hidden rounded-xl border border-gray-300">
        {data.rankings.map((entry) => {
          const { id, ...row } = toRow(entry);
          return <RankingRow key={id} {...row} />;
        })}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <HomeLink />

        <PageHeader
          title={title}
          date={data?.date}
          onDateChange={loadForDate}
        />

        {content}
      </div>
    </main>
  );
}