from flask import Flask, request
from flask_cors import CORS
from api.auth.auth_controller import auth_bp
from api.proxy.proxy_controller import proxy_bp
from api.proxy_log.proxy_log_controller import proxy_log_bp
from api.pricing.pricing_controller import pricing_bp
from api.util import UnauthorizedError

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Allow OPTIONS
    allow_headers=["Content-Type", "Authorization"],  # Allow necessary headers
)

app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
app.register_blueprint(proxy_bp, url_prefix='/api/v1/proxies')
app.register_blueprint(proxy_log_bp, url_prefix='/api/v1/proxies')
app.register_blueprint(pricing_bp, url_prefix='/api/v1/pricing')

@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response


@app.errorhandler(Exception)
def handle_error(e):
    if isinstance(e, ValueError):
        return {"error": str(e)}, 400
    if isinstance(e, UnauthorizedError):
        return {"error": str(e)}, 401
    return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(port=8080, debug=True)