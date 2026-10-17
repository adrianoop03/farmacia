// src/pages/medicamentos/components/MedicamentoEdit.jsx

import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../empleados/hooks/useNotifications/useNotifications';
import PageContainer from '../../empleados/components/PageContainer';
import {
  getOne as getMedicamento,
  updateOne as updateMedicamento,
  validate as validateMedicamento,
} from '../data/medicamentos';
import MedicamentoForm from './MedicamentoForm';

function MedicamentoEditForm({ initialValues, onSubmit }) {
  const { medicamentoId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback((newFormValues) => {
    setFormState((previousState) => ({
      ...previousState,
      values: newFormValues,
    }));
  }, []);

  const setFormErrors = React.useCallback((newFormErrors) => {
    setFormState((previousState) => ({
      ...previousState,
      errors: newFormErrors,
    }));
  }, []);

  const handleFormFieldChange = React.useCallback(
    (name, value) => {
      const validateField = async (values) => {
        const { issues } = validateMedicamento(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateMedicamento(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Medicamento editado correctamente.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/medicamentos');
    } catch (editError) {
      notifications.show(
        `No se pudo editar el medicamento. Motivo: ${editError.message}`,
        {
          severity: 'error',
          autoHideDuration: 5000,
        },
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <MedicamentoForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Guardar"
      backButtonPath={`/medicamentos/${medicamentoId}`}
    />
  );
}

MedicamentoEditForm.propTypes = {
  initialValues: PropTypes.shape({
    descripcion: PropTypes.string,
    fecha_vencimiento: PropTypes.string,
    id_categoria: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nombre: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    stock: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function MedicamentoEdit() {
  const { medicamentoId } = useParams();

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

  const handleSubmit = React.useCallback(
    async (formValues) => {
      const updatedData = await updateMedicamento(Number(medicamentoId), formValues);
      setMedicamento(updatedData);
    },
    [medicamentoId],
  );

  const renderEdit = React.useMemo(() => {
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
      <MedicamentoEditForm initialValues={medicamento} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, medicamento, handleSubmit]);

  return (
    <PageContainer
      title={`Editar medicamento ${medicamentoId}`}
      breadcrumbs={[
        { title: 'Medicamentos', path: '/medicamentos' },
        { title: `Medicamento ${medicamentoId}`, path: `/medicamentos/${medicamentoId}` },
        { title: 'Editar' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
