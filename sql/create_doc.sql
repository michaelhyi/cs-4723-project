CREATE TABLE IF NOT EXISTS public.documentation (
    doc_id          SERIAL PRIMARY KEY,
    proxy_id        INT NOT NULL,
    title           VARCHAR(255),
    file_path       VARCHAR(255) NOT NULL,   -- Stores the path or URL of the uploaded file
    content_type    VARCHAR(100) NOT NULL,     -- MIME type of the file like "application/pdf" or "text/markdown"
    file_size       BIGINT,                  -- We could also additionally have the size of the file in bytes saved too
    version         VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_doc_proxy
        FOREIGN KEY (proxy_id) REFERENCES proxy(proxy_id)
        ON DELETE CASCADE
);