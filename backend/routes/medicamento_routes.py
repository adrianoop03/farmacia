from flask import Blueprint, request, jsonify
from controllers.medicamento_controller import (
    listar_medicamentos,
    obtener_medicamento,
    crear_medicamento,
    actualizar_medicamento,
    eliminar_medicamento,
)

medicamento_bp = Blueprint("medicamento", __name__)


def _respuesta(resultado):
    cuerpo, status = resultado
    return jsonify(cuerpo), status


def _json_body():
    return request.get_json(silent=True) or {}


# GET /api/medicamentos
@medicamento_bp.route("", methods=["GET"])
def get_medicamentos():
    return _respuesta(listar_medicamentos())


# GET /api/medicamentos/<id>
@medicamento_bp.route("/<int:medicamento_id>", methods=["GET"])
def get_medicamento(medicamento_id):
    return _respuesta(obtener_medicamento(medicamento_id))


# POST /api/medicamentos
@medicamento_bp.route("", methods=["POST"])
def post_medicamento():
    return _respuesta(crear_medicamento(_json_body()))


# PUT /api/medicamentos/<id>
@medicamento_bp.route("/<int:medicamento_id>", methods=["PUT"])
def put_medicamento(medicamento_id):
    return _respuesta(actualizar_medicamento(medicamento_id, _json_body()))


# PATCH /api/medicamentos/<id>  (la función ya soporta actualización parcial)
@medicamento_bp.route("/<int:medicamento_id>", methods=["PATCH"])
def patch_medicamento(medicamento_id):
    return _respuesta(actualizar_medicamento(medicamento_id, _json_body()))


# DELETE /api/medicamentos/<id>
@medicamento_bp.route("/<int:medicamento_id>", methods=["DELETE"])
def delete_medicamento(medicamento_id):
    return _respuesta(eliminar_medicamento(medicamento_id))