-- ==============================================================================
-- TEEN TODO & PERSONAL EXPENSE TRACKER - DEVELOPMENT SEED DATA
-- NOTE: FOR DEVELOPMENT AND DEMONSTRATION PURPOSES ONLY.
-- DO NOT USE IN PRODUCTION OR WITH REAL FINANCIAL CREDENTIALS.
-- ==============================================================================

-- 1. Insert Demo User (Password is 'password123', pre-hashed with bcrypt 10 rounds)
-- Hash: $2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecgy5pWCu0.gwDF5y
INSERT INTO users (id, name, email, password_hash, avatar_url, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Alex Rivera',
    'alex@teenmoney.dev',
    '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecgy5pWCu0.gwDF5y',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Todos
INSERT INTO todos (id, user_id, title, description, status, priority, due_date, category, completed_at, created_at, updated_at)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Complete Math homework (Algebra ch. 4)', 'Exercise questions 1 through 15', 'pending', 'high', CURRENT_DATE, 'Education', NULL, NOW(), NOW()),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Exercise for 30 minutes', 'Morning cardio and pushups', 'completed', 'medium', CURRENT_DATE, 'Health', NOW(), NOW(), NOW()),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Read 20 pages of Atomic Habits', 'Chapter on identity-based habits', 'pending', 'low', CURRENT_DATE + INTERVAL '1 day', 'Personal', NULL, NOW(), NOW()),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Clean room & organize desk', 'Put away clothes and clear study table', 'completed', 'low', CURRENT_DATE, 'Chores', NOW(), NOW(), NOW()),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Prepare CS project presentation slides', 'Intro to web dev slides for class', 'in_progress', 'high', CURRENT_DATE + INTERVAL '2 days', 'Education', NULL, NOW(), NOW()),
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Return library book', 'Physics reference guide', 'pending', 'medium', CURRENT_DATE + INTERVAL '3 days', 'Errands', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demo Income (Total: ₹8,000)
INSERT INTO income (id, user_id, amount, source, description, income_date, created_at, updated_at)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 5000.00, 'Pocket Money', 'Monthly allowance from parents', CURRENT_DATE - INTERVAL '15 days', NOW(), NOW()),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2000.00, 'Part-time Work', 'Weekend tutoring junior math student', CURRENT_DATE - INTERVAL '8 days', NOW(), NOW()),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 1000.00, 'Gift', 'Birthday gift cash from grandma', CURRENT_DATE - INTERVAL '3 days', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Demo Expenses (Total: ₹3,750)
INSERT INTO expenses (id, user_id, amount, title, description, category, payment_method, expense_date, is_necessary, created_at, updated_at)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 250.00, 'McDonalds burger meal', 'Lunch with friends after exam', 'Food', 'UPI', CURRENT_DATE - INTERVAL '10 days', false, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 50.00, 'Bus pass daily ticket', 'Commute to school', 'Transport', 'Cash', CURRENT_DATE - INTERVAL '9 days', true, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 499.00, 'Steam indie game bundle', 'Weekend relaxation game', 'Gaming', 'Card', CURRENT_DATE - INTERVAL '7 days', false, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 600.00, 'Science study workbook', 'Reference book for science project', 'Education', 'UPI', CURRENT_DATE - INTERVAL '6 days', true, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 120.00, 'Metro card top-up', 'Metro travel for classes', 'Transport', 'UPI', CURRENT_DATE - INTERVAL '5 days', true, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 350.00, 'Cinema tickets with friends', 'Watched weekend sci-fi movie', 'Entertainment', 'UPI', CURRENT_DATE - INTERVAL '4 days', false, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 750.00, 'Sports shoes insoles & water bottle', 'Badminton tournament essentials', 'Sports', 'Card', CURRENT_DATE - INTERVAL '3 days', true, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 280.00, 'Boba tea & cafe snack', 'Study session cafe treats', 'Food', 'UPI', CURRENT_DATE - INTERVAL '2 days', false, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 199.00, 'Spotify Student plan', 'Monthly music subscription', 'Subscriptions', 'Card', CURRENT_DATE - INTERVAL '1 day', false, NOW(), NOW()),
    ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 652.00, 'Graphic tee from sale', 'New t-shirt for weekend outing', 'Shopping', 'Card', CURRENT_DATE, false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Demo Budgets
INSERT INTO budgets (id, user_id, category, amount, period, created_at, updated_at)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Food', 2000.00, 'monthly', NOW(), NOW()),
    ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Entertainment', 1000.00, 'monthly', NOW(), NOW()),
    ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Gaming', 500.00, 'monthly', NOW(), NOW()),
    ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Transport', 1500.00, 'monthly', NOW(), NOW()),
    ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Shopping', 1200.00, 'monthly', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Demo Savings Goals
INSERT INTO savings_goals (id, user_id, name, target_amount, current_amount, deadline, description, created_at, updated_at)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Buy new headphones', 5000.00, 2750.00, CURRENT_DATE + INTERVAL '60 days', 'Wireless active noise cancelling headphones for studying', NOW(), NOW()),
    ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Summer Coding Camp', 8000.00, 4500.00, CURRENT_DATE + INTERVAL '120 days', 'Robotics and game development bootcamp ticket', NOW(), NOW()),
    ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Emergency Fun Fund', 2000.00, 1500.00, CURRENT_DATE + INTERVAL '180 days', 'Backup pocket money for unexpected plans', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
