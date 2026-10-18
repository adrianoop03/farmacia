from datetime import date

from werkzeug.security import generate_password_hash

from app import app
from models import Categoria, Empleado, Medicamento, Usuario, db


CATEGORIAS = [
    ("Analgésicos", "Medicamentos para aliviar el dolor."),
    ("Antibióticos", "Medicamentos para tratar infecciones bacterianas."),
    ("Antialérgicos", "Medicamentos para aliviar síntomas de alergia."),
    ("Antiinflamatorios", "Medicamentos para reducir inflamación."),
    ("Cardiovasculares", "Medicamentos para el sistema cardiovascular."),
    ("Dermatológicos", "Productos para el cuidado y tratamiento de la piel."),
    ("Digestivos", "Medicamentos para el sistema digestivo."),
    ("Vitaminas", "Suplementos vitamínicos."),
    ("Respiratorios", "Medicamentos para las vías respiratorias."),
    ("Antidiabéticos", "Medicamentos para el control de la diabetes."),
]

MEDICAMENTOS = [
    ("Paracetamol 500 mg", "Alivio del dolor y la fiebre.", "2.50", 120, date(2027, 6, 30), "Analgésicos"),
    ("Amoxicilina 500 mg", "Antibiótico de amplio uso.", "8.90", 60, date(2027, 8, 31), "Antibióticos"),
    ("Loratadina 10 mg", "Alivio de síntomas alérgicos.", "4.20", 75, date(2027, 5, 31), "Antialérgicos"),
    ("Ibuprofeno 400 mg", "Alivio del dolor y la inflamación.", "3.80", 90, date(2027, 7, 31), "Antiinflamatorios"),
    ("Losartán 50 mg", "Tratamiento para la presión arterial.", "6.50", 55, date(2027, 9, 30), "Cardiovasculares"),
    ("Crema de hidrocortisona", "Crema tópica para irritaciones leves.", "5.70", 40, date(2027, 4, 30), "Dermatológicos"),
    ("Omeprazol 20 mg", "Protector gástrico.", "4.90", 80, date(2027, 10, 31), "Digestivos"),
    ("Vitamina C 1 g", "Suplemento de vitamina C.", "3.20", 100, date(2027, 12, 31), "Vitaminas"),
    ("Jarabe expectorante", "Jarabe para aliviar la tos con flema.", "7.40", 35, date(2027, 11, 30), "Respiratorios"),
    ("Metformina 850 mg", "Medicamento para el control de la glucosa.", "5.30", 65, date(2027, 3, 31), "Antidiabéticos"),
]

EMPLEADOS = [
    ("Lucía", "Gómez", "30100001", "lucia.gomez@farmacia.test", "Farmacéutica"),
    ("Mateo", "Rodríguez", "30100002", "mateo.rodriguez@farmacia.test", "Auxiliar de farmacia"),
    ("Sofía", "Fernández", "30100003", "sofia.fernandez@farmacia.test", "Cajera"),
    ("Benjamín", "López", "30100004", "benjamin.lopez@farmacia.test", "Farmacéutico"),
    ("Valentina", "Martínez", "30100005", "valentina.martinez@farmacia.test", "Auxiliar de farmacia"),
    ("Joaquín", "Pérez", "30100006", "joaquin.perez@farmacia.test", "Repositor"),
    ("Martina", "Sánchez", "30100007", "martina.sanchez@farmacia.test", "Cajera"),
    ("Tomás", "Romero", "30100008", "tomas.romero@farmacia.test", "Farmacéutico"),
    ("Emma", "Torres", "30100009", "emma.torres@farmacia.test", "Auxiliar de farmacia"),
    ("Thiago", "Díaz", "30100010", "thiago.diaz@farmacia.test", "Repositor"),
]

USUARIOS = [
    ("admin@gmail.com", "admin1234", "admin", "admin"),
    ("usuario@gmail.com", "usuario4321", "usuario", "usuario"),
]


def seed_database():
    db.create_all()

    with db.session.begin():
        categorias_existentes = {
            categoria.nombre: categoria
            for categoria in Categoria.query.all()
        }
        for nombre, descripcion in CATEGORIAS:
            if nombre not in categorias_existentes:
                categoria = Categoria(nombre=nombre, descripcion=descripcion)
                db.session.add(categoria)
                categorias_existentes[nombre] = categoria
        db.session.flush()

        medicamentos_existentes = {
            medicamento.nombre for medicamento in Medicamento.query.all()
        }
        for nombre, descripcion, precio, stock, vencimiento, categoria_nombre in MEDICAMENTOS:
            if nombre not in medicamentos_existentes:
                db.session.add(
                    Medicamento(
                        nombre=nombre,
                        descripcion=descripcion,
                        precio=precio,
                        stock=stock,
                        fecha_vencimiento=vencimiento,
                        id_categoria=categorias_existentes[categoria_nombre].id_categoria,
                    )
                )

        empleados_existentes = {empleado.dni for empleado in Empleado.query.all()}
        for nombre, apellido, dni, email, cargo in EMPLEADOS:
            if dni not in empleados_existentes:
                db.session.add(
                    Empleado(
                        nombre=nombre,
                        apellido=apellido,
                        dni=dni,
                        email=email,
                        cargo=cargo,
                    )
                )

        for nombre_usuario, password, rol, nombre_anterior in USUARIOS:
            usuario = Usuario.query.filter_by(
                nombre_usuario=nombre_usuario
            ).one_or_none()
            if usuario is None:
                usuario = Usuario.query.filter_by(
                    nombre_usuario=nombre_anterior
                ).one_or_none()
            if usuario is None:
                usuario = Usuario(nombre_usuario=nombre_usuario)
                db.session.add(usuario)

            usuario.nombre_usuario = nombre_usuario
            usuario.password_hash = generate_password_hash(password)
            usuario.rol = rol


if __name__ == "__main__":
    with app.app_context():
        seed_database()
    print("Seed completada: 10 categorías, 10 medicamentos, 10 empleados y 2 usuarios.")
