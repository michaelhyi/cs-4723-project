CREATE TABLE IF NOT EXISTS public.proxy_log (
    proxy_log_id    SERIAL PRIMARY KEY,
    proxy_id        INT NOT NULL,
    timestamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method          VARCHAR(10),         -- like GET or POST
    path            VARCHAR(255),
    status_code     INT,
    headers         TEXT,
    body            TEXT,
    request_or_response CHAR(1) DEFAULT 'R',

    CONSTRAINT fk_log_proxy
        FOREIGN KEY (proxy_id) REFERENCES proxy(proxy_id)
        ON DELETE CASCADE
);

ALTER TABLE public.proxy_log
DROP COLUMN headers, DROP COLUMN body, DROP COLUMN request_or_response,
ADD request_headers TEXT NOT NULL, ADD response_headers TEXT NOT NULL,
ADD request_body TEXT NOT NULL, ADD response_body TEXT NOT NULL,
ALTER COLUMN status_code SET NOT NULL, ALTER COLUMN path SET NOT NULL, ALTER COLUMN method SET NOT NULL;