CREATE OR REPLACE FUNCTION public.get_quests(
    p_user_id uuid DEFAULT NULL,
    last_created_at timestamp with time zone DEFAULT NULL,
    max_count int DEFAULT 50
)
RETURNS TABLE (
    id bigint,
    title text,
    description text,
    image text,
    total_points bigint,
    participant_count bigint,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    is_achieved boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.title,
        q.description,
        q.image,
        q.total_points,
        q.participant_count,
        q.start_date,
        q.end_date,
        q.created_at,
        q.updated_at,
        EXISTS (SELECT 1 FROM quest_achievements qa WHERE qa.quest_id = q.id AND qa.user_id = p_user_id) AS is_achieved
    FROM 
        quests q
    WHERE 
        (last_created_at IS NULL OR q.created_at < last_created_at)
    ORDER BY 
        q.id DESC
    LIMIT 
        max_count;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public.get_quests(uuid, timestamp with time zone, integer) OWNER TO postgres;

GRANT ALL ON FUNCTION public.get_quests(uuid, timestamp with time zone, integer) TO anon;
GRANT ALL ON FUNCTION public.get_quests(uuid, timestamp with time zone, integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_quests(uuid, timestamp with time zone, integer) TO service_role;
