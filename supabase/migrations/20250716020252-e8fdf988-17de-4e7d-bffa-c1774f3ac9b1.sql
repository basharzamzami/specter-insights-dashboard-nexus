-- Insert dummy contacts first
INSERT INTO public.contacts (user_id, first_name, last_name, email, company, job_title, phone, lead_status, lead_score, lead_source) VALUES
('00000000-0000-0000-0000-000000000001', 'John', 'Smith', 'john.smith@acmecorp.com', 'Acme Corporation', 'CTO', '+1-555-0101', 'qualified', 85, 'website'),
('00000000-0000-0000-0000-000000000001', 'Sarah', 'Johnson', 'sarah.j@techstart.io', 'TechStart Inc', 'CEO', '+1-555-0102', 'proposal', 90, 'referral'),
('00000000-0000-0000-0000-000000000001', 'Mike', 'Chen', 'mike.chen@globaltech.com', 'GlobalTech Solutions', 'VP Engineering', '+1-555-0103', 'negotiation', 95, 'cold_call'),
('00000000-0000-0000-0000-000000000001', 'Emma', 'Williams', 'e.williams@innovate.com', 'Innovate Labs', 'Head of Product', '+1-555-0104', 'qualified', 80, 'linkedin'),
('00000000-0000-0000-0000-000000000001', 'David', 'Brown', 'david@startup.co', 'Future Startup', 'Founder', '+1-555-0105', 'prospecting', 65, 'trade_show'),
('00000000-0000-0000-0000-000000000001', 'Lisa', 'Davis', 'lisa.davis@megacorp.com', 'MegaCorp Industries', 'IT Director', '+1-555-0106', 'qualified', 88, 'webinar'),
('00000000-0000-0000-0000-000000000001', 'Robert', 'Wilson', 'r.wilson@scaleup.com', 'ScaleUp Ventures', 'COO', '+1-555-0107', 'proposal', 92, 'referral'),
('00000000-0000-0000-0000-000000000001', 'Jessica', 'Taylor', 'j.taylor@enterprise.com', 'Enterprise Solutions', 'CIO', '+1-555-0108', 'negotiation', 97, 'partner');

-- Insert dummy deals using the pipeline and contacts
INSERT INTO public.deals (user_id, pipeline_id, contact_id, title, description, value, stage, probability, expected_close_date, status) VALUES
-- Get pipeline and contact IDs first, then use them
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'john.smith@acmecorp.com'), 'Acme Corp - Enterprise License', 'Large enterprise deal for 500+ user licenses with advanced features', 250000, 'Proposal', 75, '2024-08-15', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'sarah.j@techstart.io'), 'TechStart - Startup Package', 'Growing startup needs scalable solution for rapid team expansion', 85000, 'Negotiation', 90, '2024-07-30', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'mike.chen@globaltech.com'), 'GlobalTech - Integration Project', 'Complex integration with existing enterprise systems', 180000, 'Negotiation', 85, '2024-08-20', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'e.williams@innovate.com'), 'Innovate Labs - Product Suite', 'Full product suite for innovative R&D team', 120000, 'Qualification', 60, '2024-09-10', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'david@startup.co'), 'Future Startup - Growth Plan', 'Flexible solution for high-growth startup environment', 45000, 'Prospecting', 40, '2024-09-30', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'lisa.davis@megacorp.com'), 'MegaCorp - Department License', 'Department-wide implementation for IT division', 320000, 'Proposal', 80, '2024-08-05', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'r.wilson@scaleup.com'), 'ScaleUp - Multi-Year Contract', 'Three-year enterprise contract with training and support', 280000, 'Negotiation', 95, '2024-07-25', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'j.taylor@enterprise.com'), 'Enterprise - Complete Solution', 'End-to-end enterprise solution with custom integrations', 450000, 'Closed Won', 100, '2024-06-15', 'closed'),
-- Add a few more deals in different stages
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'john.smith@acmecorp.com'), 'Acme - Additional Modules', 'Expansion deal for additional product modules', 75000, 'Qualification', 70, '2024-10-15', 'open'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM pipelines LIMIT 1), (SELECT id FROM contacts WHERE email = 'sarah.j@techstart.io'), 'TechStart - Professional Services', 'Professional services and consulting package', 35000, 'Prospecting', 50, '2024-11-01', 'open');