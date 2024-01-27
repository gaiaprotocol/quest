export default interface Quest {
  title: string;
  description: string;
  points: number;
  participant_count: number;
  created_at: string;
  updated_at?: string;
}
