from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.medicamento_routes import medicamento_bp
from routes.categoria_routes import categoria_bp
from routes.empleado_routes import empleado_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    app.register_blueprint(medicamento_bp, url_prefix="/api/medicamentos")
    app.register_blueprint(categoria_bp, url_prefix="/api/categorias")
    app.register_blueprint(empleado_bp, url_prefix="/api/empleados")

    @app.get("/")
    def index():
        return jsonify({
            "mensaje": "API del Sistema de Gestión para Farmacia",
            "endpoints": [
                "/api/medicamentos",
                "/api/categorias",
                "/api/empleados"
            ]
        }), 200

    @app.get("/api/health")
    def health():
        return jsonify({"estado": "ok"}), 200

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Recurso o ruta no encontrada"}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"error": "Método HTTP no permitido para esta ruta"}), 405

    @app.errorhandler(500)
    def internal_error(_error):
        return jsonify({"error": "Error interno del servidor"}), 500

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=app.config.get("DEBUG", False))
