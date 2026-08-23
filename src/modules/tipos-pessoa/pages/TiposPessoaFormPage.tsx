import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCreateTipoPessoa, useTipoPessoa, useUpdateTipoPessoa } from '../hooks/useTiposPessoa';

import { Feedback, Loading } from '../../../components/common';

const schema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),

  descricao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function TipoPessoaFormPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const tipoPessoaId = id ? Number(id) : undefined;

  const editando = tipoPessoaId !== undefined && Number.isFinite(tipoPessoaId);

  const tipoPessoaQuery = useTipoPessoa(editando ? tipoPessoaId : undefined);

  const createTipoPessoa = useCreateTipoPessoa();
  const updateTipoPessoa = useUpdateTipoPessoa();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (!tipoPessoaQuery.data) {
      return;
    }

    reset({
      nome: tipoPessoaQuery.data.nome,
      descricao: tipoPessoaQuery.data.descricao ?? '',
    });
  }, [tipoPessoaQuery.data, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editando && tipoPessoaId !== undefined) {
        await updateTipoPessoa.mutateAsync({
          id: tipoPessoaId,
          data: {
            nome: data.nome.trim(),
            descricao: data.descricao?.trim() || null,
          },
        });
      } else {
        await createTipoPessoa.mutateAsync({
          nome: data.nome.trim(),
          descricao: data.descricao?.trim() || null,
        });
      }

      navigate('/tipos-pessoa');
    } catch {
      // O feedback da mutation permanece disponível para evolução futura.
    }
  };

  const isSubmitting = createTipoPessoa.isPending || updateTipoPessoa.isPending;

  if (editando && tipoPessoaQuery.isLoading) {
    return <Loading />;
  }

  if (editando && tipoPessoaQuery.isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Não foi possível carregar o tipo de pessoa.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate('/tipos-pessoa')}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  if (editando && tipoPessoaQuery.data === undefined) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tipo de pessoa não encontrado.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate('/tipos-pessoa')}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {editando ? 'Editar tipo de pessoa' : 'Novo tipo de pessoa'}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {editando ? 'Altere os dados do tipo de pessoa.' : 'Cadastre um novo tipo de pessoa.'}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate('/tipos-pessoa')}
          disabled={isSubmitting}
        >
          Voltar
        </Button>
      </Box>

      {createTipoPessoa.isError && (
        <Feedback message="Não foi possível cadastrar o tipo de pessoa." severity="error" />
      )}

      {updateTipoPessoa.isError && (
        <Feedback message="Não foi possível atualizar o tipo de pessoa." severity="error" />
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack
          spacing={2}
          sx={{
            width: '100%',
            maxWidth: 600,
          }}
        >
          <TextField
            {...register('nome')}
            label="Nome"
            required
            fullWidth
            disabled={isSubmitting}
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />

          <TextField
            {...register('descricao')}
            label="Descrição"
            fullWidth
            multiline
            minRows={3}
            disabled={isSubmitting}
            error={!!errors.descricao}
            helperText={errors.descricao?.message}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              pt: 1,
            }}
          >
            <Button
              variant="text"
              onClick={() => navigate('/tipos-pessoa')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
