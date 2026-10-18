from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Importar modelos para que SQLAlchemy los registre.
from models.categoria import Categoria
from models.medicamento import Medicamento
from models.empleado import Empleado
from models.usuario import Usuario

__all__ = ["db", "Categoria", "Medicamento", "Empleado", "Usuario"]
