import { Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';

import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/dashboard/Dashboard';
{/*import Empleados from './pages/empleados/Empleados';
import Medicamentos from './pages/medicamentos/Medicamentos';
import Categorias from './pages/categorias/Categorias';
*/}
export default function App() {
  return (
    <Routes>
      {/* Acceso público */}
      <Route path="/login" element={<SignIn />} />

      {/* Secciones del panel administrativo */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/*<Route path="/empleados" element={<Empleados />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/categorias" element={<Categorias />} />*/}

        {/* Alta de empleados, dentro del panel */}
        <Route path="/empleados/nuevo" element={<SignUp />} />
      </Route>

      {/* Rutas desconocidas */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}