// src/pages/categorias/components/CategoriaForm.jsx

import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function CategoriaForm(props) {
  const { formState, onFieldChange, onSubmit, onReset, submitButtonLabel, backButtonPath } =
    props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/categorias');
  }, [navigate, backButtonPath]);

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
              slotProps={{ htmlInput: { maxLength: 100 } }}
              fullWidth
            />
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
              minRows={3}
              fullWidth
            />
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

CategoriaForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      descripcion: PropTypes.string,
      nombre: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      descripcion: PropTypes.string,
      nombre: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default CategoriaForm;
