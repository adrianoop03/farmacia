from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Importar modelos para que SQLAlchemy los registre.
from models.categoria import Categoria
from models.medicamento import Medicamento
from models.empleado import Empleado

__all__ = ["db", "Categoria", "Medicamento", "Empleado"]
