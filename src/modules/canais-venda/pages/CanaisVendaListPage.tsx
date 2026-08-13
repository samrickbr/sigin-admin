import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';

import { useCanaisVenda, useDeleteCanalVenda, useUpdateCanalVenda } from '../hooks/useCanaisVenda';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { CanalVendaResponse } from '../types/canaisVenda';

type Action = 'toggle' | 'delete';

export default function CanaisVendaListPage() {
  const navigate = useNavigate();

  const canaisQuery = useCanaisVenda();

  const updateMutation = useUpdateCanalVenda();

  const deleteMutation = useDeleteCanalVenda();

  const [canalSelecionado, setCanalSelecionado] = useState<CanalVendaResponse | null>(null);

  const [action, setAction] = useState<Action | null>(null);

  const handleConfirm = async () => {
    if (!canalSelecionado || !action) {
      return;
    }

    if (action === 'toggle') {
      await updateMutation.mutateAsync({
        id: canalSelecionado.id,
        data: {
          nome: canalSelecionado.nome,
          descricao: canalSelecionado.descricao,
          ativo: !canalSelecionado.ativo,
        },
      });
    }

    if (action === 'delete') {
      await deleteMutation.mutateAsync(canalSelecionado.id);
    }

    setCanalSelecionado(null);
    setAction(null);
  };

  const handleCancel = () => {
    setCanalSelecionado(null);
    setAction(null);
  };

  if (canaisQuery.isLoading) {
    return <Loading />;
  }

  if (canaisQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar os canais de venda." />;
  }

  const canais = canaisQuery.data ?? [];

  const columns = [
    {
      id: 'nome',
      field: 'nome' as keyof CanalVendaResponse,
      label: 'Nome',
    },
    {
      id: 'descricao',
      field: 'descricao' as keyof CanalVendaResponse,
      label: 'Descrição',
      renderCell: (canal: CanalVendaResponse) => canal.descricao || '-',
    },
    {
      id: 'ativo',
      field: 'ativo' as keyof CanalVendaResponse,
      label: 'Situação',
      renderCell: (canal: CanalVendaResponse) => (
        <Chip
          size="small"
          label={canal.ativo ? 'Ativo' : 'Inativo'}
          color={canal.ativo ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'acoes',
      label: 'Ações',
      renderCell: (canal: CanalVendaResponse) => (
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => navigate(`/canais-venda/${canal.id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={canal.ativo ? 'Inativar' : 'Ativar'}>
            <IconButton
              size="small"
              color={canal.ativo ? 'error' : 'success'}
              onClick={() => {
                setCanalSelecionado(canal);
                setAction('toggle');
              }}
            >
              {canal.ativo ? <ToggleOffIcon fontSize="small" /> : <ToggleOnIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setCanalSelecionado(canal);
                setAction('delete');
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const isProcessing = updateMutation.isPending || deleteMutation.isPending;

  const dialogTitle =
    action === 'delete'
      ? 'Excluir canal de venda'
      : canalSelecionado?.ativo
        ? 'Inativar canal de venda'
        : 'Ativar canal de venda';

  const dialogMessage = canalSelecionado
    ? action === 'delete'
      ? `Deseja realmente excluir o canal "${canalSelecionado.nome}"?`
      : `Deseja realmente ${
          canalSelecionado.ativo ? 'inativar' : 'ativar'
        } o canal "${canalSelecionado.nome}"?`
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
        <Typography variant="h4">Canais de Venda</Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Tooltip title="Atualizar">
            <IconButton onClick={() => canaisQuery.refetch()} disabled={canaisQuery.isFetching}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/canais-venda/novo')}
          >
            Novo canal
          </Button>
        </Box>
      </Box>

      {canais.length === 0 ? (
        <EmptyState message="Nenhum canal de venda encontrado." />
      ) : (
        <DataTable
          columns={columns}
          rows={canais}
          emptyMessage="Nenhum canal de venda encontrado."
        />
      )}

      <ConfirmDialog
        open={canalSelecionado !== null && action !== null}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {isProcessing && <Loading />}
    </Box>
  );
}
