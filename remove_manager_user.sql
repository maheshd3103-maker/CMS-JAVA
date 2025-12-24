-- Remove the auto-created manager user
USE cms_db;

-- Delete the manager user
DELETE FROM users WHERE email = 'manager@cms.com';

-- Verify deletion
SELECT * FROM users WHERE role = 'MANAGER';