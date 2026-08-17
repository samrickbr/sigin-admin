import { useMemo, useState } from 'react';
import axios from 'axios';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { Loading } from '../../../components/common/Loading/Loading';
import { usePerfis } from '../../perfis/hooks/usePerfis';
import type { PerfilResponse } from '../../perfis/types/perfis';
import {
  useAdicionarPerfilAoUsuario,
  useRemoverPerfilDoUsuario,
  useUsuarioPerfis,
} from '../hooks/useUsuarioPerfis';

interface UsuarioPerfisSectionProps {
  usuarioId: number;
  usuarioLogin: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === 'object') {
      if ('mensagem' in data && typeof data.mensagem === 'string') {
        return data.mensagem;
      }

      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }
    }

    if (typeof data === 'string' && data.trim()) {
      return data;
    }
  }

  return fallback;
}

export function UsuarioPerfisSection({ usuarioId, usuarioLogin }: UsuarioPerfisSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [perfilId, setPerfilId] = useState(0);
  const [perfilParaRemover, setPerfilParaRemover] = useState<PerfilResponse | null>(null);
  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'error';
    message: string;
  } | null>(null);

  const usuarioPerfisQuery = useUsuarioPerfis(usuarioId);
  const perfisQuery = usePerfis();
  const adicionarPerfil = useAdicionarPerfilAoUsuario(usuarioId);
  const removerPerfil = useRemoverPerfilDoUsuario(usuarioId);

  const perfisVinculados = useMemo(
    () => usuarioPerfisQuery.data ?? [],
    [usuarioPerfisQuery.data],
  );
  const perfisDisponiveis = useMemo(() => {
    const perfisVinculadosIds = new Set(perfisVinculados.map((perfil) => perfil.id));

    return (perfisQuery.data ?? []).filter(
      (perfil) => perfil.ativo && !perfisVinculadosIds.has(perfil.id),
    );
  }, [perfisQuery.data, perfisVinculados]);

  const abrirAtribuicao = () => {
    setFeedback(null);
    setPerfilId(0);
    setDialogOpen(true);
  };

  const fecharAtribuicao = () => {
    if (adicionarPerfil.isPending) {
      return;
    }

    setDialogOpen(false);
    setPerfilId(0);
  };

  const atribuirPerfil = async () => {
    if (!perfilId) {
      return;
    }

    setFeedback(null);

    try {
      await adicionarPerfil.mutateAsync(perfilId);
      setDialogOpen(false);
      setPerfilId(0);
      setFeedback({ severity: 'success', message: 'Perfil atribuído com sucesso.' });
    } catch (error) {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(error, 'Não foi possível atribuir o perfil.'),
      });
    }
  };

  const confirmarRemocao = async () => {
    if (!perfilParaRemover || removerPerfil.isPending) {
      return;
    }

    setFeedback(null);

    try {
      await removerPerfil.mutateAsync(perfilParaRemover.id);
      setPerfilParaRemover(null);
      setFeedback({ severity: 'success', message: 'Perfil removido com sucesso.' });
    } catch (error) {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(error, 'Não foi possível remover o perfil.'),
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', mb: 2 }}
      >
        <Box>
          <Typography variant="h6">Perfis</Typography>
          <Typography variant="body2" color="text.secondary">
            Perfis vinculados ao usuário {usuarioLogin}.
          </Typography>
        </Box>

        <Button
          type="button"
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={abrirAtribuicao}
          disabled={perfisQuery.isLoading || perfisDisponiveis.length === 0}
        >
          Atribuir perfil
        </Button>
      </Stack>

      {feedback && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity={feedback.severity} message={feedback.message} />
        </Box>
      )}

      {perfisQuery.isError && (
        <Box sx={{ mb: 2 }}>
          <Feedback
            severity="error"
            message="Não foi possível carregar os perfis disponíveis para atribuição."
          />
        </Box>
      )}

      {usuarioPerfisQuery.isLoading ? (
        <Loading />
      ) : usuarioPerfisQuery.isError ? (
        <Box>
          <Feedback severity="error" message="Não foi possível carregar os perfis deste usuário." />
          <Button type="button" variant="outlined" sx={{ mt: 2 }} onClick={() => usuarioPerfisQuery.refetch()}>
            Tentar novamente
          </Button>
        </Box>
      ) : perfisVinculados.length === 0 ? (
        <EmptyState message="Este usuário ainda não possui um perfil." />
      ) : (
        <Stack spacing={1.5}>
          {perfisVinculados.map((perfil) => (
            <Box
              key={perfil.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700 }}>{perfil.nome}</Typography>
                  {!perfil.ativo && <Chip label="Inativo" size="small" />}
                </Stack>
                {perfil.descricao && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {perfil.descricao}
                  </Typography>
                )}
              </Box>

              <Tooltip title="Remover perfil">
                <span>
                  <IconButton
                    type="button"
                    aria-label={`Remover perfil ${perfil.nome}`}
                    onClick={() => setPerfilParaRemover(perfil)}
                    disabled={removerPerfil.isPending}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      )}

      {!usuarioPerfisQuery.isLoading &&
        !usuarioPerfisQuery.isError &&
        !perfisQuery.isLoading &&
        !perfisQuery.isError &&
        perfisVinculados.length > 0 &&
        perfisDisponiveis.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Todos os perfis ativos já estão vinculados a este usuário.
        </Typography>
      )}

      <Dialog open={dialogOpen} onClose={fecharAtribuicao} fullWidth maxWidth="sm">
        <DialogTitle>Atribuir perfil</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Usuário
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>{usuarioLogin}</Typography>
            </Box>

            {perfisQuery.isLoading ? (
              <Loading />
            ) : perfisQuery.isError ? (
              <Feedback severity="error" message="Não foi possível carregar os perfis disponíveis." />
            ) : perfisDisponiveis.length === 0 ? (
              <Typography color="text.secondary">
                Todos os perfis ativos já estão vinculados a este usuário.
              </Typography>
            ) : (
              <TextField
                select
                label="Perfil"
                value={perfilId || ''}
                onChange={(event) => setPerfilId(Number(event.target.value))}
                disabled={adicionarPerfil.isPending}
              >
                <MenuItem value="">Selecione um perfil</MenuItem>
                {perfisDisponiveis.map((perfil) => (
                  <MenuItem key={perfil.id} value={perfil.id}>
                    {perfil.nome}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={fecharAtribuicao} disabled={adicionarPerfil.isPending}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={atribuirPerfil}
            disabled={!perfilId || adicionarPerfil.isPending || perfisQuery.isError}
          >
            {adicionarPerfil.isPending ? 'Atribuindo...' : 'Atribuir perfil'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!perfilParaRemover}
        title="Remover perfil"
        message={
          perfilParaRemover
            ? `Remover o perfil "${perfilParaRemover.nome}" deste usuário?`
            : undefined
        }
        onCancel={() => {
          if (!removerPerfil.isPending) {
            setPerfilParaRemover(null);
          }
        }}
        onConfirm={confirmarRemocao}
        isConfirming={removerPerfil.isPending}
      />
    </Paper>
  );
}
