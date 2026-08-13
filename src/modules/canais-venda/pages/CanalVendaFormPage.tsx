import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCanalVenda, useCreateCanalVenda, useUpdateCanalVenda } from '../hooks/useCanaisVenda';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const canalVendaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  descricao: z.string().optional(),
});

type CanalVendaFormData = z.infer<typeof canalVendaSchema>;

export default function CanalVendaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const canalVendaId = id ? Number(id) : undefined;

  const isEditing = canalVendaId !== undefined && !Number.isNaN(canalVendaId);

  const canalVendaQuery = useCanalVenda(canalVendaId);

  const createMutation = useCreateCanalVenda();

  const updateMutation = useUpdateCanalVenda();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CanalVendaFormData>({
    resolver: zodResolver(canalVendaSchema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (!canalVendaQuery.data) {
      return;
    }

    reset({
      nome: canalVendaQuery.data.nome,
      descricao: canalVendaQuery.data.descricao ?? '',
    });
  }, [canalVendaQuery.data, reset]);

  const onSubmit = async (data: CanalVendaFormData) => {
    try {
      if (isEditing && canalVendaId !== undefined) {
        await updateMutation.mutateAsync({
          id: canalVendaId,
          data: {
            nome: data.nome,
            descricao: data.descricao,
            ativo: canalVendaQuery.data?.ativo ?? true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          nome: data.nome,
          descricao: data.descricao,
          ativo: true,
        });
      }

      navigate('/canais-venda');
    } catch {
      // O erro é apresentado pelo estado da mutação.
    }
  };

  if (isEditing && canalVendaQuery.isLoading) {
    return <Loading />;
  }

  if (isEditing && canalVendaQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar o canal de venda." />;
  }

  const mutationError = createMutation.error || updateMutation.error;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar canal de venda' : 'Novo canal de venda'}
      </Typography>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback
            severity="error"
            message="Não foi possível salvar o canal de venda. Verifique os dados informados."
          />
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
            {isEditing ? 'Salvar alterações' : 'Cadastrar canal'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/canais-venda')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
