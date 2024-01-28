CREATE OR REPLACE FUNCTION public.get_quest(
    p_quest_id bigint DEFAULT NULL,
    p_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
    id bigint,
    title text,
    description text,
    image text,
    points bigint,
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
        q.points,
        q.participant_count,
        q.start_date,
        q.end_date,
        q.created_at,
        q.updated_at,
        EXISTS (SELECT 1 FROM quest_achievements qa WHERE qa.quest_id = q.id AND qa.user_id = p_user_id) AS is_achieved
    FROM 
        quests q
    WHERE 
        q.id = p_quest_id;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public.get_quest(bigint, uuid) OWNER TO postgres;

GRANT ALL ON FUNCTION public.get_quest(bigint, uuid) TO anon;
GRANT ALL ON FUNCTION public.get_quest(bigint, uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_quest(bigint, uuid) TO service_role;
