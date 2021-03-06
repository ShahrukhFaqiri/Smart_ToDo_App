-- Drop and recreate ToDos table (Example)
DROP TABLE IF EXISTS todos CASCADE;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category VARCHAR(255) DEFAULT 'Products',
  timestamp TIMESTAMP DEFAULT NOW(),
  complete BOOLEAN DEFAULT FALSE
);
