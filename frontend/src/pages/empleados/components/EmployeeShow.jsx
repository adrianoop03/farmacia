// src/pages/empleados/components/EmployeeShow.js

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  deleteOne as deleteEmployee,
  getOne as getEmployee,
} from '../data/employees';
import PageContainer from './PageContainer';

export default function EmployeeShow() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [employee, setEmployee] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getEmployee(Number(employeeId));

      setEmployee(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [employeeId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEmployeeEdit = React.useCallback(() => {
    navigate(`/employees/${employeeId}/edit`);
  }, [navigate, employeeId]);

  const handleEmployeeDelete = React.useCallback(async () => {
    if (!employee) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `¿Querés eliminar a ${employee.nombre} ${employee.apellido}?`,
      {
        title: '¿Eliminar empleado?',
        severity: 'error',
        okText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteEmployee(Number(employeeId));

        navigate('/employees');

        notifications.show('Empleado eliminado correctamente.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `No se pudo eliminar el empleado. Motivo: ${deleteError.message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [employee, dialogs, employeeId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/employees');
  }, [navigate]);

  const renderShow = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return employee ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Nombre</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {employee.nombre}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Apellido</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {employee.apellido}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">DNI</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {employee.dni}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Email</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {employee.email || '—'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Cargo</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {employee.cargo}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Volver
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEmployeeEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleEmployeeDelete}
            >
              Eliminar
            </Button>
          </Stack>
        </Stack>
      </Box>
    ) : null;
  }, [
    isLoading,
    error,
    employee,
    handleBack,
    handleEmployeeEdit,
    handleEmployeeDelete,
  ]);

  const pageTitle = employee
    ? `${employee.nombre} ${employee.apellido}`
    : `Empleado ${employeeId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Empleados', path: '/employees' },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}
