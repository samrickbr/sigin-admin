import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';

import axios from 'axios';

import { usePerfis, useUpdatePerfil } from '../hooks/usePerfis';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { PerfilResponse } from '../types/perfis';

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string'
    ) {
      return responseData.message;
    }
  }

  return 'Não foi possível alterar a situação do perfil.';
}

export default function PerfisListPage() {
  const navigate = useNavigate();

  const perfisQuery = usePerfis();
  const updateMutation = useUpdatePerfil();

  const [perfilParaAlterar, setPerfilParaAlterar] = useState<PerfilResponse | null>(null);

  const perfis = useMemo(() => perfisQuery.data ?? [], [perfisQuery.data]);

  const handleAlterarSituacao = async () => {
    if (!perfilParaAlterar) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: perfilParaAlterar.id,
        data: {
          nome: perfilParaAlterar.nome,
          descricao: perfilParaAlterar.descricao,
          ativo: !perfilParaAlterar.ativo,
        },
      });

      setPerfilParaAlterar(null);
    } catch {
      // O erro é apresentado através do estado da mutação.
    }
  };

  if (perfisQuery.isLoading) {
    return <Loading />;
  }

  if (perfisQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar os perfis." />;
  }

  const mutationError = updateMutation.error;

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
        <Typography variant="h4">Perfis</Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton onClick={() => perfisQuery.refetch()} disabled={perfisQuery.isFetching}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/perfis/novo')}
          >
            Novo perfil
          </Button>
        </Box>
      </Box>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity="error" message={getErrorMessage(mutationError)} />
        </Box>
      )}

      {perfis.length === 0 ? (
        <EmptyState message="Nenhum perfil encontrado." />
      ) : (
        <DataTable
          columns={[
            {
              id: 'nome',
              field: 'nome' as keyof PerfilResponse,
              label: 'Nome',
            },
            {
              id: 'descricao',
              field: 'descricao' as keyof PerfilResponse,
              label: 'Descrição',
              renderCell: (perfil: PerfilResponse) => perfil.descricao || '-',
            },
            {
              id: 'ativo',
              field: 'ativo' as keyof PerfilResponse,
              label: 'Situação',
              renderCell: (perfil: PerfilResponse) => (
                <Chip
                  size="small"
                  label={perfil.ativo ? 'Ativo' : 'Inativo'}
                  color={perfil.ativo ? 'success' : 'default'}
                />
              ),
            },
            {
              id: 'acoes',
              label: 'Ações',
              renderCell: (perfil: PerfilResponse) => (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => navigate(`/perfis/${perfil.id}`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={perfil.ativo ? 'Inativar' : 'Ativar'}>
                    <IconButton
                      size="small"
                      color={perfil.ativo ? 'error' : 'success'}
                      onClick={() => setPerfilParaAlterar(perfil)}
                      disabled={updateMutation.isPending}
                    >
                      {perfil.ativo ? (
                        <ToggleOffIcon fontSize="small" />
                      ) : (
                        <ToggleOnIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]}
          rows={perfis}
          emptyMessage="Nenhum perfil encontrado."
        />
      )}

      <ConfirmDialog
        open={perfilParaAlterar !== null}
        title={perfilParaAlterar?.ativo ? 'Inativar perfil' : 'Ativar perfil'}
        message={
          perfilParaAlterar
            ? `Deseja realmente ${
                perfilParaAlterar.ativo ? 'inativar' : 'ativar'
              } o perfil "${perfilParaAlterar.nome}"?`
            : ''
        }
        onConfirm={handleAlterarSituacao}
        onCancel={() => setPerfilParaAlterar(null)}
      />

      {updateMutation.isPending && <Loading />}
    </Box>
  );
}
