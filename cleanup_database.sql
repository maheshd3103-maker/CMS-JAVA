-- Clean up demo users from database
-- Run this script to remove the demo agents and users

USE cms_db;

-- Delete demo agents (IDs 10-13)
DELETE FROM users WHERE user_id IN (10, 11, 12, 13);

-- Delete demo users (IDs 14-15)
DELETE FROM users WHERE user_id IN (14, 15);

-- Keep only real users:
-- ID 1: mahesh@gmail.com (USER)
-- ID 2: admin@gmail.com (MANAGER) 
-- ID 8: kumar@gmail.com (USER)
-- ID 9: manager@cms.com (MANAGER)
-- ID 16: nikhil@gmail.com (USER)

-- Verify remaining users
SELECT user_id, username, email, role, agent_specialization, manager_id FROM users ORDER BY user_id;