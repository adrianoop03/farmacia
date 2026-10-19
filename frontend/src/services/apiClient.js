// src/services/apiClient.js
//
// Utilidades compartidas por los módulos que hablan con Flask
// (categorías, medicamentos, ...).

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// fetch + manejo de errores. Entiende las respuestas de error de tu backend:
//   { "error": "mensaje" }                      (404, 409, ...)
//   { "errores": { "campo": "mensaje", ... } }  (400 de validación)
export async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detalle = body.errores ? Object.values(body.errores).join('. ') : null;
    throw new Error(
      body.message ?? body.error ?? detalle ?? `Error del servidor (${response.status})`,
    );
  }

  return response.status === 204 ? null : response.json();
}

// ---------- Filtros / orden / paginación del DataGrid (en el navegador) ----------

function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'es', { sensitivity: 'base' });
}

function matches(cell, value, operator) {
  const text = String(cell ?? '').toLowerCase();
  const search = Array.isArray(value) ? '' : String(value).toLowerCase();
  const isNumber = typeof cell === 'number';

  switch (operator) {
    case 'contains':
      return text.includes(search);
    case 'doesNotContain':
      return !text.includes(search);
    case 'startsWith':
      return text.startsWith(search);
    case 'endsWith':
      return text.endsWith(search);
    case 'equals':
    case 'is':
    case '=':
      return isNumber ? cell === Number(value) : text === search;
    case 'not':
    case '!=':
      return isNumber ? cell !== Number(value) : text !== search;
    case 'isAnyOf':
      return Array.isArray(value)
        ? value.map((v) => String(v).toLowerCase()).includes(text)
        : true;
    case '>':
    case 'after':
      return isNumber ? cell > Number(value) : text > search;
    case '>=':
    case 'onOrAfter':
      return isNumber ? cell >= Number(value) : text >= search;
    case '<':
    case 'before':
      return isNumber ? cell < Number(value) : text < search;
    case '<=':
    case 'onOrBefore':
      return isNumber ? cell <= Number(value) : text <= search;
    default:
      return true;
  }
}

// Recibe TODAS las filas y devuelve { items, itemCount } de la página pedida.
export function applyGridModels(rows, { paginationModel, filterModel, sortModel }) {
  let result = [...rows];

  filterModel?.items?.forEach(({ field, value, operator }) => {
    if (!field) {
      return;
    }
    if (operator === 'isEmpty') {
      result = result.filter((r) => r[field] == null || r[field] === '');
      return;
    }
    if (operator === 'isNotEmpty') {
      result = result.filter((r) => r[field] != null && r[field] !== '');
      return;
    }
    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return;
    }
    result = result.filter((r) => matches(r[field], value, operator));
  });

  if (sortModel?.length) {
    result.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        const cmp = compareValues(a[field], b[field]);
        if (cmp !== 0) {
          return sort === 'asc' ? cmp : -cmp;
        }
      }
      return 0;
    });
  }

  const start = paginationModel.page * paginationModel.pageSize;
  return {
    items: result.slice(start, start + paginationModel.pageSize),
    itemCount: result.length,
  };
}
