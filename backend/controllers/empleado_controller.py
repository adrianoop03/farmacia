import re
from sqlalchemy.exc import IntegrityError
from models import db, Empleado

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
#validar datos de empleado
def _validar(data, parcial=False):
    errores = {}
    requeridos = ("nombre", "apellido", "dni", "cargo")
    if not parcial:
        for campo in requeridos:
            if campo not in data or data[campo] is None or not str(data[campo]).strip():
                errores[campo] = "Este campo es obligatorio"

    for campo in ("nombre", "apellido", "dni", "cargo"):
        if campo in data and not str(data[campo]).strip():
            errores[campo] = "Este campo no puede quedar vacío"

    if "email" in data and data["email"] not in (None, ""):
        if not EMAIL_RE.match(str(data["email"]).strip()):
            errores["email"] = "El correo electrónico no tiene un formato válido"
    return errores
#lista empleados
def listar_empleados():
    return [e.to_dict() for e in Empleado.query.order_by(Empleado.id_empleado).all()], 200
#obtener empleado
def obtener_empleado(empleado_id):
    empleado = db.session.get(Empleado, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}, 404
    return empleado.to_dict(), 200
#crear empleado
def crear_empleado(data):
    errores = _validar(data)
    if errores:
        return {"errores": errores}, 400
    empleado = Empleado(
        nombre=str(data["nombre"]).strip(),
        apellido=str(data["apellido"]).strip(),
        dni=str(data["dni"]).strip(),
        email=str(data["email"]).strip().lower() if data.get("email") else None,
        cargo=str(data["cargo"]).strip()
    )
    db.session.add(empleado)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "El DNI ya está registrado o los datos no son válidos"}, 409
    return empleado.to_dict(), 201
#actualizar empleado
def actualizar_empleado(empleado_id, data):
    empleado = db.session.get(Empleado, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}, 404
    errores = _validar(data, parcial=True)
    if errores:
        return {"errores": errores}, 400

    for campo in ("nombre", "apellido", "dni", "cargo"):
        if campo in data:
            setattr(empleado, campo, str(data[campo]).strip())
    if "email" in data:
        empleado.email = str(data["email"]).strip().lower() if data["email"] else None

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "El DNI ya está registrado o los datos no son válidos"}, 409
    return empleado.to_dict(), 200
#eliminar empleado
def eliminar_empleado(empleado_id):
    empleado = db.session.get(Empleado, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}, 404
    db.session.delete(empleado)
    db.session.commit()
    return {"mensaje": "Empleado eliminado correctamente"}, 200
