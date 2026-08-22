import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useCreateFormaPagamento,
  useFormaPagamento,
  useUpdateFormaPagamento,
} from '../hooks/useFormasPagamento';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const formaPagamentoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória.'),
  baixaAutomatica: z.boolean(),
});

type FormaPagamentoFormData = z.infer<typeof formaPagamentoSchema>;

export default function FormaPagamentoFormPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const formaPagamentoId = id ? Number(id) : undefined;

  const isEditing = formaPagamentoId !== undefined && !Number.isNaN(formaPagamentoId);

  const formaPagamentoQuery = useFormaPagamento(formaPagamentoId);

  const createMutation = useCreateFormaPagamento();
  const updateMutation = useUpdateFormaPagamento();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormaPagamentoFormData>({
    resolver: zodResolver(formaPagamentoSchema),
    defaultValues: {
      descricao: '',
      baixaAutomatica: false,
    },
  });

  useEffect(() => {
    if (!formaPagamentoQuery.data) {
      return;
    }

    reset({
      descricao: formaPagamentoQuery.data.descricao,
      baixaAutomatica: formaPagamentoQuery.data.baixaAutomatica,
    });
  }, [formaPagamentoQuery.data, reset]);

  const onSubmit = async (data: FormaPagamentoFormData) => {
    try {
      if (isEditing && formaPagamentoId !== undefined) {
        await updateMutation.mutateAsync({
          id: formaPagamentoId,
          data: {
            descricao: data.descricao,
            baixaAutomatica: data.baixaAutomatica,
          },
        });

        navigate('/formas-pagamento', {
          state: {
            message: 'Forma de pagamento atualizada com sucesso.',
          },
        });

        return;
      }

      await createMutation.mutateAsync({
        descricao: data.descricao,
        baixaAutomatica: data.baixaAutomatica,
      });

      navigate('/formas-pagamento', {
        state: {
          message: 'Forma de pagamento cadastrada com sucesso.',
        },
      });
    } catch {
      // O erro é apresentado pelo estado da mutação.
    }
  };

  if (isEditing && formaPagamentoQuery.isLoading) {
    return <Loading />;
  }

  if (isEditing && formaPagamentoQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar a forma de pagamento." />;
  }

  const mutationError = createMutation.error || updateMutation.error;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditing ? 'Editar forma de pagamento' : 'Nova forma de pagamento'}
      </Typography>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback
            severity="error"
            message="Não foi possível salvar a forma de pagamento. Verifique os dados informados."
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
          name="descricao"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descrição"
              fullWidth
              error={!!errors.descricao}
              helperText={errors.descricao?.message}
            />
          )}
        />

        <Controller
          name="baixaAutomatica"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
              label="Baixa automática"
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
            {isEditing ? 'Salvar alterações' : 'Cadastrar forma'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            disabled={isSaving}
            onClick={() => navigate('/formas-pagamento')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
