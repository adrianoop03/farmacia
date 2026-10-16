// src/pages/empleados/CrudDashboard.jsx

import CssBaseline from '@mui/material/CssBaseline';
import { createHashRouter, RouterProvider } from 'react-router';
import DashboardLayout from './components/DashboardLayout';
import EmployeeList from './components/EmployeeList';
import EmployeeShow from './components/EmployeeShow';
import EmployeeCreate from './components/EmployeeCreate';
import EmployeeEdit from './components/EmployeeEdit';
import CategoriaList from '../categorias/components/CategoriaList';
import CategoriaShow from '../categorias/components/CategoriaShow';
import CategoriaCreate from '../categorias/components/CategoriaCreate';
import CategoriaEdit from '../categorias/components/CategoriaEdit';
import MedicamentoList from '../medicamentos/components/MedicamentoList';
import MedicamentoShow from '../medicamentos/components/MedicamentoShow';
import MedicamentoCreate from '../medicamentos/components/MedicamentoCreate';
import MedicamentoEdit from '../medicamentos/components/MedicamentoEdit';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from '../shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';

const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
      // ----- Empleados -----
      {
        path: '/employees',
        Component: EmployeeList,
      },
      {
        path: '/employees/:employeeId',
        Component: EmployeeShow,
      },
      {
        path: '/employees/new',
        Component: EmployeeCreate,
      },
      {
        path: '/employees/:employeeId/edit',
        Component: EmployeeEdit,
      },
      // ----- Categorías -----
      {
        path: '/categorias',
        Component: CategoriaList,
      },
      {
        path: '/categorias/:categoriaId',
        Component: CategoriaShow,
      },
      {
        path: '/categorias/new',
        Component: CategoriaCreate,
      },
      {
        path: '/categorias/:categoriaId/edit',
        Component: CategoriaEdit,
      },
      // ----- Medicamentos -----
      {
        path: '/medicamentos',
        Component: MedicamentoList,
      },
      {
        path: '/medicamentos/:medicamentoId',
        Component: MedicamentoShow,
      },
      {
        path: '/medicamentos/new',
        Component: MedicamentoCreate,
      },
      {
        path: '/medicamentos/:medicamentoId/edit',
        Component: MedicamentoEdit,
      },
      // Fallback route for the example routes in dashboard sidebar items
      {
        path: '*',
        Component: EmployeeList,
      },
    ],
  },
]);

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
