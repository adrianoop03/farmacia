// src/pages/medicamentos/components/MedicamentoCreate.jsx

import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../empleados/hooks/useNotifications/useNotifications';
import PageContainer from '../../empleados/components/PageContainer';
import {
  createOne as createMedicamento,
  validate as validateMedicamento,
} from '../data/medicamentos';
import MedicamentoForm from './MedicamentoForm';

const INITIAL_FORM_VALUES = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '0',
  fecha_vencimiento: null,
  id_categoria: '',
};

export default function MedicamentoCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      await createMedicamento(formValues);
      notifications.show('Medicamento creado correctamente.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/medicamentos');
    } catch (createError) {
      notifications.show(
        `No se pudo crear el medicamento. Motivo: ${createError.message}`,
        {
          severity: 'error',
          autoHideDuration: 5000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="Nuevo medicamento"
      breadcrumbs={[{ title: 'Medicamentos', path: '/medicamentos' }, { title: 'Nuevo' }]}
    >
      <MedicamentoForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Crear"
      />
    </PageContainer>
  );
}
