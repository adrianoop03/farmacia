// src/pages/empleados/components/EmployeeList.js

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  deleteOne as deleteEmployee,
  getMany as getEmployees,
} from '../data/employees';
import PageContainer from './PageContainer';

const INITIAL_PAGE_SIZE = 10;

export default function EmployeeList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [paginationModel, setPaginationModel] = React.useState({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = React.useState(
    searchParams.get('filter')
      ? JSON.parse(searchParams.get('filter') ?? '')
      : { items: [] },
  );
  const [sortModel, setSortModel] = React.useState(
    searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
  );

  const [rowsState, setRowsState] = React.useState({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handlePaginationModelChange = React.useCallback(
    (model) => {
      setPaginationModel(model);

      searchParams.set('page', String(model.page));
      searchParams.set('pageSize', String(model.pageSize));

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleFilterModelChange = React.useCallback(
    (model) => {
      setFilterModel(model);

      if (
        model.items.length > 0 ||
        (model.quickFilterValues && model.quickFilterValues.length > 0)
      ) {
        searchParams.set('filter', JSON.stringify(model));
      } else {
        searchParams.delete('filter');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleSortModelChange = React.useCallback(
    (model) => {
      setSortModel(model);

      if (model.length > 0) {
        searchParams.set('sort', JSON.stringify(model));
      } else {
        searchParams.delete('sort');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const listData = await getEmployees({
        paginationModel,
        sortModel,
        filterModel,
      });

      setRowsState({
        rows: listData.items,
        rowCount: listData.itemCount,
      });
    } catch (listDataError) {
      setError(listDataError);
    }

    setIsLoading(false);
  }, [paginationModel, sortModel, filterModel]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback(
    ({ row }) => {
      navigate(`/employees/${row.id}`);
    },
    [navigate],
  );

  const handleCreateClick = React.useCallback(() => {
    navigate('/employees/new');
  }, [navigate]);

  const handleRowEdit = React.useCallback(
    (employee) => () => {
      navigate(`/employees/${employee.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = React.useCallback(
    (employee) => async () => {
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
          await deleteEmployee(Number(employee.id));

          notifications.show('Empleado eliminado correctamente.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          loadData();
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
    },
    [dialogs, notifications, loadData],
  );

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 130 },
      { field: 'apellido', headerName: 'Apellido', flex: 1, minWidth: 130 },
      { field: 'dni', headerName: 'DNI', width: 130 },
      { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
      { field: 'cargo', headerName: 'Cargo', flex: 1, minWidth: 140 },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 120,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Editar"
            onClick={handleRowEdit(row)}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Eliminar"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowEdit, handleRowDelete],
  );

  const pageTitle = 'Empleados';

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: pageTitle }]}
      actions={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Recargar datos" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="recargar" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
          >
            Nuevo empleado
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={rowsState.rows}
            rowCount={rowsState.rowCount}
            columns={columns}
            pagination
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            initialState={initialState}
            showToolbar
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: 'none',
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
              },
            }}
          />
        )}
      </Box>
    </PageContainer>
  );
}
