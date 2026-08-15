import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import {
  Add as AddIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import { useDeleteUsuario, useUsuarios } from '../hooks/useUsuarios';

import { usePessoas } from '../../pessoas/hooks/usePessoas';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Feedback } from '../../../components/common/Feedback/Feedback';

import type { Column } from '../../../components/table/DataTable/DataTable';
import type { UsuarioResponse } from '../types/usuarios';

export default function UsuariosListPage() {
  const navigate = useNavigate();

  const { data: usuarios, isLoading: isLoadingUsuarios, isError, refetch } = useUsuarios();

  const { data: pessoas, isLoading: isLoadingPessoas } = usePessoas();

  const deleteUsuario = useDeleteUsuario();

  const [usuarioParaInativar, setUsuarioParaInativar] = useState<UsuarioResponse | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const isLoading = isLoadingUsuarios || isLoadingPessoas;

  const handleInativar = async () => {
    if (!usuarioParaInativar) {
      return;
    }

    try {
      await deleteUsuario.mutateAsync(usuarioParaInativar.id);

      setUsuarioParaInativar(null);

      setFeedback({
        message: 'Usuário inativado com sucesso.',
        severity: 'success',
      });
    } catch {
      setFeedback({
        message: 'Não foi possível inativar o usuário.',
        severity: 'error',
      });
    }
  };

  const columns: Column<UsuarioResponse>[] = [
    {
      id: 'id',
      label: 'ID',
      field: 'id',
      width: '80px',
    },
    {
      id: 'pessoaId',
      label: 'Pessoa',
      field: 'pessoaId',
      renderCell: (row) => {
        const pessoa = pessoas?.find((item) => item.id === row.pessoaId);

        return pessoa?.nome ?? `Pessoa #${row.pessoaId}`;
      },
    },
    {
      id: 'login',
      label: 'Login',
      field: 'login',
    },
    {
      id: 'ativo',
      label: 'Status',
      field: 'ativo',
      renderCell: (row) => (
        <Chip
          label={row.ativo ? 'Ativo' : 'Inativo'}
          color={row.ativo ? 'primary' : 'error'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'ultimoLogin',
      label: 'Último Login',
      field: 'ultimoLogin',
      renderCell: (row) =>
        row.ultimoLogin ? new Date(row.ultimoLogin).toLocaleString('pt-BR') : 'Nunca acessou',
    },
    {
      id: 'dataCriacao',
      label: 'Data de Criação',
      field: 'dataCriacao',
      renderCell: (row) =>
        row.dataCriacao ? new Date(row.dataCriacao).toLocaleString('pt-BR') : '-',
    },
    {
      id: 'acoes',
      label: 'Ações',
      width: '120px',
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => navigate(`/usuarios/${row.id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {row.ativo && (
            <Tooltip title="Inativar">
              <IconButton size="small" color="error" onClick={() => setUsuarioParaInativar(row)}>
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
          Erro ao carregar a lista de usuários.
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
            Usuários
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Gerenciamento de usuários do sistema.
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
            onClick={() => navigate('/usuarios/novo')}
          >
            Novo Usuário
          </Button>
        </Box>
      </Box>

      {!usuarios || usuarios.length === 0 ? (
        <EmptyState message="Não existem usuários cadastrados no sistema até o momento." />
      ) : (
        <DataTable rows={usuarios} columns={columns} />
      )}

      <ConfirmDialog
        open={!!usuarioParaInativar}
        title="Inativar usuário"
        message={
          usuarioParaInativar ? `Deseja inativar o usuário "${usuarioParaInativar.login}"?` : ''
        }
        onConfirm={handleInativar}
        onCancel={() => setUsuarioParaInativar(null)}
      />

      {feedback && <Feedback message={feedback.message} severity={feedback.severity} />}
    </Box>
  );
}
