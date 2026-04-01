/** Matches `public.spots` in Supabase. */
export type SpotRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
