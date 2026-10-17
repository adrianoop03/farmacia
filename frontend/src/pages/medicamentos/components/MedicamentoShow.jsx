// src/pages/medicamentos/components/MedicamentoShow.jsx

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
import { useNavigate, useParams } from 'react-router-dom';
import { useDialogs } from '../../empleados/hooks/useDialogs/useDialogs';
import useNotifications from '../../empleados/hooks/useNotifications/useNotifications';
import PageContainer from '../../empleados/components/PageContainer';
import {
  deleteOne as deleteMedicamento,
  getOne as getMedicamento,
  formatPrecio,
  formatFecha,
} from '../data/medicamentos';

export default function MedicamentoShow() {
  const { medicamentoId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [medicamento, setMedicamento] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getMedicamento(Number(medicamentoId));

      setMedicamento(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [medicamentoId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMedicamentoEdit = React.useCallback(() => {
    navigate(`/medicamentos/${medicamentoId}/edit`);
  }, [navigate, medicamentoId]);

  const handleMedicamentoDelete = React.useCallback(async () => {
    if (!medicamento) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `¿Querés eliminar el medicamento "${medicamento.nombre}"?`,
      {
        title: '¿Eliminar medicamento?',
        severity: 'error',
        okText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteMedicamento(Number(medicamentoId));

        navigate('/medicamentos');

        notifications.show('Medicamento eliminado correctamente.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `No se pudo eliminar el medicamento. Motivo: ${deleteError.message}`,
          {
            severity: 'error',
            autoHideDuration: 5000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [medicamento, dialogs, medicamentoId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/medicamentos');
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

    return medicamento ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Nombre</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {medicamento.nombre}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Categoría</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {medicamento.categoria ?? '—'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Descripción</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {medicamento.descripcion || '—'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Precio</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formatPrecio(medicamento.precio)}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Stock</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {medicamento.stock}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Vencimiento</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formatFecha(medicamento.fecha_vencimiento)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Volver
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleMedicamentoEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleMedicamentoDelete}
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
    medicamento,
    handleBack,
    handleMedicamentoEdit,
    handleMedicamentoDelete,
  ]);

  const pageTitle = medicamento ? medicamento.nombre : `Medicamento ${medicamentoId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: 'Medicamentos', path: '/medicamentos' }, { title: pageTitle }]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}
