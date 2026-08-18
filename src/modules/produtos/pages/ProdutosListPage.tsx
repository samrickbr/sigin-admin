import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  DeleteOutlined as DeleteOutlinedIcon,
} from '@mui/icons-material';

import { useDeleteProduto, useProdutos } from '../hooks/useProdutos';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { ProdutoResponse } from '../types/produtos';

export default function ProdutosListPage() {
  const navigate = useNavigate();

  const produtosQuery = useProdutos();
  const deleteMutation = useDeleteProduto();

  const [search, setSearch] = useState('');
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<ProdutoResponse | null>(null);

  const produtos = useMemo(() => produtosQuery.data ?? [], [produtosQuery.data]);

  const produtosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();

    if (!termo) {
      return produtos.slice(0, 20);
    }

    return produtos
      .filter((produto) => {
        return (
          produto.codigo?.toLowerCase().includes(termo) ||
          produto.nome.toLowerCase().includes(termo) ||
          produto.categoria?.toLowerCase().includes(termo)
        );
      })
      .slice(0, 20);
  }, [produtos, search]);

  const handleExcluir = async () => {
    if (!produtoParaExcluir) {
      return;
    }

    await deleteMutation.mutateAsync(produtoParaExcluir.id);
    setProdutoParaExcluir(null);
  };

  if (produtosQuery.isLoading) {
    return <Loading />;
  }

  if (produtosQuery.isError) {
    return <Feedback severity="error" message="NÃ£o foi possÃ­vel carregar os produtos." />;
  }

  const columns = [
    {
      id: 'codigo',
      field: 'codigo' as keyof ProdutoResponse,
      label: 'CÃ³digo',
    },
    {
      id: 'nome',
      field: 'nome' as keyof ProdutoResponse,
      label: 'Nome',
    },
    {
      id: 'categoria',
      field: 'categoria' as keyof ProdutoResponse,
      label: 'Categoria',
    },
    {
      id: 'precoVenda',
      field: 'precoVenda' as keyof ProdutoResponse,
      label: 'PreÃ§o padrÃ£o',
      renderCell: (produto: ProdutoResponse) =>
        produto.precoVenda != null
          ? produto.precoVenda.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : '-',
    },
    {
      id: 'disponivelVenda',
      field: 'disponivelVenda' as keyof ProdutoResponse,
      label: 'Venda',
      renderCell: (produto: ProdutoResponse) => (
        <Chip
          size="small"
          label={produto.disponivelVenda ? 'DisponÃ­vel' : 'IndisponÃ­vel'}
          color={produto.disponivelVenda ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'ativo',
      field: 'ativo' as keyof ProdutoResponse,
      label: 'SituaÃ§Ã£o',
      renderCell: (produto: ProdutoResponse) => (
        <Chip
          size="small"
          label={produto.ativo ? 'Ativo' : 'Inativo'}
          color={produto.ativo ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'acoes',
      label: 'AÃ§Ãµes',
      renderCell: (produto: ProdutoResponse) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => navigate(`/produtos/${produto.id}/editar`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Inativar">
            <IconButton size="small" color="error" onClick={() => setProdutoParaExcluir(produto)}>
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

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
        <Typography variant="h4">Produtos</Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton onClick={() => produtosQuery.refetch()} disabled={produtosQuery.isFetching}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/produtos/novo')}
          >
            Novo produto
          </Button>
        </Box>
      </Box>

      <TextField
        fullWidth
        label="Buscar produto"
        placeholder="CÃ³digo, nome ou categoria"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ mb: 2 }}
      />

      {produtos.length === 0 ? (
        <EmptyState message="Nenhum produto encontrado." />
      ) : (
        <DataTable
          columns={columns}
          rows={produtosFiltrados}
          emptyMessage="Nenhum produto encontrado para a busca."
        />
      )}

      <ConfirmDialog
        open={produtoParaExcluir !== null}
        title="Inativar produto"
        message={
          produtoParaExcluir
            ? `Deseja realmente inativar o produto "${produtoParaExcluir.nome}"?`
            : ''
        }
        onConfirm={handleExcluir}
        onCancel={() => setProdutoParaExcluir(null)}
      />
    </Box>
  );
}
