CREATE OR REPLACE FUNCTION public.get_missions(
    p_quest_id bigint,
    p_user_id uuid DEFAULT NULL,
    last_created_at timestamp with time zone DEFAULT NULL,
    max_count int DEFAULT 50
)
RETURNS TABLE (
    id bigint,
    quest_id bigint,
    type text,
    criteria jsonb,
    title text,
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    is_achieved boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.quest_id,
        m.type,
        m.criteria,
        m.title,
        m.description,
        m.created_at,
        m.updated_at,
        EXISTS (SELECT 1 FROM mission_achievements ma WHERE ma.mission_id = m.id AND ma.user_id = p_user_id) AS is_achieved
    FROM 
        missions m
    WHERE 
        m.quest_id = p_quest_id
        AND (last_created_at IS NULL OR m.created_at < last_created_at)
    ORDER BY 
        m.id ASC
    LIMIT 
        max_count;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public.get_missions(bigint, uuid, timestamp with time zone, integer) OWNER TO postgres;

GRANT ALL ON FUNCTION public.get_missions(bigint, uuid, timestamp with time zone, integer) TO anon;
GRANT ALL ON FUNCTION public.get_missions(bigint, uuid, timestamp with time zone, integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_missions(bigint, uuid, timestamp with time zone, integer) TO service_role;
