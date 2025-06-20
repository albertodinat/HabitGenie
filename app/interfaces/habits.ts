export interface Habit {
  id: string;
  frequency: string;
  name: string;
  /**
   * ISO datetime string for reminder time (e.g. 'YYYY-MM-DDTHH:mm')
   */
  time: string;
  uom: string;
  total_units: number;
  completed_units: number;
}
