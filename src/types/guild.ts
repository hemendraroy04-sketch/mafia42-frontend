export interface Guild {
  id: number;
  date: string;
  rank: number;
  guildId: string;
  guildName: string;
  gp: number;
}

export interface GuildRankingResponse {
  date: string | null;
  rankings: Guild[];
}