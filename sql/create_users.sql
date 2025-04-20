CREATE TABLE IF NOT EXISTS public.user (
    user_id      SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255),
    provider     VARCHAR(50),
    role         VARCHAR(50) DEFAULT 'USER',
    is_active    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.user ADD COLUMN pricing_plan VARCHAR(50) NOT NULL DEFAULT 'Free';