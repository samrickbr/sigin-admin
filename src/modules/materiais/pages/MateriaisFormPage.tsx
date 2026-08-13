import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import { useCreateMaterial, useMaterial, useUpdateMaterial } from '../hooks/useMateriais';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const materialSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório.'),
  nome: z.string().min(1, 'Nome é obrigatório.'),
  descricao: z.string().optional(),
  unidadeMedida: z.string().min(1, 'Unidade de medida é obrigatória.'),
  estoqueMinimo: z.coerce
    .number({
      error: 'Estoque mínimo é obrigatório.',
    })
    .min(0, 'Estoque mínimo não pode ser negativo.'),
});

type MaterialFormInput = z.input<typeof materialSchema>;
type MaterialFormData = z.output<typeof materialSchema>;

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

  return 'Não foi possível salvar o material. Verifique os dados informados.';
}

export default function MaterialFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const materialId = id ? Number(id) : undefined;
  const isEditing = materialId !== undefined && !Number.isNaN(materialId);

  const materialQuery = useMaterial(materialId);

  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaterialFormInput, undefined, MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      codigo: '',
      nome: '',
      descricao: '',
      unidadeMedida: '',
      estoqueMinimo: 0,
    },
  });

  useEffect(() => {
    if (!materialQuery.data) {
      return;
    }

    reset({
      codigo: materialQuery.data.codigo,
      nome: materialQuery.data.nome,
      descricao: materialQuery.data.descricao ?? '',
      unidadeMedida: materialQuery.data.unidadeMedida,
      estoqueMinimo: Number(materialQuery.data.estoqueMinimo),
    });
  }, [materialQuery.data, reset]);

  const onSubmit = async (data: MaterialFormData) => {
    try {
      if (isEditing && materialId !== undefined) {
        await updateMutation.mutateAsync({
          id: materialId,
          data: {
            nome: data.nome,
            descricao: data.descricao,
            unidadeMedida: data.unidadeMedida,
            estoqueMinimo: data.estoqueMinimo,
            ativo: materialQuery.data?.ativo ?? true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          codigo: data.codigo,
          nome: data.nome,
          descricao: data.descricao,
          unidadeMedida: data.unidadeMedida,
          estoqueMinimo: data.estoqueMinimo,
        });
      }

      navigate('/materiais');
    } catch {
      // O erro é apresentado através do estado da mutação.
    }
  };

  if (isEditing && materialQuery.isLoading) {
    return <Loading />;
  }

  if (isEditing && materialQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar o material." />;
  }

  const mutationError = createMutation.error || updateMutation.error;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar material' : 'Novo material'}
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
          name="codigo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Código"
              fullWidth
              disabled={isEditing}
              error={!!errors.codigo}
              helperText={errors.codigo?.message}
            />
          )}
        />

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
          name="unidadeMedida"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Unidade de medida"
              fullWidth
              error={!!errors.unidadeMedida}
              helperText={errors.unidadeMedida?.message}
            />
          )}
        />

        <Controller
          name="estoqueMinimo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Estoque mínimo"
              type="number"
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 'any',
                },
              }}
              error={!!errors.estoqueMinimo}
              helperText={errors.estoqueMinimo?.message}
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
            {isEditing ? 'Salvar alterações' : 'Cadastrar material'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/materiais')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
