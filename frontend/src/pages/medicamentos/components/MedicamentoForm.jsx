// src/pages/medicamentos/components/MedicamentoForm.jsx

import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { getAll as getCategorias } from '../../categorias/data/categorias';

function MedicamentoForm(props) {
  const { formState, onFieldChange, onSubmit, onReset, submitButtonLabel, backButtonPath } =
    props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Categorías para el selector
  const [categorias, setCategorias] = React.useState([]);
  const [categoriasStatus, setCategoriasStatus] = React.useState('loading'); // loading | ready | error

  React.useEffect(() => {
    let cancelled = false;

    getCategorias()
      .then((list) => {
        if (!cancelled) {
          setCategorias(list);
          setCategoriasStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategoriasStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  // La fecha viaja como "YYYY-MM-DD" (lo que espera el backend), sin hora.
  const handleDateFieldChange = React.useCallback(
    (value) => {
      if (value?.isValid()) {
        onFieldChange('fecha_vencimiento', value.format('YYYY-MM-DD'));
      } else if (formValues.fecha_vencimiento) {
        onFieldChange('fecha_vencimiento', null);
      }
    },
    [formValues, onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/medicamentos');
  }, [navigate, backButtonPath]);

  let categoriaHelper = formErrors.id_categoria;
  if (!categoriaHelper) {
    if (categoriasStatus === 'error') {
      categoriaHelper = 'No se pudieron cargar las categorías';
    } else if (categoriasStatus === 'ready' && categorias.length === 0) {
      categoriaHelper = 'No hay categorías: creá una primero';
    } else {
      categoriaHelper = ' ';
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.nombre ?? ''}
              onChange={handleTextFieldChange}
              name="nombre"
              label="Nombre"
              error={!!formErrors.nombre}
              helperText={formErrors.nombre ?? ' '}
              slotProps={{ htmlInput: { maxLength: 150 } }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.id_categoria} fullWidth>
              <InputLabel id="medicamento-categoria-label">Categoría</InputLabel>
              <Select
                value={categoriasStatus === 'ready' ? (formValues.id_categoria ?? '') : ''}
                onChange={handleSelectFieldChange}
                labelId="medicamento-categoria-label"
                name="id_categoria"
                label="Categoría"
                disabled={categoriasStatus !== 'ready' || categorias.length === 0}
                fullWidth
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{categoriaHelper}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.descripcion ?? ''}
              onChange={handleTextFieldChange}
              name="descripcion"
              label="Descripción (opcional)"
              error={!!formErrors.descripcion}
              helperText={formErrors.descripcion ?? ' '}
              slotProps={{ htmlInput: { maxLength: 255 } }}
              multiline
              minRows={2}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.precio ?? ''}
              onChange={handleTextFieldChange}
              name="precio"
              label="Precio"
              error={!!formErrors.precio}
              helperText={formErrors.precio ?? ' '}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                htmlInput: { min: 0, step: '0.01' },
              }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.stock ?? ''}
              onChange={handleTextFieldChange}
              name="stock"
              label="Stock"
              error={!!formErrors.stock}
              helperText={formErrors.stock ?? ' '}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                value={formValues.fecha_vencimiento ? dayjs(formValues.fecha_vencimiento) : null}
                onChange={handleDateFieldChange}
                name="fecha_vencimiento"
                label="Fecha de vencimiento"
                slotProps={{
                  textField: {
                    error: !!formErrors.fecha_vencimiento,
                    helperText: formErrors.fecha_vencimiento ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Volver
        </Button>
        <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

MedicamentoForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      descripcion: PropTypes.string,
      fecha_vencimiento: PropTypes.string,
      id_categoria: PropTypes.string,
      nombre: PropTypes.string,
      precio: PropTypes.string,
      stock: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      descripcion: PropTypes.string,
      fecha_vencimiento: PropTypes.string,
      id_categoria: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      nombre: PropTypes.string,
      precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      stock: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default MedicamentoForm;
