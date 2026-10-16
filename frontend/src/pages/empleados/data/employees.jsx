// src/pages/empleados/data/employees.js
//
// Capa de datos del CRUD de empleados. Habla con la API de Flask.
// El resto de los componentes sigue usando `id`; aquí se traduce desde/hacia `id_empleado`.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const EMPLEADOS_URL = `${API_URL}/empleados`;

// ---------- Helpers ----------

// Flask -> frontend: agrega `id` a partir de `id_empleado`
function fromApi(empleado) {
  return { ...empleado, id: empleado.id_empleado };
}

// Frontend -> Flask: saca `id` y limpia los valores
function toApi(data) {
  return {
    nombre: (data.nombre ?? '').trim(),
    apellido: (data.apellido ?? '').trim(),
    dni: (data.dni ?? '').trim(),
    email: data.email?.trim() ? data.email.trim() : null, // email es opcional
    cargo: (data.cargo ?? '').trim(),
  };
}

async function request(url, options = {}) {
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
    throw new Error(
      body.message ?? body.error ?? `Error del servidor (${response.status})`,
    );
  }

  return response.status === 204 ? null : response.json();
}

function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'es', { sensitivity: 'base' });
}

// ---------- CRUD ----------

export async function getMany({ paginationModel, filterModel, sortModel }) {
  const data = await request(EMPLEADOS_URL);
  const list = Array.isArray(data) ? data : (data.empleados ?? data.items ?? []);

  let filteredEmployees = list.map(fromApi);

  // Filtros
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field) {
        return;
      }

      // isEmpty / isNotEmpty no llevan valor
      if (operator === 'isEmpty') {
        filteredEmployees = filteredEmployees.filter(
          (e) => e[field] == null || e[field] === '',
        );
        return;
      }
      if (operator === 'isNotEmpty') {
        filteredEmployees = filteredEmployees.filter(
          (e) => e[field] != null && e[field] !== '',
        );
        return;
      }

      if (value == null || value === '') {
        return;
      }

      const search = String(value).toLowerCase();

      filteredEmployees = filteredEmployees.filter((employee) => {
        const employeeValue = employee[field];
        const text = String(employeeValue ?? '').toLowerCase();

        switch (operator) {
          case 'contains':
            return text.includes(search);
          case 'equals':
            return text === search;
          case 'startsWith':
            return text.startsWith(search);
          case 'endsWith':
            return text.endsWith(search);
          case 'isAnyOf':
            return Array.isArray(value)
              ? value.map((v) => String(v).toLowerCase()).includes(text)
              : true;
          case '>':
            return employeeValue > value;
          case '<':
            return employeeValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Orden
  if (sortModel?.length) {
    filteredEmployees.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        const result = compareValues(a[field], b[field]);
        if (result !== 0) {
          return sort === 'asc' ? result : -result;
        }
      }
      return 0;
    });
  }

  // Paginación
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;

  return {
    items: filteredEmployees.slice(start, end),
    itemCount: filteredEmployees.length,
  };
}

export async function getOne(employeeId) {
  const data = await request(`${EMPLEADOS_URL}/${employeeId}`);
  return fromApi(data);
}

export async function createOne(data) {
  const created = await request(EMPLEADOS_URL, {
    method: 'POST',
    body: JSON.stringify(toApi(data)),
  });
  return fromApi(created);
}

export async function updateOne(employeeId, data) {
  const updated = await request(`${EMPLEADOS_URL}/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify(toApi(data)),
  });
  return fromApi(updated);
}

export async function deleteOne(employeeId) {
  await request(`${EMPLEADOS_URL}/${employeeId}`, { method: 'DELETE' });
}

// ---------- Validación ----------
// Sigue el formato de Standard Schema: { issues: [{ message, path }] }

export function validate(employee) {
  let issues = [];

  const nombre = employee.nombre?.trim();
  const apellido = employee.apellido?.trim();
  const dni = employee.dni?.trim();
  const email = employee.email?.trim();
  const cargo = employee.cargo?.trim();

  if (!nombre) {
    issues = [...issues, { message: 'El nombre es obligatorio', path: ['nombre'] }];
  } else if (nombre.length > 100) {
    issues = [...issues, { message: 'Máximo 100 caracteres', path: ['nombre'] }];
  }

  if (!apellido) {
    issues = [...issues, { message: 'El apellido es obligatorio', path: ['apellido'] }];
  } else if (apellido.length > 100) {
    issues = [...issues, { message: 'Máximo 100 caracteres', path: ['apellido'] }];
  }

  if (!dni) {
    issues = [...issues, { message: 'El DNI es obligatorio', path: ['dni'] }];
  } else if (dni.length > 20) {
    issues = [...issues, { message: 'Máximo 20 caracteres', path: ['dni'] }];
  }

  if (email) {
    if (email.length > 150) {
      issues = [...issues, { message: 'Máximo 150 caracteres', path: ['email'] }];
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      issues = [...issues, { message: 'El email no es válido', path: ['email'] }];
    }
  }

  if (!cargo) {
    issues = [...issues, { message: 'El cargo es obligatorio', path: ['cargo'] }];
  } else if (cargo.length > 100) {
    issues = [...issues, { message: 'Máximo 100 caracteres', path: ['cargo'] }];
  }

  return { issues };
}
