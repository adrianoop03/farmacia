// src/pages/empleados/components/EmployeeForm.js

import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

function EmployeeForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

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
    navigate(backButtonPath ?? '/employees');
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.apellido ?? ''}
              onChange={handleTextFieldChange}
              name="apellido"
              label="Apellido"
              error={!!formErrors.apellido}
              helperText={formErrors.apellido ?? ' '}
              slotProps={{ htmlInput: { maxLength: 100 } }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.dni ?? ''}
              onChange={handleTextFieldChange}
              name="dni"
              label="DNI"
              error={!!formErrors.dni}
              helperText={formErrors.dni ?? ' '}
              slotProps={{ htmlInput: { maxLength: 20 } }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="email"
              value={formValues.email ?? ''}
              onChange={handleTextFieldChange}
              name="email"
              label="Email (opcional)"
              error={!!formErrors.email}
              helperText={formErrors.email ?? ' '}
              slotProps={{ htmlInput: { maxLength: 150 } }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.cargo ?? ''}
              onChange={handleTextFieldChange}
              name="cargo"
              label="Cargo"
              error={!!formErrors.cargo}
              helperText={formErrors.cargo ?? ' '}
              slotProps={{ htmlInput: { maxLength: 100 } }}
              fullWidth
            />
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Volver
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

EmployeeForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      apellido: PropTypes.string,
      cargo: PropTypes.string,
      dni: PropTypes.string,
      email: PropTypes.string,
      nombre: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      apellido: PropTypes.string,
      cargo: PropTypes.string,
      dni: PropTypes.string,
      email: PropTypes.string,
      nombre: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default EmployeeForm;
