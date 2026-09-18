export interface Guild {
  id: number;
  date: string;
  rank: number;
  guildId: number;
  gp: number;
  guild: {
    id: number;
    name: string;
    country: string;
  };
}

export interface GuildRankingResponse {
  date: string | null;
  rankings: Guild[];
}