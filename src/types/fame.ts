export interface FamePlayer {
  id: number;
  date: string;
  rank: number;
  playerId: number;
  fame: number;
  player: {
    id: number;
    name: string;
    country: string;
  };
}

export interface FameRankingResponse {
  date: string | null;
  rankings: FamePlayer[];
}