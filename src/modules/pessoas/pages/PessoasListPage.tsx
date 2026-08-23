import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Column } from '../../../components/table/DataTable/DataTable';

import {
  Add as AddIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
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

import { useDeletePessoa, usePessoas, useTiposPessoa } from '../hooks/usePessoas';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Feedback } from '../../../components/common/Feedback/Feedback';

import type { PessoaResponse } from '../types/pessoas';

type StatusFiltro = 'TODOS' | 'ATIVOS' | 'INATIVOS';

export default function PessoasListPage() {
  const navigate = useNavigate();

  const { data: pessoas, isLoading, isError, refetch } = usePessoas();

  const { data: tiposPessoa = [], isLoading: isLoadingTiposPessoa } = useTiposPessoa();

  const deletePessoa = useDeletePessoa();

  const [pessoaParaInativar, setPessoaParaInativar] = useState<PessoaResponse | null>(null);

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('TODOS');
  const [tipoFiltro, setTipoFiltro] = useState<string>('TODOS');

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

  const pessoasFiltradas = useMemo(() => {
    if (!pessoas) {
      return [];
    }

    const termo = busca.trim().toLowerCase();

    return pessoas.filter((pessoa) => {
      const correspondeBusca =
        !termo ||
        pessoa.nome?.toLowerCase().includes(termo) ||
        pessoa.documento?.toLowerCase().includes(termo) ||
        pessoa.telefone?.toLowerCase().includes(termo) ||
        pessoa.email?.toLowerCase().includes(termo);

      const correspondeStatus =
        statusFiltro === 'TODOS' ||
        (statusFiltro === 'ATIVOS' && pessoa.ativo) ||
        (statusFiltro === 'INATIVOS' && !pessoa.ativo);

      const correspondeTipo =
        tipoFiltro === 'TODOS' ||
        pessoa.tipos?.some((tipo) => tipo.toLowerCase() === tipoFiltro.toLowerCase());

      return correspondeBusca && correspondeStatus && correspondeTipo;
    });
  }, [pessoas, busca, statusFiltro, tipoFiltro]);

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
          placeholder="Nome, documento, telefone ou e-mail"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          fullWidth
          sx={{
            flex: 1,
            minWidth: 280,
          }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="pessoas-status-filtro-label">Status</InputLabel>

          <Select
            labelId="pessoas-status-filtro-label"
            value={statusFiltro}
            label="Status"
            onChange={(event) => setStatusFiltro(event.target.value as StatusFiltro)}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="ATIVOS">Ativos</MenuItem>
            <MenuItem value="INATIVOS">Inativos</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={isLoadingTiposPessoa}>
          <InputLabel id="pessoas-tipo-filtro-label">Tipo</InputLabel>

          <Select
            labelId="pessoas-tipo-filtro-label"
            value={tipoFiltro}
            label="Tipo"
            onChange={(event) => setTipoFiltro(event.target.value)}
          >
            <MenuItem value="TODOS">Todos</MenuItem>

            {tiposPessoa
              .filter((tipo) => tipo.ativo !== false)
              .map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.nome}>
                  {tipo.nome}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {!pessoas || pessoas.length === 0 ? (
        <EmptyState message="Não existem pessoas cadastradas no sistema até o momento." />
      ) : pessoasFiltradas.length === 0 ? (
        <EmptyState message="Nenhuma pessoa encontrada para os filtros informados." />
      ) : (
        <DataTable rows={pessoasFiltradas} columns={columns} />
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
