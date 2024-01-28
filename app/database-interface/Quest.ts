export default interface Quest {
  title: string;
  description: string;
  image?: string;
  points: number;
  participant_count: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;

  is_achieved?: boolean;
}
