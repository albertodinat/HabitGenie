export interface Habit {
  id: string;
  frequency: string;
  name: string;
  time: number; // TODO: convert to datetime string,
  uom: string;
  total_units: number;
  completed_units: number;
}
