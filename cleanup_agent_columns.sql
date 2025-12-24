-- Clean up agent-related columns from database
-- Run this script to remove agent columns from existing database

USE cms_db;

-- Remove agent-related columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS agent_specialization;
ALTER TABLE users DROP COLUMN IF EXISTS manager_id;

-- Remove assignment-related columns from complaints table  
ALTER TABLE complaints DROP COLUMN IF EXISTS assigned_agent_id;
ALTER TABLE complaints DROP COLUMN IF EXISTS assigned_by;
ALTER TABLE complaints DROP COLUMN IF EXISTS assignment_date;

-- Update any 'Submitted' or 'Assigned' status back to 'Pending'
UPDATE complaints SET status = 'Pending' WHERE status IN ('Submitted', 'Assigned');

-- Verify the cleanup
DESCRIBE users;
DESCRIBE complaints;
SELECT DISTINCT status FROM complaints;