export interface Programme {
  id: string;
  patientId: string;
  days: { [day: string]: string };
}
