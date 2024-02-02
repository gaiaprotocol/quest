export default interface Quest {
  id: number;
  title: string;
  description: string;
  image?: string;
  total_points: number;
  participant_count: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;

  is_achieved?: boolean;
}
