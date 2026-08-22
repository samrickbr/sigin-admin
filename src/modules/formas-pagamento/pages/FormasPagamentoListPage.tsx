import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import {
  Add as AddIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';

import {
  useDeleteFormaPagamento,
  useFormasPagamento,
  useUpdateFormaPagamentoAtivo,
} from '../hooks/useFormasPagamento';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { FormaPagamentoResponse } from '../types/formasPagamento';

type Action = 'toggle' | 'delete';

export default function FormasPagamentoListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const formasPagamentoQuery = useFormasPagamento();

  const updateAtivoMutation = useUpdateFormaPagamentoAtivo();
  const deleteMutation = useDeleteFormaPagamento();

  const [formaPagamentoSelecionada, setFormaPagamentoSelecionada] =
    useState<FormaPagamentoResponse | null>(null);

  const [action, setAction] = useState<Action | null>(null);

  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'error';
    message: string;
  } | null>(() => {
    const message = location.state?.message;

    if (!message) {
      return null;
    }

    window.history.replaceState({}, document.title);

    return {
      severity: 'success',
      message,
    };
  });

  const handleConfirm = async () => {
    if (!formaPagamentoSelecionada || !action) {
      return;
    }

    try {
      if (action === 'toggle') {
        const ativo = !formaPagamentoSelecionada.ativo;

        await updateAtivoMutation.mutateAsync({
          id: formaPagamentoSelecionada.id,
          ativo,
        });

        setFeedback({
          severity: 'success',
          message: ativo
            ? 'Forma de pagamento ativada com sucesso.'
            : 'Forma de pagamento desativada com sucesso.',
        });
      }

      if (action === 'delete') {
        await deleteMutation.mutateAsync(formaPagamentoSelecionada.id);

        setFeedback({
          severity: 'success',
          message: 'Forma de pagamento inativada com sucesso.',
        });
      }

      setFormaPagamentoSelecionada(null);
      setAction(null);
    } catch {
      setFeedback({
        severity: 'error',
        message: 'Não foi possível concluir a operação.',
      });
    }
  };

  const handleCancel = () => {
    setFormaPagamentoSelecionada(null);
    setAction(null);
  };

  if (formasPagamentoQuery.isLoading) {
    return <Loading />;
  }

  if (formasPagamentoQuery.isError) {
    return (
      <Feedback severity="error" message="Não foi possível carregar as formas de pagamento." />
    );
  }

  const formasPagamento = formasPagamentoQuery.data ?? [];

  const columns = [
    {
      id: 'descricao',
      field: 'descricao' as keyof FormaPagamentoResponse,
      label: 'Descrição',
    },
    {
      id: 'baixaAutomatica',
      field: 'baixaAutomatica' as keyof FormaPagamentoResponse,
      label: 'Baixa automática',
      renderCell: (forma: FormaPagamentoResponse) => (
        <Chip
          size="small"
          label={forma.baixaAutomatica ? 'Sim' : 'Não'}
          color={forma.baixaAutomatica ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'ativo',
      field: 'ativo' as keyof FormaPagamentoResponse,
      label: 'Situação',
      renderCell: (forma: FormaPagamentoResponse) => (
        <Chip
          size="small"
          label={forma.ativo ? 'Ativo' : 'Inativo'}
          color={forma.ativo ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'acoes',
      label: 'Ações',
      renderCell: (forma: FormaPagamentoResponse) => (
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => navigate(`/formas-pagamento/${forma.id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={forma.ativo ? 'Desativar' : 'Ativar'}>
            <IconButton
              size="small"
              color={forma.ativo ? 'error' : 'success'}
              onClick={() => {
                setFormaPagamentoSelecionada(forma);
                setAction('toggle');
              }}
            >
              {forma.ativo ? <ToggleOffIcon fontSize="small" /> : <ToggleOnIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {forma.ativo && (
            <Tooltip title="Inativar">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setFormaPagamentoSelecionada(forma);
                  setAction('delete');
                }}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const isProcessing = updateAtivoMutation.isPending || deleteMutation.isPending;

  const dialogTitle =
    action === 'delete'
      ? 'Inativar forma de pagamento'
      : formaPagamentoSelecionada?.ativo
        ? 'Desativar forma de pagamento'
        : 'Ativar forma de pagamento';

  const dialogMessage = formaPagamentoSelecionada
    ? action === 'delete'
      ? `Deseja realmente inativar a forma de pagamento "${formaPagamentoSelecionada.descricao}"?`
      : `Deseja realmente ${
          formaPagamentoSelecionada.ativo ? 'desativar' : 'ativar'
        } a forma de pagamento "${formaPagamentoSelecionada.descricao}"?`
    : '';

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h4">Formas de Pagamento</Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Tooltip title="Atualizar">
            <IconButton
              onClick={() => formasPagamentoQuery.refetch()}
              disabled={formasPagamentoQuery.isFetching}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/formas-pagamento/novo')}
          >
            Nova forma
          </Button>
        </Box>
      </Box>

      {feedback && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity={feedback.severity} message={feedback.message} />
        </Box>
      )}

      {formasPagamento.length === 0 ? (
        <EmptyState message="Nenhuma forma de pagamento encontrada." />
      ) : (
        <DataTable
          columns={columns}
          rows={formasPagamento}
          emptyMessage="Nenhuma forma de pagamento encontrada."
        />
      )}

      <ConfirmDialog
        open={formaPagamentoSelecionada !== null && action !== null}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {isProcessing && <Loading />}
    </Box>
  );
}
