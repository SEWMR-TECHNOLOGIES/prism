import { Category } from "./task";
export type GoalTimeframe = "weekly" | "monthly" | "yearly";
export type GoalStatus = "completed" | "on-track" | "behind";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number; 
  timeframe: GoalTimeframe;
  category: Category; 
  color: string; 
  createdAt: Date;
  updatedAt: Date;
}
