-- Add up migration script here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE
    IF NOT EXISTS folders (
        id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        parent_id UUID REFERENCES folders ON DELETE CASCADE
    );