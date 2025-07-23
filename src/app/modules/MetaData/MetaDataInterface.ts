export type UserGrowthRecord = {
  date: string;
  count: number;
};

export interface SignupQueryParams {
  queryType?: "daily" | "monthly";
  year?: number;
  month?: number;
}
