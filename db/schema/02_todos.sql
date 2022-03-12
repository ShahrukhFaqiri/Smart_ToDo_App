-- Drop and recreate ToDos table (Example)
DROP TABLE IF EXISTS todos CASCADE;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(255) DEFAULT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
