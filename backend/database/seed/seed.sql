-- Seed data for DistroViz

-- Insert users (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password_hash, role) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@distroviz.com', '$2b$10$rQnM1xfK8Y5vJ7lPdZ8x4uYxZ9vJ7lPdZ8x4uYxZ9vJ7lPdZ8x4u', 'admin'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'operator@distroviz.com', '$2b$10$rQnM1xfK8Y5vJ7lPdZ8x4uYxZ9vJ7lPdZ8x4uYxZ9vJ7lPdZ8x4u', 'operator'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'viewer@distroviz.com', '$2b$10$rQnM1xfK8Y5vJ7lPdZ8x4uYxZ9vJ7lPdZ8x4uYxZ9vJ7lPdZ8x4u', 'viewer');

-- Insert plants
INSERT INTO plants (id, name, location) VALUES
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Plant Alpha', 'New York, NY'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Plant Beta', 'Los Angeles, CA'),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Plant Gamma', 'Chicago, IL');

-- Insert distribution centers
INSERT INTO distribution_centers (id, name, address) VALUES
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'DC East', '123 Warehouse Ave, Newark, NJ'),
    ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'DC West', '456 Distribution Blvd, Los Angeles, CA'),
    ('12eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'DC Central', '789 Logistics Way, Dallas, TX');

-- Insert orders
INSERT INTO orders (id, user_id, plant_id, distribution_center_id, status, created_at, updated_at) VALUES
    ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'completed', '2024-01-15T10:30:00Z', '2024-01-16T14:20:00Z'),
    ('21eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'pending', '2024-01-20T08:00:00Z', '2024-01-20T08:00:00Z'),
    ('22eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '12eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'processing', '2024-01-22T11:15:00Z', '2024-01-22T15:45:00Z');

-- Insert order items
INSERT INTO order_items (id, order_id, product_name, quantity, unit_price) VALUES
    ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Widget A', 100, 25.99),
    ('31eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Widget B', 50, 15.50),
    ('32eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', '21eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Gadget X', 200, 45.00),
    ('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '22eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Device Y', 75, 89.99);