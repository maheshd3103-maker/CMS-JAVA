-- Run this script manually in MySQL to create the manager user
-- Make sure you're connected to the cms_db database

USE cms_db;

-- Create manager user (run this once)
INSERT INTO users (username, email, password, account_number, account_balance, account_type, role, agent_specialization, manager_id) 
VALUES ('Manager Admin', 'manager@cms.com', 'manager123', 'MGR001', 0.0, 'Manager Account', 'MANAGER', NULL, NULL)
ON DUPLICATE KEY UPDATE username = username;

-- Verify the manager was created
SELECT * FROM users WHERE role = 'MANAGER';