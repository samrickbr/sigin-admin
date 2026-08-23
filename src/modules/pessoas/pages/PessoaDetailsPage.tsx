import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PessoaEnderecosSection } from '../components/PessoaEnderecosSection';
import { PessoaDataSection } from '../components/PessoaDataSection';

import { PessoaEnderecoDialog } from '../components/PessoaEnderecoDialog';
import type { EnderecoFormData } from '../components/pessoaEnderecoForm';

import {
  Box,
  Button,
  Typography,
} from '@mui/material';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { PessoaAcessoSistema } from '../components/PessoaAcessoSistema';

import {
  ConfirmDialog,
  EmptyState,
  Feedback,
  Loading,
} from '../../../components/common';

import { usePessoa } from '../hooks/usePessoas';

import {
  useCreatePessoaEndereco,
  useDeletePessoaEndereco,
  useDefinirPessoaEnderecoPrincipal,
  usePessoaEnderecos,
  useUpdatePessoaEndereco,
} from '../hooks/usePessoaEnderecos';

import type { PessoaEnderecoResponse } from '../types/pessoaEndereco';

type FeedbackState = {
  message: string;
  severity: 'success' | 'error';
} | null;

export function PessoaDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pessoaId = id ? Number(id) : undefined;
  const pessoaIdValido =
    pessoaId !== undefined && Number.isFinite(pessoaId);

  const pessoaQuery = usePessoa(
    pessoaIdValido ? pessoaId : undefined,
  );

  const enderecosQuery = usePessoaEnderecos(
    pessoaIdValido ? pessoaId : undefined,
  );

  const createEndereco = useCreatePessoaEndereco();
  const updateEndereco = useUpdatePessoaEndereco();
  const definirPrincipal = useDefinirPessoaEnderecoPrincipal();
  const deleteEndereco = useDeletePessoaEndereco();

  const [enderecoDialogOpen, setEnderecoDialogOpen] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] =
    useState<PessoaEnderecoResponse | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enderecoParaExcluir, setEnderecoParaExcluir] =
    useState<PessoaEnderecoResponse | null>(null);

  const [feedback, setFeedback] =
    useState<FeedbackState>(null);

  const abrirNovoEndereco = () => {
    setFeedback(null);
    setEnderecoSelecionado(null);
    setEnderecoDialogOpen(true);
  };

  const abrirEdicaoEndereco = (
    endereco: PessoaEnderecoResponse,
  ) => {
    setFeedback(null);
    setEnderecoSelecionado(endereco);
    setEnderecoDialogOpen(true);
  };

  const fecharEnderecoDialog = () => {
    if (
      createEndereco.isPending ||
      updateEndereco.isPending
    ) {
      return;
    }

    setEnderecoDialogOpen(false);
    setEnderecoSelecionado(null);
  };

  const onSubmitEndereco = async (
    data: EnderecoFormData,
  ) => {
    if (!pessoaIdValido || !pessoaId) {
      return;
    }

    try {
      if (enderecoSelecionado) {
        await updateEndereco.mutateAsync({
          pessoaId,
          enderecoId: enderecoSelecionado.id,
          data,
        });

        setFeedback({
          message: 'Endereço atualizado com sucesso.',
          severity: 'success',
        });
      } else {
        await createEndereco.mutateAsync({
          pessoaId,
          data,
        });

        setFeedback({
          message: 'Endereço cadastrado com sucesso.',
          severity: 'success',
        });
      }

      fecharEnderecoDialog();
    } catch {
      setFeedback({
        message: enderecoSelecionado
          ? 'Não foi possível atualizar o endereço.'
          : 'Não foi possível cadastrar o endereço.',
        severity: 'error',
      });
    }
  };

  const handleDefinirPrincipal = async (
    endereco: PessoaEnderecoResponse,
  ) => {
    if (
      !pessoaIdValido ||
      !pessoaId ||
      endereco.principal
    ) {
      return;
    }

    try {
      await definirPrincipal.mutateAsync({
        pessoaId,
        enderecoId: endereco.id,
      });

      setFeedback({
        message:
          'Endereço principal atualizado com sucesso.',
        severity: 'success',
      });
    } catch {
      setFeedback({
        message:
          'Não foi possível definir o endereço como principal.',
        severity: 'error',
      });
    }
  };

  const abrirConfirmacaoExclusao = (
    endereco: PessoaEnderecoResponse,
  ) => {
    setFeedback(null);
    setEnderecoParaExcluir(endereco);
    setDeleteDialogOpen(true);
  };

  const cancelarExclusao = () => {
    if (deleteEndereco.isPending) {
      return;
    }

    setDeleteDialogOpen(false);
    setEnderecoParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (
      !pessoaIdValido ||
      !pessoaId ||
      !enderecoParaExcluir
    ) {
      return;
    }

    try {
      await deleteEndereco.mutateAsync({
        pessoaId,
        enderecoId: enderecoParaExcluir.id,
      });

      setDeleteDialogOpen(false);
      setEnderecoParaExcluir(null);

      setFeedback({
        message: 'Endereço excluído com sucesso.',
        severity: 'success',
      });
    } catch {
      setFeedback({
        message: 'Não foi possível excluir o endereço.',
        severity: 'error',
      });
    }
  };

  if (!pessoaIdValido) {
    return <EmptyState message="Pessoa não encontrada." />;
  }

  if (pessoaQuery.isLoading) {
    return <Loading />;
  }

  if (!pessoaQuery.data || pessoaQuery.isError) {
    return <EmptyState message="Pessoa não encontrada." />;
  }

  const pessoa = pessoaQuery.data;

  const isEnderecoSubmitting =
    createEndereco.isPending ||
    updateEndereco.isPending;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h5">Pessoa</Typography>

          <Typography variant="body2" color="text.secondary">
            Visualização dos dados e acesso ao sistema.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate('/pessoas')}
          >
            Voltar
          </Button>

          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/pessoas/${pessoa.id}/editar`)}
          >
            Editar
          </Button>
        </Box>
      </Box>

      {feedback && (
        <Box sx={{ mb: 3 }}>
          <Feedback message={feedback.message} severity={feedback.severity} />
        </Box>
      )}

      <PessoaDataSection pessoa={pessoa} />

      <PessoaEnderecosSection
        enderecosQuery={enderecosQuery}
        onNovo={abrirNovoEndereco}
        onEditar={abrirEdicaoEndereco}
        onDefinirPrincipal={handleDefinirPrincipal}
        onExcluir={abrirConfirmacaoExclusao}
        definirPrincipalPending={definirPrincipal.isPending}
        deletePending={deleteEndereco.isPending}
      />

      <PessoaAcessoSistema
        pessoaId={pessoa.id}
        onGerenciarAcesso={(usuarioId) => navigate(`/pessoas/${pessoa.id}/usuario/${usuarioId}`)}
        onCriarAcesso={() => navigate(`/pessoas/${pessoa.id}/usuario/novo`)}
      />

      <PessoaEnderecoDialog
        open={enderecoDialogOpen}
        endereco={enderecoSelecionado}
        isSubmitting={isEnderecoSubmitting}
        onClose={fecharEnderecoDialog}
        onSubmit={onSubmitEndereco}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir endereço"
        message={
          enderecoParaExcluir
            ? `Deseja excluir o endereço ${enderecoParaExcluir.logradouro}, ${enderecoParaExcluir.numero}?`
            : 'Deseja excluir este endereço?'
        }
        onConfirm={confirmarExclusao}
        onCancel={cancelarExclusao}
        isConfirming={deleteEndereco.isPending}
      />
    </Box>
  );
}
