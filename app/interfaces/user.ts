export interface AppUser {
  id: string;
  role: 'orthophonist' | 'patient';
  name: string;
  email: string;
  orthophonistId?: string;
}
