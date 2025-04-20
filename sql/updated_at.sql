CREATE OR REPLACE FUNCTION updated_at()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER updated_at_user BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE PROCEDURE updated_at();
CREATE TRIGGER updated_at_proxy BEFORE UPDATE ON proxy FOR EACH ROW EXECUTE PROCEDURE updated_at();
CREATE TRIGGER updated_at_proxy_log BEFORE UPDATE ON proxy_log FOR EACH ROW EXECUTE PROCEDURE updated_at();
CREATE TRIGGER updated_at_documentation BEFORE UPDATE ON documentation FOR EACH ROW EXECUTE PROCEDURE updated_at();
CREATE TRIGGER updated_at_ai_analysis BEFORE UPDATE ON ai_analysis FOR EACH ROW EXECUTE PROCEDURE updated_at();
