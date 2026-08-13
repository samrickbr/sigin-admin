import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { useCategoria, useCreateCategoria, useUpdateCategoria } from '../hooks/useCategorias';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  descricao: z.string().optional(),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

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

  return 'Não foi possível salvar a categoria. Verifique os dados informados.';
}

export default function CategoriaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const categoriaId = id ? Number(id) : undefined;
  const isEditing = categoriaId !== undefined && !Number.isNaN(categoriaId);

  const categoriaQuery = useCategoria(categoriaId);

  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (!categoriaQuery.data) {
      return;
    }

    reset({
      nome: categoriaQuery.data.nome,
      descricao: categoriaQuery.data.descricao ?? '',
    });
  }, [categoriaQuery.data, reset]);

  const onSubmit = async (data: CategoriaFormData) => {
    try {
      if (isEditing && categoriaId !== undefined) {
        await updateMutation.mutateAsync({
          id: categoriaId,
          data: {
            nome: data.nome,
            descricao: data.descricao,
            ativo: categoriaQuery.data?.ativo ?? true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          nome: data.nome,
          descricao: data.descricao,
          ativo: true,
        });
      }

      navigate('/categorias');
    } catch {
      // O erro é apresentado abaixo através do estado da mutação.
    }
  };

  if (isEditing && categoriaQuery.isLoading) {
    return <Loading />;
  }

  if (isEditing && categoriaQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar a categoria." />;
  }

  const mutationError = createMutation.error || updateMutation.error;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar categoria' : 'Nova categoria'}
      </Typography>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity="error" message={getErrorMessage(mutationError)} />
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

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
          }}
        >
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar categoria'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/categorias')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
