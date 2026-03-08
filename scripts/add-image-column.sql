ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) DEFAULT '';

-- Set images for existing articles
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=400&fit=crop' WHERE id = '1';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?w=800&h=400&fit=crop' WHERE id = '2';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=800&h=400&fit=crop' WHERE id = '3';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=400&fit=crop' WHERE id = '4';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=800&h=400&fit=crop' WHERE id = '5';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop' WHERE id = '6';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&h=400&fit=crop' WHERE id = '7';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop' WHERE id = '8';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=400&fit=crop' WHERE id = '9';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=400&fit=crop' WHERE id = '10';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&h=400&fit=crop' WHERE id = '11';
UPDATE articles SET image_url = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop' WHERE id = '12';
