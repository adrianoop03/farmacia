from flask import Blueprint, request, jsonify
from controllers.empleado_controller import (
    listar_empleados,
    obtener_empleado,
    crear_empleado,
    actualizar_empleado,
    eliminar_empleado,
)

empleado_bp = Blueprint("empleado", __name__)


def _respuesta(resultado):
    cuerpo, status = resultado
    return jsonify(cuerpo), status


def _json_body():
    return request.get_json(silent=True) or {}


# GET /api/empleados
@empleado_bp.route("", methods=["GET"])
def get_empleados():
    return _respuesta(listar_empleados())


# GET /api/empleados/<id>
@empleado_bp.route("/<int:empleado_id>", methods=["GET"])
def get_empleado(empleado_id):
    return _respuesta(obtener_empleado(empleado_id))


# POST /api/empleados
@empleado_bp.route("", methods=["POST"])
def post_empleado():
    return _respuesta(crear_empleado(_json_body()))


# PUT /api/empleados/<id>
@empleado_bp.route("/<int:empleado_id>", methods=["PUT"])
def put_empleado(empleado_id):
    return _respuesta(actualizar_empleado(empleado_id, _json_body()))


# PATCH /api/empleados/<id>  (la función ya soporta actualización parcial)
@empleado_bp.route("/<int:empleado_id>", methods=["PATCH"])
def patch_empleado(empleado_id):
    return _respuesta(actualizar_empleado(empleado_id, _json_body()))


# DELETE /api/empleados/<id>
@empleado_bp.route("/<int:empleado_id>", methods=["DELETE"])
def delete_empleado(empleado_id):
    return _respuesta(eliminar_empleado(empleado_id))