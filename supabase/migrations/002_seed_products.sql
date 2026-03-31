-- Seed initial products
INSERT INTO products (name, description, price_cents, currency, is_available, sort_order) VALUES
('Beers (50cl)', 'Cold beer - 50cl bottle', 250, 'eur', true, 1),
('Coca-Cola (33cl)', 'Fresh Coca-Cola - 33cl bottle', 250, 'eur', true, 2),
('Water bottle (1.5L)', 'Still water - 1.5L bottle', 200, 'eur', true, 3),
('Prosecco Bottle', 'Sparkling wine - bottle', 1500, 'eur', true, 4),
('Laundry', 'Laundry service - per set', 900, 'eur', true, 5),
('Pet Fee', 'Pet accommodation fee - per stay', 2500, 'eur', true, 6),
('Storage locker box', 'Secure storage locker - per stay', 2000, 'eur', true, 7);
