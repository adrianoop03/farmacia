# Backend Flask

## Configurar y ejecutar

1. Desde la carpeta `backend`, crea y activa un entorno virtual.
2. Instala las dependencias con `pip install -r requirements.txt`.
3. En `.env` y configura las credenciales de MySQL.
   `CORS_ORIGINS` debe contener el origen del frontend (protocolo, host y
   puerto, sin una ruta). Por defecto permite Vite en `localhost:5173` y
   `127.0.0.1:5173`.
4. Ejecuta `python app.py`. Flask inicia la API en `http://localhost:5000`.

La API publica `/api/medicamentos`, `/api/categorias` y `/api/empleados`.
El endpoint `/api/health` permite comprobar que el servidor está activo.

## Cargar datos de prueba

Desde la carpeta `backend`, con la base de datos configurada y el entorno
virtual activo, ejecuta `python seed.py`. El comando crea las tablas que
faltan y agrega diez categorías, diez medicamentos, diez empleados y dos
usuarios de prueba. Se puede volver a ejecutar sin duplicar esos registros.
No elimina ni reemplaza datos existentes.

Las cuentas creadas son:

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin@gmail.com` | `admin1234` | admin |
| `usuario@gmail.com` | `usuario4321` | usuario |

Las contraseñas se guardan cifradas en la base de datos. Estas cuentas quedan
registradas como datos; la pantalla de inicio de sesión del frontend todavía
no está conectada a un servicio de autenticación.

## Conectar el frontend

Desde la carpeta `frontend`, copia `.env.example` a `.env` y verifica que
`VITE_API_URL` apunte a la URL base de la API, por defecto
`http://localhost:5000/api`. Luego ejecuta `npm run dev`.

Si cambias el puerto del frontend o backend, actualiza `CORS_ORIGINS` y
`VITE_API_URL` respectivamente, y reinicia ambos servidores para que tomen
la nueva configuración.
