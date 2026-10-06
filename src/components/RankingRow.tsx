"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Globe2 } from "lucide-react";
import CountryFlag from "@/components/CountryFlag";
import type {
  GuildRankingDetails,
  PlayerRankingDetails,
  RankingRowData,
} from "@/types/ranking";

type BaseRankingRowProps = Omit<RankingRowData, "id"> & {
  expanded: boolean;
  onClick: () => void;
};

type PlayerRankingRowProps = BaseRankingRowProps & {
  detailType: "player";
  detailMode?: "rp" | "fame";
  details: PlayerRankingDetails | null;
};

type GuildRankingRowProps = BaseRankingRowProps & {
  detailType: "guild";
  details: GuildRankingDetails | null;
};

type RankingRowProps =
  | PlayerRankingRowProps
  | GuildRankingRowProps;

function getCountryName(country: string) {
  if (country.toLowerCase() === "none") {
    return "Unknown";
  }

  try {
    const displayNames = new Intl.DisplayNames(["en"], {
      type: "region",
    });

    return displayNames.of(country.toUpperCase()) ?? country;
  } catch {
    return country;
  }
}

function ExpandedCountry({
  country,
}: {
  country: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {country.toLowerCase() === "none" ? (
        <Globe2 className="h-5 w-5 text-gray-500" />
      ) : (
        <div className="relative h-4 w-6 shrink-0 overflow-hidden rounded-sm">
          <Image
            src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`}
            alt={country}
            fill
            sizes="24px"
            className="object-fill"
          />
        </div>
      )}

      <span className="font-medium">
        {getCountryName(country)}
      </span>
    </div>
  );
}

export default function RankingRow(props: RankingRowProps) {
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsHeight, setDetailsHeight] = useState(0);

  useEffect(() => {
    const element = detailsRef.current;

    if (!element || !props.expanded) {
      setDetailsHeight(0);
      return;
    }

    const updateHeight = () => {
      setDetailsHeight(element.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [props.expanded, props.details]);

  return (
    <div className="border-b border-gray-300 last:border-b-0">
      <button
        type="button"
        onClick={props.onClick}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50 active:bg-gray-100 sm:px-6 sm:py-4"
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <span className="min-w-8 shrink-0 text-gray-500 tabular-nums">
            #{props.rank}
          </span>

          <div className="flex min-w-0 items-center gap-3">
            <CountryFlag country={props.country} />
            <p className="truncate font-medium">{props.name}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <span className="font-semibold tabular-nums">
            {props.score}
          </span>

          <div className="w-12 text-center">
            {props.change !== undefined && (
              <>
                {props.change === null ? (
                  <span className="text-sm font-medium text-blue-600">
                    (New)
                  </span>
                ) : props.change > 0 ? (
                  <span className="text-sm font-medium text-green-600 tabular-nums">
                    (+{props.change.toLocaleString()})
                  </span>
                ) : props.change < 0 ? (
                  <span className="text-sm font-medium text-red-600 tabular-nums">
                    ({props.change.toLocaleString()})
                  </span>
                ) : (
                  <span className="text-sm font-medium text-gray-500 tabular-nums">
                    (0)
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </button>

      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{
          height: props.expanded ? detailsHeight : 0,
        }}
      >
        <div
          ref={detailsRef}
          className={`border-t border-gray-200 bg-gray-50 px-4 py-5 transition-opacity duration-200 sm:px-6 ${
            props.expanded ? "opacity-100" : "opacity-0"
          }`}
        >
          {props.details &&
            props.detailType === "player" && (
              <div>
                <ExpandedCountry country={props.details.country} />

                {props.detailMode === "rp" && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Days on Leaderboard
                      </p>

                      <p className="mt-1 font-semibold">
                        {props.details.RPLbcount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Peak RP
                      </p>

                      <p className="mt-1 font-semibold">
                        {props.details.PeakRP?.toLocaleString() ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Peak Rank
                      </p>

                      <p className="mt-1 font-semibold">
                        {props.details.PeakRPRank ?? "-"}
                      </p>
                    </div>
                  </div>
                )}

                {props.detailMode === "fame" && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Days on Leaderboard
                      </p>

                      <p className="mt-1 font-semibold">
                        {props.details.FameLBcount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Peak Fame
                      </p>

                      <p className="mt-1 font-semibold">
                        {props.details.PeakFame?.toLocaleString() ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Peak Rank
                      </p>

                      <p className="mt-1 font-semibold">
                        {props.details.PeakFameRank ?? "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

          {props.details &&
            props.detailType === "guild" && (
              <div>
                <ExpandedCountry country={props.details.country} />

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Days on Leaderboard
                    </p>

                    <p className="mt-1 font-semibold">
                      {props.details.GuildLbCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Peak GP
                    </p>

                    <p className="mt-1 font-semibold">
                      {props.details.PeakGP?.toLocaleString() ?? "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Peak Rank
                    </p>

                    <p className="mt-1 font-semibold">
                      {props.details.PeakGPRank ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}