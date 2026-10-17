// src/pages/categorias/components/CategoriaCreate.jsx

import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../empleados/hooks/useNotifications/useNotifications';
import PageContainer from '../../empleados/components/PageContainer';
import { createOne as createCategoria, validate as validateCategoria } from '../data/categorias';
import CategoriaForm from './CategoriaForm';

const INITIAL_FORM_VALUES = {
  nombre: '',
  descripcion: '',
};

export default function CategoriaCreate() {
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
        const { issues } = validateCategoria(values);
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
    const { issues } = validateCategoria(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await createCategoria(formValues);
      notifications.show('Categoría creada correctamente.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/categorias');
    } catch (createError) {
      notifications.show(`No se pudo crear la categoría. Motivo: ${createError.message}`, {
        severity: 'error',
        autoHideDuration: 5000,
      });
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="Nueva categoría"
      breadcrumbs={[{ title: 'Categorías', path: '/categorias' }, { title: 'Nueva' }]}
    >
      <CategoriaForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Crear"
      />
    </PageContainer>
  );
}
