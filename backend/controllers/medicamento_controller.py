from datetime import date
from decimal import Decimal, InvalidOperation
from sqlalchemy.exc import IntegrityError
from models import db, Medicamento, Categoria
#validar datos de medicamento
def _validar_datos(data, parcial=False):
    errores = {}
    requeridos = ("nombre", "precio", "stock", "fecha_vencimiento", "id_categoria")
    if not parcial:
        for campo in requeridos:
            if campo not in data or data[campo] in (None, ""):
                errores[campo] = "Este campo es obligatorio"

    if "nombre" in data and not str(data["nombre"]).strip():
        errores["nombre"] = "El nombre no puede estar vacío"

    if "precio" in data:
        try:
            precio = Decimal(str(data["precio"]))
            if not precio.is_finite() or precio <= 0:
                errores["precio"] = "El precio debe ser mayor que cero"
        except (InvalidOperation, ValueError):
            errores["precio"] = "El precio debe ser numérico"

    if "stock" in data:
        try:
            stock = int(data["stock"])
            if stock < 0 or str(data["stock"]).strip() != str(stock):
                errores["stock"] = "El stock debe ser un entero igual o mayor que cero"
        except (TypeError, ValueError):
            errores["stock"] = "El stock debe ser un número entero"

    if "id_categoria" in data:
        try:
            categoria_id = int(data["id_categoria"])
            if not db.session.get(Categoria, categoria_id):
                errores["id_categoria"] = "La categoría indicada no existe"
        except (TypeError, ValueError):
            errores["id_categoria"] = "id_categoria debe ser un número entero"

    if "fecha_vencimiento" in data:
        try:
            date.fromisoformat(data["fecha_vencimiento"])
        except (TypeError, ValueError):
            errores["fecha_vencimiento"] = "La fecha debe tener formato YYYY-MM-DD y ser válida"

    return errores
#listar medicamentos
def listar_medicamentos():
    items = Medicamento.query.order_by(Medicamento.id_medicamento).all()
    return [m.to_dict() for m in items], 200
#obtener medicamento
def obtener_medicamento(medicamento_id):
    medicamento = db.session.get(Medicamento, medicamento_id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    return medicamento.to_dict(), 200
#crear medicamento
def crear_medicamento(data):
    errores = _validar_datos(data)
    if errores:
        return {"errores": errores}, 400
    medicamento = Medicamento(
        nombre=str(data["nombre"]).strip(),
        descripcion=data.get("descripcion"),
        precio=Decimal(str(data["precio"])),
        stock=int(data["stock"]),
        fecha_vencimiento=date.fromisoformat(data["fecha_vencimiento"]),
        id_categoria=int(data["id_categoria"])
    )
    db.session.add(medicamento)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "No se pudo guardar el medicamento por una restricción de datos"}, 409
    return medicamento.to_dict(), 201
#actualizar medicamento
def actualizar_medicamento(medicamento_id, data):
    medicamento = db.session.get(Medicamento, medicamento_id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    errores = _validar_datos(data, parcial=True)
    if errores:
        return {"errores": errores}, 400

    if "nombre" in data: medicamento.nombre = str(data["nombre"]).strip()
    if "descripcion" in data: medicamento.descripcion = data["descripcion"]
    if "precio" in data: medicamento.precio = Decimal(str(data["precio"]))
    if "stock" in data: medicamento.stock = int(data["stock"])
    if "id_categoria" in data: medicamento.id_categoria = int(data["id_categoria"])
    if "fecha_vencimiento" in data:
        try:
            medicamento.fecha_vencimiento = date.fromisoformat(data["fecha_vencimiento"])
        except (TypeError, ValueError):
            return {"errores": {"fecha_vencimiento": "La fecha debe tener formato YYYY-MM-DD y ser válida"}}, 400

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "No se pudo actualizar el medicamento por una restricción de datos"}, 409
    return medicamento.to_dict(), 200
#eliminar medicamento
def eliminar_medicamento(medicamento_id):
    medicamento = db.session.get(Medicamento, medicamento_id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    db.session.delete(medicamento)
    db.session.commit()
    return {"mensaje": "Medicamento eliminado correctamente"}, 200
