import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import { useCreateLocal, useLocal, useUpdateLocal } from '../hooks/useLocais';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const localSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
});

type LocalFormData = z.infer<typeof localSchema>;

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

  return 'Não foi possível salvar o local. Verifique os dados informados.';
}

export default function LocalFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const localId = id ? Number(id) : undefined;
  const isEditing = localId !== undefined && !Number.isNaN(localId);

  const localQuery = useLocal(localId);

  const createMutation = useCreateLocal();
  const updateMutation = useUpdateLocal();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LocalFormData>({
    resolver: zodResolver(localSchema),
    defaultValues: {
      nome: '',
    },
  });

  useEffect(() => {
    if (!localQuery.data) {
      return;
    }

    reset({
      nome: localQuery.data.nome,
    });
  }, [localQuery.data, reset]);

  const onSubmit = async (data: LocalFormData) => {
    try {
      if (isEditing && localId !== undefined) {
        await updateMutation.mutateAsync({
          id: localId,
          data: {
            nome: data.nome,
            ativo: localQuery.data?.ativo ?? true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          nome: data.nome,
        });
      }

      navigate('/locais');
    } catch {
      // O erro é apresentado através do estado da mutação.
    }
  };

  if (isEditing && localQuery.isLoading) {
    return <Loading />;
  }

  if (isEditing && localQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar o local." />;
  }

  const mutationError = createMutation.error || updateMutation.error;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar local' : 'Novo local'}
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

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
          }}
        >
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar local'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/locais')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
