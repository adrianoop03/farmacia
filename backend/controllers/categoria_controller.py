from sqlalchemy.exc import IntegrityError
from models import db, Categoria, Medicamento
#listar categorias
def listar_categorias():
    return [c.to_dict() for c in Categoria.query.order_by(Categoria.id_categoria).all()], 200
#obtener categoria
def obtener_categoria(categoria_id):
    categoria = db.session.get(Categoria, categoria_id)
    if not categoria:
        return {"error": "Categoría no encontrada"}, 404
    return categoria.to_dict(), 200
#crear categoria
def crear_categoria(data):
    nombre = str(data.get("nombre", "")).strip()
    descripcion = data.get("descripcion")
    if not nombre:
        return {"error": "El nombre de la categoría es obligatorio"}, 400

    categoria = Categoria(nombre=nombre, descripcion=descripcion)
    db.session.add(categoria)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Ya existe una categoría con ese nombre"}, 409
    return categoria.to_dict(), 201
#actualizar categoria
def actualizar_categoria(categoria_id, data):
    categoria = db.session.get(Categoria, categoria_id)
    if not categoria:
        return {"error": "Categoría no encontrada"}, 404

    if "nombre" in data:
        nombre = str(data["nombre"]).strip()
        if not nombre:
            return {"error": "El nombre no puede quedar vacío"}, 400
        categoria.nombre = nombre
    if "descripcion" in data:
        categoria.descripcion = data["descripcion"]

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Ya existe una categoría con ese nombre"}, 409
    return categoria.to_dict(), 200
#eliminar categoria
def eliminar_categoria(categoria_id):
    categoria = db.session.get(Categoria, categoria_id)
    if not categoria:
        return {"error": "Categoría no encontrada"}, 404
    if Medicamento.query.filter_by(id_categoria=categoria_id).first():
        return {"error": "No se puede eliminar: hay medicamentos asociados a esta categoría"}, 409
    db.session.delete(categoria)
    db.session.commit()
    return {"mensaje": "Categoría eliminada correctamente"}, 200
