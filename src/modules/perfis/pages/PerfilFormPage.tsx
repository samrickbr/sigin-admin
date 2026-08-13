import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { useCreatePerfil, usePerfil, useUpdatePerfil } from '../hooks/usePerfis';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const perfilSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  descricao: z.string().optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

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

  return 'Não foi possível salvar o perfil. Verifique os dados informados.';
}

export default function PerfilFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const perfilId = id ? Number(id) : undefined;
  const isEditing = perfilId !== undefined && !Number.isNaN(perfilId);

  const perfilQuery = usePerfil(perfilId);

  const createMutation = useCreatePerfil();
  const updateMutation = useUpdatePerfil();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (!perfilQuery.data) {
      return;
    }

    reset({
      nome: perfilQuery.data.nome,
      descricao: perfilQuery.data.descricao ?? '',
    });
  }, [perfilQuery.data, reset]);

  const onSubmit = async (data: PerfilFormData) => {
    try {
      if (isEditing && perfilId !== undefined) {
        await updateMutation.mutateAsync({
          id: perfilId,
          data: {
            nome: data.nome,
            descricao: data.descricao,
            ativo: perfilQuery.data?.ativo ?? true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          nome: data.nome,
          descricao: data.descricao,
          ativo: true,
        });
      }

      navigate('/perfis');
    } catch {
      // O erro é apresentado abaixo.
    }
  };

  if (isEditing && perfilQuery.isLoading) {
    return <Loading />;
  }

  if (isEditing && perfilQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar o perfil." />;
  }

  const mutationError = createMutation.error || updateMutation.error;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar perfil' : 'Novo perfil'}
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
              required
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
            {isEditing ? 'Salvar alterações' : 'Cadastrar perfil'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/perfis')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
