export interface PerformanceStats {
  title: string;
  value: number | string;
  unit: string;
  percentage: number;
  isIncrease: boolean;
}
export interface Platform{
  name:string,
  count:number
}
export interface ConversationTopicStats {
    title: string,
    color: string,
    percentage: number,
    trend: number,
    trendDirection: string,
    platforms: Platform[]
  }
  export interface GradeCardData {
    grade: string;
    interactions: string;
    completedInteractions: string;
    percentChange: string;
    targetTime: string;
    topScoreTime: string;
  }
