CREATE TABLE IF NOT EXISTS public.ai_analysis (
    analysis_id SERIAL PRIMARY KEY,
    log_id      INT NOT NULL,
    content     TEXT,                        -- The AI analysis result
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_analysis_log
        FOREIGN KEY (log_id) REFERENCES proxy_log(proxy_log_id)
        ON DELETE CASCADE
);