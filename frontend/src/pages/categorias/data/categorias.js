// src/pages/categorias/data/categorias.js

import { API_URL, request, applyGridModels } from '../../../services/apiClient';

const CATEGORIAS_URL = `${API_URL}/categorias`;

// Flask -> frontend: agrega `id` a partir de `id_categoria`
const fromApi = (categoria) => ({ ...categoria, id: categoria.id_categoria });

// Frontend -> Flask
const toApi = (data) => ({
  nombre: (data.nombre ?? '').trim(),
  descripcion: data.descripcion?.trim() ? data.descripcion.trim() : null,
});

// Lista completa (sin paginar). La usa el formulario de medicamentos para el selector.
export async function getAll() {
  const data = await request(CATEGORIAS_URL);
  return (Array.isArray(data) ? data : []).map(fromApi);
}

export async function getMany(params) {
  return applyGridModels(await getAll(), params);
}

export async function getOne(categoriaId) {
  return fromApi(await request(`${CATEGORIAS_URL}/${categoriaId}`));
}

export async function createOne(data) {
  return fromApi(
    await request(CATEGORIAS_URL, { method: 'POST', body: JSON.stringify(toApi(data)) }),
  );
}

export async function updateOne(categoriaId, data) {
  return fromApi(
    await request(`${CATEGORIAS_URL}/${categoriaId}`, {
      method: 'PUT',
      body: JSON.stringify(toApi(data)),
    }),
  );
}

export async function deleteOne(categoriaId) {
  await request(`${CATEGORIAS_URL}/${categoriaId}`, { method: 'DELETE' });
}

export function validate(categoria) {
  let issues = [];

  const nombre = categoria.nombre?.trim();
  const descripcion = categoria.descripcion?.trim();

  if (!nombre) {
    issues = [...issues, { message: 'El nombre es obligatorio', path: ['nombre'] }];
  } else if (nombre.length > 100) {
    issues = [...issues, { message: 'Máximo 100 caracteres', path: ['nombre'] }];
  }

  if (descripcion && descripcion.length > 255) {
    issues = [...issues, { message: 'Máximo 255 caracteres', path: ['descripcion'] }];
  }

  return { issues };
}
