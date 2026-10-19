import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router-dom';

import AppNavbar from '../pages/dashboard/components/AppNavbar';
import SideMenu from '../pages/dashboard/components/SideMenu';
import AppTheme from '../pages/shared-theme/AppTheme';

import NotificationsProvider from '../pages/empleados/hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../pages/empleados/hooks/useDialogs/DialogsProvider';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  formInputCustomizations,
} from '../pages/empleados/theme/customizations';

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...formInputCustomizations,
};

export default function DashboardLayout() {
  return (
    <AppTheme themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <Box sx={{ display: 'flex' }}>
            <SideMenu />
            <AppNavbar />

            <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: theme.vars
                  ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                  : alpha(theme.palette.background.default, 1),
                overflow: 'auto',
                minWidth: 0,
              })}
            >
              <Stack
                spacing={2}
                sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}
              >
                <Box sx={{ width: '100%', maxWidth: '1700px' }}>
                  <Outlet />
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}