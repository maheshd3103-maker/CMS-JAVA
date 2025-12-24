-- CMS Database Setup Script
-- Manual role assignment for users

-- Create Manager User (Initial Setup)
INSERT INTO users (username, email, password, account_number, account_balance, account_type, role) 
VALUES ('Manager Admin', 'manager@cms.com', 'manager123', 'MGR001', 0.0, 'Manager Account', 'MANAGER');

-- Manual Role Assignment Commands
-- Use these commands to change user roles after they register

-- To make a user a MANAGER:
-- UPDATE users SET role = 'MANAGER' WHERE email = 'user@example.com';

-- To revert to regular USER:
-- UPDATE users SET role = 'USER' WHERE email = 'user@example.com';

-- Check user roles
SELECT user_id, username, email, role FROM users;