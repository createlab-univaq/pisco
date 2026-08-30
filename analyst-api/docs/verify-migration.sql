-- Post-migration check. One statement, one small table of results: every row should read
-- OK. Row 6 only passes after the new build has started, since Hibernate is what adds
-- flow_id -- before the deploy it is expected to read FAIL/missing.
WITH checks AS (
    SELECT 1 AS ord, 'diagnoses columns are text' AS item,
           (SELECT count(*) FROM information_schema.columns
             WHERE table_name = 'diagnoses'
               AND column_name IN ('diagnosis_text', 'notes', 'medications')
               AND data_type = 'text') = 3 AS ok,
           coalesce((SELECT string_agg(column_name || '=' || data_type, ', ' ORDER BY column_name)
                       FROM information_schema.columns
                      WHERE table_name = 'diagnoses'
                        AND column_name IN ('diagnosis_text', 'notes', 'medications')), 'no columns') AS detail
    UNION ALL
    SELECT 2, 'polyglot_path_id dropped',
           NOT EXISTS (SELECT 1 FROM information_schema.columns
                        WHERE table_name = 'patient_paths' AND column_name = 'polyglot_path_id'),
           'patient_paths rows: ' || (SELECT count(*) FROM patient_paths)
    UNION ALL
    SELECT 3, 'legacy tables dropped',
           NOT EXISTS (SELECT 1 FROM information_schema.tables
                        WHERE table_schema = 'public'
                          AND table_name IN ('game_execution_nodes', 'education_levels')),
           coalesce((SELECT string_agg(table_name, ', ') FROM information_schema.tables
                      WHERE table_schema = 'public'
                        AND table_name IN ('game_execution_nodes', 'education_levels')), 'none left')
    UNION ALL
    SELECT 4, 'no oid columns anywhere',
           NOT EXISTS (SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public' AND data_type = 'oid'),
           coalesce((SELECT string_agg(table_name || '.' || column_name, ', ')
                       FROM information_schema.columns
                      WHERE table_schema = 'public' AND data_type = 'oid'), 'none')
    UNION ALL
    SELECT 5, 'no orphaned large objects',
           (SELECT count(*) FROM pg_largeobject_metadata) = 0,
           (SELECT count(*) || ' object(s)' FROM pg_largeobject_metadata)
    UNION ALL
    SELECT 6, 'flow_id present (after deploy)',
           EXISTS (SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'patient_paths' AND column_name = 'flow_id'),
           coalesce((SELECT 'nullable=' || is_nullable FROM information_schema.columns
                      WHERE table_name = 'patient_paths' AND column_name = 'flow_id'), 'missing')
)
SELECT ord, item, CASE WHEN ok THEN 'OK' ELSE 'FAIL' END AS status, detail
FROM checks ORDER BY ord;
