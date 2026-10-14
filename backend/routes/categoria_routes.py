from flask import Blueprint, request, jsonify
from controllers.categoria_controller import (
    listar_categorias,
    obtener_categoria,
    crear_categoria,
    actualizar_categoria,
    eliminar_categoria,
)

categoria_bp = Blueprint("categoria", __name__)


def _respuesta(resultado):
    cuerpo, status = resultado
    return jsonify(cuerpo), status


def _json_body():
    return request.get_json(silent=True) or {}


# GET /api/categorias
@categoria_bp.route("", methods=["GET"])
def get_categorias():
    return _respuesta(listar_categorias())


# GET /api/categorias/<id>
@categoria_bp.route("/<int:categoria_id>", methods=["GET"])
def get_categoria(categoria_id):
    return _respuesta(obtener_categoria(categoria_id))


# POST /api/categorias
@categoria_bp.route("", methods=["POST"])
def post_categoria():
    return _respuesta(crear_categoria(_json_body()))


# PUT /api/categorias/<id>
@categoria_bp.route("/<int:categoria_id>", methods=["PUT"])
def put_categoria(categoria_id):
    return _respuesta(actualizar_categoria(categoria_id, _json_body()))


# PATCH /api/categorias/<id>  (tu función ya soporta actualización parcial)
@categoria_bp.route("/<int:categoria_id>", methods=["PATCH"])
def patch_categoria(categoria_id):
    return _respuesta(actualizar_categoria(categoria_id, _json_body()))


# DELETE /api/categorias/<id>
@categoria_bp.route("/<int:categoria_id>", methods=["DELETE"])
def delete_categoria(categoria_id):
    return _respuesta(eliminar_categoria(categoria_id))