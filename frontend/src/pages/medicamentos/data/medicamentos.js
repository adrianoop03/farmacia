// src/pages/medicamentos/data/medicamentos.js

import dayjs from 'dayjs';
import { API_URL, request, applyGridModels } from '../../../services/apiClient';

const MEDICAMENTOS_URL = `${API_URL}/medicamentos`;

// ---------- Formato para mostrar ----------

export const formatPrecio = (valor) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
    Number(valor),
  );

// "2026-05-01" -> "01/05/2026"
export const formatFecha = (fecha) => (fecha ? dayjs(fecha).format('DD/MM/YYYY') : '—');

// ---------- Conversión Flask <-> frontend ----------

// Agrega `id` a partir de `id_medicamento` (el resto del template usa `id`)
const fromApi = (medicamento) => ({ ...medicamento, id: medicamento.id_medicamento });

// Lo que espera tu backend: precio numérico, stock entero, fecha YYYY-MM-DD
const toApi = (data) => ({
  nombre: (data.nombre ?? '').trim(),
  descripcion: data.descripcion?.trim() ? data.descripcion.trim() : null,
  precio: Number(data.precio),
  stock: Number(data.stock),
  fecha_vencimiento: data.fecha_vencimiento,
  id_categoria: Number(data.id_categoria),
});

// ---------- CRUD ----------

export async function getMany(params) {
  const data = await request(MEDICAMENTOS_URL);
  const list = (Array.isArray(data) ? data : []).map(fromApi);
  return applyGridModels(list, params);
}

export async function getOne(medicamentoId) {
  return fromApi(await request(`${MEDICAMENTOS_URL}/${medicamentoId}`));
}

export async function createOne(data) {
  return fromApi(
    await request(MEDICAMENTOS_URL, { method: 'POST', body: JSON.stringify(toApi(data)) }),
  );
}

export async function updateOne(medicamentoId, data) {
  return fromApi(
    await request(`${MEDICAMENTOS_URL}/${medicamentoId}`, {
      method: 'PUT',
      body: JSON.stringify(toApi(data)),
    }),
  );
}

export async function deleteOne(medicamentoId) {
  await request(`${MEDICAMENTOS_URL}/${medicamentoId}`, { method: 'DELETE' });
}

// ---------- Validación ----------
// Sigue el formato de Standard Schema: { issues: [{ message, path }] }

export function validate(medicamento) {
  let issues = [];

  const nombre = medicamento.nombre?.trim();
  const descripcion = medicamento.descripcion?.trim();
  const precio = String(medicamento.precio ?? '').trim();
  const stock = String(medicamento.stock ?? '').trim();
  const fecha = medicamento.fecha_vencimiento;
  const idCategoria = medicamento.id_categoria;

  if (!nombre) {
    issues = [...issues, { message: 'El nombre es obligatorio', path: ['nombre'] }];
  } else if (nombre.length > 150) {
    issues = [...issues, { message: 'Máximo 150 caracteres', path: ['nombre'] }];
  }

  if (descripcion && descripcion.length > 255) {
    issues = [...issues, { message: 'Máximo 255 caracteres', path: ['descripcion'] }];
  }

  if (!precio) {
    issues = [...issues, { message: 'El precio es obligatorio', path: ['precio'] }];
  } else if (Number.isNaN(Number(precio))) {
    issues = [...issues, { message: 'El precio debe ser numérico', path: ['precio'] }];
  } else if (Number(precio) <= 0) {
    issues = [...issues, { message: 'El precio debe ser mayor que cero', path: ['precio'] }];
  } else if (!/^\d{1,8}(\.\d{1,2})?$/.test(precio)) {
    issues = [
      ...issues,
      { message: 'Hasta 8 enteros y 2 decimales', path: ['precio'] },
    ];
  }

  if (!stock) {
    issues = [...issues, { message: 'El stock es obligatorio', path: ['stock'] }];
  } else if (!/^\d+$/.test(stock)) {
    issues = [
      ...issues,
      { message: 'El stock debe ser un entero igual o mayor que 0', path: ['stock'] },
    ];
  }

  if (!fecha) {
    issues = [
      ...issues,
      { message: 'La fecha de vencimiento es obligatoria', path: ['fecha_vencimiento'] },
    ];
  } else if (
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
    Number.isNaN(Date.parse(`${fecha}T00:00:00`))
  ) {
    issues = [
      ...issues,
      { message: 'La fecha no es válida', path: ['fecha_vencimiento'] },
    ];
  }

  if (idCategoria === '' || idCategoria == null) {
    issues = [...issues, { message: 'Seleccioná una categoría', path: ['id_categoria'] }];
  }

  return { issues };
}
