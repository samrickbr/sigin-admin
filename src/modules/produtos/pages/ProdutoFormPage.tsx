import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useCreateProduto,
  useCreateProdutoCanal,
  useProduto,
  useProdutosCanais,
  useUpdateProduto,
  useUpdateProdutoCanal,
} from '../hooks/useProdutos';

import { useCategorias } from '../../categorias/hooks/useCategorias';

import { useCanaisVenda } from '../../canais-venda/hooks/useCanaisVenda';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

import { ProdutoMateriaisSection } from '../components/ProdutoMateriaisSection';

const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  descricao: z.string().optional(),
  categoriaId: z.number().positive('Selecione uma categoria.'),
  precoVenda: z.number().min(0, 'O preço deve ser maior ou igual a zero.'),
  disponivelVenda: z.boolean(),
  imagem: z.string().optional(),
  canaisVendaIds: z.array(z.number()),
});

type ProdutoFormData = z.infer<typeof produtoSchema>;

export default function ProdutoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const produtoId = id ? Number(id) : undefined;
  const isEditing = produtoId !== undefined && !Number.isNaN(produtoId);

  const produtoQuery = useProduto(produtoId);
  const categoriasQuery = useCategorias();
  const canaisQuery = useCanaisVenda();
  const produtosCanaisQuery = useProdutosCanais();

  const createMutation = useCreateProduto();
  const updateMutation = useUpdateProduto();

  const createProdutoCanalMutation = useCreateProdutoCanal();
  const updateProdutoCanalMutation = useUpdateProdutoCanal();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      categoriaId: 0,
      precoVenda: 0,
      disponivelVenda: true,
      imagem: '',
      canaisVendaIds: [],
    },
  });

  useEffect(() => {
    if (!produtoQuery.data) {
      return;
    }

    reset({
      nome: produtoQuery.data.nome,
      descricao: produtoQuery.data.descricao ?? '',
      categoriaId: produtoQuery.data.categoriaId ?? 0,
      precoVenda: produtoQuery.data.precoVenda ?? 0,
      disponivelVenda: produtoQuery.data.disponivelVenda ?? true,
      imagem: produtoQuery.data.imagem ?? '',
      canaisVendaIds:
        produtosCanaisQuery.data
          ?.filter((item) => item.produtoId === produtoQuery.data.id && item.ativo)
          .map((item) => item.canalVendaId) ?? [],
    });
  }, [produtoQuery.data, produtosCanaisQuery.data, reset]);

  const onSubmit = async (data: ProdutoFormData) => {
    try {
      let produtoSalvo;

      if (isEditing && produtoId !== undefined) {
        produtoSalvo = await updateMutation.mutateAsync({
          id: produtoId,
          data: {
            nome: data.nome,
            descricao: data.descricao,
            categoriaId: data.categoriaId,
            precoVenda: data.precoVenda,
            disponivelVenda: data.disponivelVenda,
            imagem: data.imagem,
          },
        });
      } else {
        produtoSalvo = await createMutation.mutateAsync({
          nome: data.nome,
          descricao: data.descricao,
          categoriaId: data.categoriaId,
          precoVenda: data.precoVenda,
          disponivelVenda: data.disponivelVenda,
          imagem: data.imagem,
        });
      }

      const canaisAtuais =
        produtosCanaisQuery.data?.filter((item) => item.produtoId === produtoSalvo.id) ?? [];

      for (const canal of canaisQuery.data ?? []) {
        const produtoCanal = canaisAtuais.find((item) => item.canalVendaId === canal.id);

        const selecionado = data.canaisVendaIds.includes(canal.id);

        if (produtoCanal) {
          if (produtoCanal.ativo !== selecionado) {
            await updateProdutoCanalMutation.mutateAsync({
              id: produtoCanal.id,
              data: {
                produtoId: produtoSalvo.id,
                canalVendaId: canal.id,
                precoVenda: produtoCanal.precoVenda,
                ativo: selecionado,
              },
            });
          }
        } else if (selecionado) {
          await createProdutoCanalMutation.mutateAsync({
            produtoId: produtoSalvo.id,
            canalVendaId: canal.id,
            ativo: true,
          });
        }
      }

      navigate('/produtos');
    } catch {
      // O feedback da operação será tratado pelo estado das mutações.
    }
  };

  if (
    (isEditing && produtoQuery.isLoading) ||
    categoriasQuery.isLoading ||
    canaisQuery.isLoading ||
    (isEditing && produtosCanaisQuery.isLoading)
  ) {
    return <Loading />;
  }

  if (
    produtoQuery.isError ||
    categoriasQuery.isError ||
    canaisQuery.isError ||
    produtosCanaisQuery.isError
  ) {
    return <Feedback severity="error" message="Não foi possível carregar os dados do produto." />;
  }

  const isSaving =
    isSubmitting ||
    createMutation.isPending ||
    updateMutation.isPending ||
    createProdutoCanalMutation.isPending ||
    updateProdutoCanalMutation.isPending;

  const mutationError =
    createMutation.error ||
    updateMutation.error ||
    createProdutoCanalMutation.error ||
    updateProdutoCanalMutation.error;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar produto' : 'Novo produto'}
      </Typography>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity="error" message="Não foi possível salvar o produto." />
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 700,
        }}
      >
        <Typography variant="h6">Dados gerais</Typography>

        <Controller
          name="nome"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome"
              fullWidth
              error={!!errors.nome}
              helperText={errors.nome?.message}
            />
          )}
        />

        <Controller
          name="descricao"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descrição"
              fullWidth
              multiline
              minRows={3}
              error={!!errors.descricao}
              helperText={errors.descricao?.message}
            />
          )}
        />

        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="Categoria"
              value={field.value || ''}
              onChange={(event) => {
                field.onChange(Number(event.target.value));
              }}
              error={!!errors.categoriaId}
              helperText={errors.categoriaId?.message}
            >
              <MenuItem value="" disabled>
                Selecione uma categoria
              </MenuItem>

              {categoriasQuery.data?.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="imagem"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Imagem"
              fullWidth
              error={!!errors.imagem}
              helperText={errors.imagem?.message}
            />
          )}
        />

        <Divider sx={{ my: 1 }} />

        <Typography variant="h6">Preço padrão</Typography>

        <Controller
          name="precoVenda"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Preço de venda"
              type="number"
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.01,
                },
              }}
              onChange={(event) => {
                field.onChange(Number(event.target.value));
              }}
              error={!!errors.precoVenda}
              helperText={errors.precoVenda?.message}
            />
          )}
        />

        <Controller
          name="disponivelVenda"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.checked);
                  }}
                />
              }
              label="Disponível para venda"
            />
          )}
        />

        <Divider sx={{ my: 1 }} />

        <Typography variant="h6">Canais de venda</Typography>

        <Typography variant="body2" color="text.secondary">
          Selecione em quais canais este produto estará disponível.
        </Typography>

        <Controller
          name="canaisVendaIds"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {canaisQuery.data
                ?.filter((canal) => canal.ativo !== false)
                .map((canal) => {
                  const checked = field.value.includes(canal.id);

                  return (
                    <FormControlLabel
                      key={canal.id}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(event) => {
                            const novosIds = event.target.checked
                              ? [...field.value, canal.id]
                              : field.value.filter((id) => id !== canal.id);

                            field.onChange(novosIds);
                          }}
                        />
                      }
                      label={canal.nome}
                    />
                  );
                })}
            </Box>
          )}
        />

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
          }}
        >
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar produto'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/produtos')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>

      {isEditing && produtoId !== undefined && (
        <>
          <Divider sx={{ my: 4 }} />

          <ProdutoMateriaisSection produtoId={produtoId} />
        </>
      )}
    </Box>
  );
}
