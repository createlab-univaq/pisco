-- One-shot production migration: flows refactor + large-object cleanup.
--
-- Run it with the application STOPPED, then deploy the new build. Order matters both ways:
-- the old build writes large-object ids and would fail against a text column, and the new
-- build must find patient_paths without polyglot_path_id and empty, so Hibernate can add
-- flow_id NOT NULL on startup. Adding a NOT NULL column to a non-empty table fails, and
-- ddl-auto only logs that -- the app then starts healthy with no flow_id and every
-- assignment returns 409.
--
--   psql -U <user> -d <db> -v ON_ERROR_STOP=1 -f migration-prod.sql
--
-- Everything is idempotent: re-running it is a no-op. Any unsafe condition raises and
-- rolls the whole transaction back, so it never applies half of itself.

BEGIN;

-- 1. Refuse to continue if the flow refactor cannot land cleanly ---------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'patient_paths' AND column_name = 'polyglot_path_id'
    ) AND EXISTS (SELECT 1 FROM patient_paths) THEN
        RAISE EXCEPTION
            'patient_paths still holds % row(s) referencing Polyglot flows. Those flows no '
            'longer exist, so the assignments cannot be carried over: delete them first '
            '(DELETE FROM patient_paths;) and re-run.',
            (SELECT count(*) FROM patient_paths);
    END IF;
END $$;

-- 2. diagnoses: large objects -> text ------------------------------------------------
-- @Lob on a String made Hibernate store an oid pointing at a large object rather than the
-- text itself: plain SQL saw an integer, pg_dump needed -b, and deleting a row orphaned
-- the object. The entity now maps these as text.
DO $$
DECLARE
    col text;
BEGIN
    FOREACH col IN ARRAY ARRAY['diagnosis_text', 'notes', 'medications'] LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'diagnoses' AND column_name = col AND data_type = 'oid'
        ) THEN
            EXECUTE format('ALTER TABLE diagnoses ADD COLUMN %I_tmp text', col);
            -- lo_get returns bytea; the driver wrote these as UTF-8.
            EXECUTE format(
                'UPDATE diagnoses SET %I_tmp = convert_from(lo_get(%I), ''UTF8'') WHERE %I IS NOT NULL',
                col, col, col);
            -- Unlink before dropping, or the objects survive with nothing referencing them.
            EXECUTE format('SELECT lo_unlink(%I) FROM diagnoses WHERE %I IS NOT NULL', col, col);
            EXECUTE format('ALTER TABLE diagnoses DROP COLUMN %I', col);
            EXECUTE format('ALTER TABLE diagnoses RENAME COLUMN %I_tmp TO %I', col, col);
            RAISE NOTICE 'converted diagnoses.% to text', col;
        END IF;
    END LOOP;
END $$;

ALTER TABLE diagnoses ALTER COLUMN diagnosis_text SET NOT NULL;

-- 3. patient_paths: drop the Polyglot reference --------------------------------------
-- flow_id, its unique constraint and its foreign key are left to Hibernate on startup:
-- the flows table does not exist yet, so the constraint could not be created here.
ALTER TABLE patient_paths DROP CONSTRAINT IF EXISTS uk_patient_paths_assignment_path;
ALTER TABLE patient_paths DROP COLUMN IF EXISTS polyglot_path_id;

-- 4. Leftovers from earlier refactors ------------------------------------------------
DROP TABLE IF EXISTS education_levels;

-- 5. Game telemetry: answers moved from the execution to a node -----------------------
-- Runs are now execution -> nodes -> answers. The old tables are dropped so Hibernate
-- recreates them in the new shape; both are matched by a column unique to the old
-- version, so this never touches a table already migrated. Telemetry cannot be reshaped
-- automatically -- the old rows carry no node grouping -- so rows abort the migration.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name = 'game_answers' AND column_name = 'execution_id') THEN
        IF EXISTS (SELECT 1 FROM game_answers) THEN
            RAISE EXCEPTION
                'game_answers holds % row(s) in the old flat shape. They cannot be grouped '
                'into nodes automatically: export them if they matter, delete them, and re-run.',
                (SELECT count(*) FROM game_answers);
        END IF;
        DROP TABLE game_answers;
        RAISE NOTICE 'dropped game_answers (old flat shape)';
    END IF;

    -- Matched on sequence_number, which only the original flat shape had. node_type is no
    -- longer a discriminator: step 6 gives the current table a column by that name too,
    -- and matching on it would drop live telemetry on the second run.
    IF EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name = 'game_execution_nodes' AND column_name = 'sequence_number') THEN
        DROP TABLE game_execution_nodes;
        RAISE NOTICE 'dropped game_execution_nodes (pre-GameAnswer shape)';
    END IF;
END $$;

-- 6. node_types lookup removed ------------------------------------------------------
-- The type is whatever the front end reports; it is stored on the node as plain text and
-- validated against nothing, so the lookup and its foreign key are gone. Runs a level
-- deeper than step 5 only because game_answers had to lose its reference first.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name = 'game_execution_nodes' AND column_name = 'node_type_id') THEN
        IF EXISTS (SELECT 1 FROM game_execution_nodes) THEN
            RAISE EXCEPTION
                'game_execution_nodes holds % row(s) still keyed to the node_types lookup. '
                'Delete the runs (DELETE FROM game_executions;) and re-run.',
                (SELECT count(*) FROM game_execution_nodes);
        END IF;
        ALTER TABLE game_execution_nodes DROP COLUMN node_type_id;
        ALTER TABLE game_execution_nodes ADD COLUMN node_type varchar(100) NOT NULL;
        RAISE NOTICE 'game_execution_nodes.node_type_id replaced by node_type';
    END IF;
END $$;

DROP TABLE IF EXISTS node_types;

-- 7. Reclaim orphaned large objects --------------------------------------------------
-- Rows deleted while the columns were still oid left their objects behind. Guarded: if any
-- oid column survives anywhere, something still points at large objects and this must not run.
DO $$
DECLARE
    orphans bigint;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND data_type = 'oid'
    ) THEN
        RAISE NOTICE 'oid columns still present: skipping large-object cleanup';
    ELSE
        SELECT count(*) INTO orphans FROM pg_largeobject_metadata;
        PERFORM lo_unlink(oid) FROM pg_largeobject_metadata;
        RAISE NOTICE 'reclaimed % orphaned large object(s)', orphans;
    END IF;
END $$;

COMMIT;
