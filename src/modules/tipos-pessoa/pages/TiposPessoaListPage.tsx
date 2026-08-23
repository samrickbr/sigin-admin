import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Column } from '../../../components/table/DataTable/DataTable';

import {
  Add as AddIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
} from '@mui/icons-material';

import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useAlterarAtivoTipoPessoa, useTiposPessoa } from '../hooks/useTiposPessoa';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Feedback } from '../../../components/common/Feedback/Feedback';

import type { TipoPessoaResponse } from '../types/tiposPessoa';

type StatusFiltro = 'TODOS' | 'ATIVOS' | 'INATIVOS';

export default function TiposPessoaListPage() {
  const navigate = useNavigate();

  const { data: tiposPessoa, isLoading, isError, refetch } = useTiposPessoa();

  const alterarAtivo = useAlterarAtivoTipoPessoa();

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('TODOS');

  const [tipoSelecionado, setTipoSelecionado] = useState<TipoPessoaResponse | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const tiposFiltrados = useMemo(() => {
    if (!tiposPessoa) {
      return [];
    }

    const termo = busca.trim().toLowerCase();

    return tiposPessoa.filter((tipo) => {
      const correspondeBusca =
        !termo ||
        tipo.nome.toLowerCase().includes(termo) ||
        tipo.descricao?.toLowerCase().includes(termo);

      const correspondeStatus =
        statusFiltro === 'TODOS' ||
        (statusFiltro === 'ATIVOS' && tipo.ativo) ||
        (statusFiltro === 'INATIVOS' && !tipo.ativo);

      return correspondeBusca && correspondeStatus;
    });
  }, [tiposPessoa, busca, statusFiltro]);

  const alterarStatus = async () => {
    if (!tipoSelecionado) {
      return;
    }

    const novoStatus = !tipoSelecionado.ativo;

    try {
      await alterarAtivo.mutateAsync({
        id: tipoSelecionado.id,
        ativo: novoStatus,
      });

      setFeedback({
        message: novoStatus
          ? 'Tipo de pessoa ativado com sucesso.'
          : 'Tipo de pessoa inativado com sucesso.',
        severity: 'success',
      });

      setTipoSelecionado(null);
    } catch {
      setFeedback({
        message: novoStatus
          ? 'Não foi possível ativar o tipo de pessoa.'
          : 'Não foi possível inativar o tipo de pessoa.',
        severity: 'error',
      });
    }
  };

  const columns: Column<TipoPessoaResponse>[] = [
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
      id: 'descricao',
      label: 'Descrição',
      field: 'descricao',
      renderCell: (row) => row.descricao || '-',
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
      id: 'acoes',
      label: 'Ações',
      width: '120px',
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => navigate(`/tipos-pessoa/${row.id}/editar`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {row.ativo ? (
            <Tooltip title="Inativar">
              <IconButton size="small" color="error" onClick={() => setTipoSelecionado(row)}>
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Ativar">
              <IconButton size="small" color="primary" onClick={() => setTipoSelecionado(row)}>
                <CheckCircleOutlineIcon fontSize="small" />
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
          Erro ao carregar os tipos de pessoa.
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
            Tipos de Pessoa
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Gerenciamento dos tipos de pessoa cadastrados no sistema.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tipos-pessoa/novo')}
          >
            Novo Tipo
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Buscar"
          placeholder="Nome ou descrição"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          fullWidth
          sx={{ flex: 1, minWidth: 280 }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="tipos-pessoa-status-filtro-label">Status</InputLabel>

          <Select
            labelId="tipos-pessoa-status-filtro-label"
            value={statusFiltro}
            label="Status"
            onChange={(event) => setStatusFiltro(event.target.value as StatusFiltro)}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="ATIVOS">Ativos</MenuItem>
            <MenuItem value="INATIVOS">Inativos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {!tiposPessoa || tiposPessoa.length === 0 ? (
        <EmptyState message="Não existem tipos de pessoa cadastrados no sistema até o momento." />
      ) : tiposFiltrados.length === 0 ? (
        <EmptyState message="Nenhum tipo de pessoa encontrado para os filtros informados." />
      ) : (
        <DataTable rows={tiposFiltrados} columns={columns} />
      )}

      <ConfirmDialog
        open={!!tipoSelecionado}
        title={tipoSelecionado?.ativo ? 'Inativar tipo de pessoa' : 'Ativar tipo de pessoa'}
        message={
          tipoSelecionado
            ? tipoSelecionado.ativo
              ? `Deseja inativar o tipo "${tipoSelecionado.nome}"?`
              : `Deseja ativar o tipo "${tipoSelecionado.nome}"?`
            : ''
        }
        onConfirm={alterarStatus}
        onCancel={() => setTipoSelecionado(null)}
        isConfirming={alterarAtivo.isPending}
      />

      {feedback && <Feedback message={feedback.message} severity={feedback.severity} />}
    </Box>
  );
}
