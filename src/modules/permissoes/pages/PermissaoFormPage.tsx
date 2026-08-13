import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreatePermissao, usePermissao, useUpdatePermissao } from '../hooks/usePermissoes';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const permissaoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório.'),
  descricao: z.string().optional(),
});

type PermissaoFormData = z.infer<typeof permissaoSchema>;

export default function PermissaoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const permissaoId = id ? Number(id) : undefined;
  const isEditing = permissaoId !== undefined && !Number.isNaN(permissaoId);

  const permissaoQuery = usePermissao(permissaoId);

  const createMutation = useCreatePermissao();
  const updateMutation = useUpdatePermissao();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PermissaoFormData>({
    resolver: zodResolver(permissaoSchema),
    defaultValues: {
      codigo: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (!permissaoQuery.data) {
      return;
    }

    reset({
      codigo: permissaoQuery.data.codigo,
      descricao: permissaoQuery.data.descricao ?? '',
    });
  }, [permissaoQuery.data, reset]);

  const onSubmit = async (data: PermissaoFormData) => {
    try {
      if (isEditing && permissaoId !== undefined) {
        await updateMutation.mutateAsync({
          id: permissaoId,
          data: {
            codigo: data.codigo,
            descricao: data.descricao,
            ativo: permissaoQuery.data?.ativo ?? true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          codigo: data.codigo,
          descricao: data.descricao,
          ativo: true,
        });
      }

      navigate('/permissoes');
    } catch {
      // O erro é apresentado abaixo através do estado da mutação.
    }
  };

  if (isEditing && permissaoQuery.isLoading) {
    return <Loading />;
  }

  if (isEditing && permissaoQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar a permissão." />;
  }

  const mutationError = createMutation.error || updateMutation.error;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar permissão' : 'Nova permissão'}
      </Typography>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity="error" message="Não foi possível salvar a permissão." />
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
          name="codigo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Código"
              fullWidth
              required
              error={!!errors.codigo}
              helperText={errors.codigo?.message}
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
            {isEditing ? 'Salvar alterações' : 'Cadastrar permissão'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/permissoes')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
