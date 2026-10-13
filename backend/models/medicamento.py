from models import db

class Medicamento(db.Model):
    __tablename__ = "medicamentos"

    id_medicamento = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.String(255), nullable=True)
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    fecha_vencimiento = db.Column(db.Date, nullable=False)
    id_categoria = db.Column(
        db.Integer,
        db.ForeignKey("categorias.id_categoria", ondelete="RESTRICT"),
        nullable=False
    )

    categoria = db.relationship("Categoria", back_populates="medicamentos")

    def to_dict(self):
        return {
            "id_medicamento": self.id_medicamento,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": float(self.precio),
            "stock": self.stock,
            "fecha_vencimiento": self.fecha_vencimiento.isoformat(),
            "id_categoria": self.id_categoria,
            "categoria": self.categoria.nombre if self.categoria else None
        }
