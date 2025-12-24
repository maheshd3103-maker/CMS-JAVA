-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
    agent_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    agent_id BIGINT NOT NULL,
    assigned_date DATETIME NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id),
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
);

-- Add new columns to complaints table
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS assigned_agent_id BIGINT,
ADD COLUMN IF NOT EXISTS resolution_notes TEXT,
ADD FOREIGN KEY (assigned_agent_id) REFERENCES agents(agent_id);

-- Insert sample agents
INSERT INTO agents (agent_name, email, password, department, status) VALUES
('Technical Agent 1', 'technical1@cms.com', 'password123', 'TECHNICAL', 'ACTIVE'),
('Technical Agent 2', 'technical2@cms.com', 'password123', 'TECHNICAL', 'ACTIVE'),
('Billing Agent 1', 'billing1@cms.com', 'password123', 'BILLING', 'ACTIVE'),
('Billing Agent 2', 'billing2@cms.com', 'password123', 'BILLING', 'ACTIVE'),
('Services Agent', 'services@cms.com', 'password123', 'SERVICES', 'ACTIVE'),
('Account Agent 1', 'account1@cms.com', 'password123', 'ACCOUNT', 'ACTIVE'),
('Account Agent 2', 'account2@cms.com', 'password123', 'ACCOUNT', 'ACTIVE');

-- Update existing complaint statuses for demo
UPDATE complaints SET status = 'SUBMITTED' WHERE status = 'Pending';