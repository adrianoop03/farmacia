import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/sign-in/SignIn'
import SignUp from './pages/sign-up/SignUp'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'

import EmployeeList from './pages/empleados/components/EmployeeList'
import EmployeeShow from './pages/empleados/components/EmployeeShow'
import EmployeeCreate from './pages/empleados/components/EmployeeCreate'
import EmployeeEdit from './pages/empleados/components/EmployeeEdit'
import CategoriaList from './pages/categorias/components/CategoriaList'
import CategoriaShow from './pages/categorias/components/CategoriaShow'
import CategoriaCreate from './pages/categorias/components/CategoriaCreate'
import CategoriaEdit from './pages/categorias/components/CategoriaEdit'
import MedicamentoList from './pages/medicamentos/components/MedicamentoList'
import MedicamentoShow from './pages/medicamentos/components/MedicamentoShow'
import MedicamentoCreate from './pages/medicamentos/components/MedicamentoCreate'
import MedicamentoEdit from './pages/medicamentos/components/MedicamentoEdit'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/empleados" element={<EmployeeList />} />
        <Route path="/empleados/new" element={<EmployeeCreate />} />
        <Route path="/empleados/:employeeId" element={<EmployeeShow />} />
        <Route path="/empleados/:employeeId/edit" element={<EmployeeEdit />} />

        <Route path="/categorias" element={<CategoriaList />} />
        <Route path="/categorias/new" element={<CategoriaCreate />} />
        <Route path="/categorias/:categoriaId" element={<CategoriaShow />} />
        <Route path="/categorias/:categoriaId/edit" element={<CategoriaEdit />} />

        <Route path="/medicamentos" element={<MedicamentoList />} />
        <Route path="/medicamentos/new" element={<MedicamentoCreate />} />
        <Route path="/medicamentos/:medicamentoId" element={<MedicamentoShow />} />
        <Route path="/medicamentos/:medicamentoId/edit" element={<MedicamentoEdit />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}