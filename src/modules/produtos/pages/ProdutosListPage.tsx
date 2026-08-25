import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  DeleteOutlined as DeleteOutlinedIcon,
} from '@mui/icons-material';

import { useDeleteProduto, useProdutos } from '../hooks/useProdutos';
import { useCategorias } from '../../categorias/hooks/useCategorias';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { ProdutoResponse } from '../types/produtos';

export default function ProdutosListPage() {
  const navigate = useNavigate();

  const deleteMutation = useDeleteProduto();
  const categoriasQuery = useCategorias();

  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [setorFiltro, setSetorFiltro] = useState('');
  const [vendaFiltro, setVendaFiltro] = useState('');
  const [situacaoFiltro, setSituacaoFiltro] = useState('');

  const [produtoParaExcluir, setProdutoParaExcluir] = useState<ProdutoResponse | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaAplicada(search.trim());
      setPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /*
   * A consulta é feita diretamente no Core.
   *
   * Não fazer filtro, busca ou slice no navegador.
   */
  const produtosQuery = useProdutos({
    page,
    size: pageSize,
    busca: buscaAplicada.trim() || undefined,

    categoriaId:
      categoriaFiltro && categoriaFiltro !== '__SEM_CATEGORIA__'
        ? Number(categoriaFiltro)
        : undefined,

    semCategoria: categoriaFiltro === '__SEM_CATEGORIA__',

    setor:
      setorFiltro && setorFiltro !== '__SEM_SETOR__'
        ? (setorFiltro as 'COZINHA' | 'PIZZARIA' | 'BALCAO')
        : undefined,

    semSetor: setorFiltro === '__SEM_SETOR__',

    disponivelVenda:
      vendaFiltro === 'disponivel' ? true : vendaFiltro === 'indisponivel' ? false : undefined,

    ativo: situacaoFiltro === 'ativo' ? true : situacaoFiltro === 'inativo' ? false : undefined,
  });

  const produtos = useMemo(() => produtosQuery.data?.content ?? [], [produtosQuery.data?.content]);

  const totalProdutos = produtosQuery.data?.totalElements ?? 0;

  /*
   * As categorias são usadas somente para montar o filtro visual.
   *
   * Como agora o Core retorna somente a página atual,
   * esta lista representa apenas as categorias presentes na página.
   *
   * Se o Core já possuir endpoint de categorias, o ideal é utilizar
   * esse endpoint posteriormente para popular o filtro.
   */
  const categorias = useMemo(() => {
    return [...(categoriasQuery.data ?? [])].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [categoriasQuery.data]);

  const limparFiltros = () => {
    setSearch('');
    setCategoriaFiltro('');
    setSetorFiltro('');
    setVendaFiltro('');
    setSituacaoFiltro('');
    setPage(0);
  };

  const possuiFiltros =
    search !== '' ||
    categoriaFiltro !== '' ||
    setorFiltro !== '' ||
    vendaFiltro !== '' ||
    situacaoFiltro !== '';

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
    return <Feedback severity="error" message="Não foi possível carregar os produtos." />;
  }

  const columns = [
    {
      id: 'codigo',
      field: 'codigo' as keyof ProdutoResponse,
      label: 'Código',
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
      id: 'setor',
      field: 'setor' as keyof ProdutoResponse,
      label: 'Setor',
      renderCell: (produto: ProdutoResponse) => {
        const labels: Record<string, string> = {
          COZINHA: 'Cozinha',
          PIZZARIA: 'Pizzaria',
          BALCAO: 'Balcão',
        };

        return <Chip size="small" label={labels[produto.setor ?? ''] ?? '-'} variant="outlined" />;
      },
    },
    {
      id: 'precoVenda',
      field: 'precoVenda' as keyof ProdutoResponse,
      label: 'Preço padrão',
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
          label={produto.disponivelVenda ? 'Disponível' : 'Indisponível'}
          color={produto.disponivelVenda ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'ativo',
      field: 'ativo' as keyof ProdutoResponse,
      label: 'Situação',
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
      label: 'Ações',
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

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '2fr 1fr 1fr 1fr 1fr',
          },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label="Buscar produto"
          placeholder="Código, nome ou categoria"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          fullWidth
        />

        <TextField
          select
          label="Categoria"
          value={categoriaFiltro}
          onChange={(event) => {
            setCategoriaFiltro(event.target.value);
            setPage(0);
          }}
          fullWidth
        >
          <MenuItem value="">Todas</MenuItem>

          <MenuItem value="__SEM_CATEGORIA__">Sem categoria</MenuItem>

          {categorias.map((categoria) => (
            <MenuItem key={categoria.id} value={String(categoria.id)}>
              {categoria.nome}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Setor"
          value={setorFiltro}
          onChange={(event) => {
            setSetorFiltro(event.target.value);
            setPage(0);
          }}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>

          <MenuItem value="__SEM_SETOR__">Sem setor</MenuItem>

          <MenuItem value="COZINHA">Cozinha</MenuItem>

          <MenuItem value="PIZZARIA">Pizzaria</MenuItem>

          <MenuItem value="BALCAO">Balcão</MenuItem>
        </TextField>

        <TextField
          select
          label="Venda"
          value={vendaFiltro}
          onChange={(event) => {
            setVendaFiltro(event.target.value);
            setPage(0);
          }}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>

          <MenuItem value="disponivel">Disponível</MenuItem>

          <MenuItem value="indisponivel">Indisponível</MenuItem>
        </TextField>

        <TextField
          select
          label="Situação"
          value={situacaoFiltro}
          onChange={(event) => {
            setSituacaoFiltro(event.target.value);
            setPage(0);
          }}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>

          <MenuItem value="ativo">Ativo</MenuItem>

          <MenuItem value="inativo">Inativo</MenuItem>
        </TextField>
      </Box>

      {possuiFiltros && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2,
          }}
        >
          <Button variant="text" onClick={limparFiltros}>
            Limpar filtros
          </Button>
        </Box>
      )}

      {produtos.length === 0 ? (
        <EmptyState
          message={
            possuiFiltros
              ? 'Nenhum produto encontrado para os filtros informados.'
              : 'Nenhum produto encontrado.'
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={produtos}
          emptyMessage="Nenhum produto encontrado para os filtros informados."
          page={page}
          pageSize={pageSize}
          totalRows={totalProdutos}
          onPageChange={setPage}
          onPageSizeChange={(novoPageSize) => {
            setPageSize(novoPageSize);
            setPage(0);
          }}
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
