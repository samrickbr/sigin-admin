import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Column } from '../../../components/table/DataTable/DataTable';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Block as BlockIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

import { useDeletePessoa, usePessoas } from '../hooks/usePessoas';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Feedback } from '../../../components/common/Feedback/Feedback';

import type { PessoaResponse } from '../types/pessoas';

export default function PessoasListPage() {
  const navigate = useNavigate();

  const { data: pessoas, isLoading, isError, refetch } = usePessoas();

  const deletePessoa = useDeletePessoa();

  const [pessoaParaInativar, setPessoaParaInativar] = useState<PessoaResponse | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const handleInativar = async () => {
    if (!pessoaParaInativar) {
      return;
    }

    try {
      await deletePessoa.mutateAsync(pessoaParaInativar.id);

      setFeedback({
        message: 'Pessoa inativada com sucesso.',
        severity: 'success',
      });

      setPessoaParaInativar(null);
    } catch {
      setFeedback({
        message: 'Não foi possível inativar a pessoa.',
        severity: 'error',
      });
    }
  };

  const columns: Column<PessoaResponse>[] = [
    {
      id: 'id',
      label: 'ID',
      field: 'id',
      width: '80px',
    },
    {
      id: 'nome',
      label: 'Nome',
      field: 'nome',
    },
    {
      id: 'documento',
      label: 'Documento',
      field: 'documento',
      renderCell: (row: PessoaResponse) => row.documento || '-',
    },
    {
      id: 'telefone',
      label: 'Telefone',
      field: 'telefone',
      renderCell: (row: PessoaResponse) => row.telefone || '-',
    },
    {
      id: 'email',
      label: 'E-mail',
      field: 'email',
      renderCell: (row: PessoaResponse) => row.email || '-',
    },
    {
      id: 'tipos',
      label: 'Tipos',
      field: 'tipos',
      renderCell: (row: PessoaResponse) => {
        if (!row.tipos || row.tipos.length === 0) {
          return '-';
        }

        return (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              flexWrap: 'wrap',
            }}
          >
            {row.tipos.map((tipo) => (
              <Chip key={tipo} label={tipo} size="small" />
            ))}
          </Box>
        );
      },
    },
    {
      id: 'ativo',
      label: 'Status',
      field: 'ativo',
      renderCell: (row: PessoaResponse) => (
        <Chip
          label={row.ativo ? 'Ativo' : 'Inativo'}
          color={row.ativo ? 'primary' : 'error'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'acoes',
      label: 'Ações',
      width: '120px',
      renderCell: (row: PessoaResponse) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => navigate(`/pessoas/${row.id}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => navigate(`/pessoas/${row.id}/editar`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {row.ativo && (
            <Tooltip title="Inativar">
              <IconButton size="small" color="error" onClick={() => setPessoaParaInativar(row)}>
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Erro ao carregar a lista de pessoas.
        </Typography>

        <Button variant="contained" onClick={() => refetch()}>
          Tentar Novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Pessoas
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Gerenciamento de pessoas cadastradas no sistema.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Tooltip title="Atualizar">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/pessoas/novo')}
          >
            Nova Pessoa
          </Button>
        </Box>
      </Box>

      {!pessoas || pessoas.length === 0 ? (
        <EmptyState message="Não existem pessoas cadastradas no sistema até o momento." />
      ) : (
        <DataTable rows={pessoas} columns={columns} />
      )}

      <ConfirmDialog
        open={!!pessoaParaInativar}
        title="Inativar pessoa"
        message={pessoaParaInativar ? `Deseja inativar a pessoa "${pessoaParaInativar.nome}"?` : ''}
        onConfirm={handleInativar}
        onCancel={() => setPessoaParaInativar(null)}
      />

      {feedback && <Feedback message={feedback.message} severity={feedback.severity} />}
    </Box>
  );
}
