// src/pages/categorias/components/CategoriaShow.jsx

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
import { deleteOne as deleteCategoria, getOne as getCategoria } from '../data/categorias';

export default function CategoriaShow() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [categoria, setCategoria] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getCategoria(Number(categoriaId));

      setCategoria(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [categoriaId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategoriaEdit = React.useCallback(() => {
    navigate(`/categorias/${categoriaId}/edit`);
  }, [navigate, categoriaId]);

  const handleCategoriaDelete = React.useCallback(async () => {
    if (!categoria) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `¿Querés eliminar la categoría "${categoria.nombre}"?`,
      {
        title: '¿Eliminar categoría?',
        severity: 'error',
        okText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteCategoria(Number(categoriaId));

        navigate('/categorias');

        notifications.show('Categoría eliminada correctamente.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `No se pudo eliminar la categoría. Motivo: ${deleteError.message}`,
          {
            severity: 'error',
            autoHideDuration: 5000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [categoria, dialogs, categoriaId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/categorias');
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

    return categoria ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Nombre</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {categoria.nombre}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Descripción</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {categoria.descripcion || '—'}
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
              onClick={handleCategoriaEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleCategoriaDelete}
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
    categoria,
    handleBack,
    handleCategoriaEdit,
    handleCategoriaDelete,
  ]);

  const pageTitle = categoria ? categoria.nombre : `Categoría ${categoriaId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: 'Categorías', path: '/categorias' }, { title: pageTitle }]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}
