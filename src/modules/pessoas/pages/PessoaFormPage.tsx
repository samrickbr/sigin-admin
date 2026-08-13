import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreatePessoa, usePessoa, useUpdatePessoa } from '../hooks/usePessoas';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const pessoaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  tipoDocumento: z.string().min(1, 'Tipo de documento é obrigatório.'),
  documento: z.string().min(1, 'Documento é obrigatório.'),
  telefone: z.string().optional(),
  email: z.string().email('Informe um e-mail válido.').or(z.literal('')).optional(),
  observacao: z.string().optional(),
  ativo: z.boolean(),
});

type PessoaFormData = z.infer<typeof pessoaSchema>;

export default function PessoaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const pessoaId = id ? Number(id) : undefined;
  const isEditing = !!pessoaId;

  const { data: pessoa, isLoading: isLoadingPessoa, isError: isPessoaError } = usePessoa(pessoaId);

  const createPessoa = useCreatePessoa();
  const updatePessoa = useUpdatePessoa();

  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PessoaFormData>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: {
      nome: '',
      tipoDocumento: '',
      documento: '',
      telefone: '',
      email: '',
      observacao: '',
      ativo: true,
    },
  });

  useEffect(() => {
    if (!pessoa) {
      return;
    }

    reset({
      nome: pessoa.nome,
      tipoDocumento: pessoa.tipoDocumento,
      documento: pessoa.documento,
      telefone: pessoa.telefone ?? '',
      email: pessoa.email ?? '',
      observacao: pessoa.observacao ?? '',
      ativo: pessoa.ativo,
    });
  }, [pessoa, reset]);

  const onSubmit = async (data: PessoaFormData) => {
    try {
      if (isEditing && pessoaId) {
        await updatePessoa.mutateAsync({
          id: pessoaId,
          data,
        });

        setFeedback({
          message: 'Pessoa atualizada com sucesso.',
          severity: 'success',
        });
      } else {
        await createPessoa.mutateAsync({
          nome: data.nome,
          tipoDocumento: data.tipoDocumento,
          documento: data.documento,
          telefone: data.telefone,
          email: data.email,
          observacao: data.observacao,
        });

        setFeedback({
          message: 'Pessoa cadastrada com sucesso.',
          severity: 'success',
        });
      }

      setTimeout(() => {
        navigate('/pessoas');
      }, 500);
    } catch {
      setFeedback({
        message: isEditing
          ? 'Não foi possível atualizar a pessoa.'
          : 'Não foi possível cadastrar a pessoa.',
        severity: 'error',
      });
    }
  };

  if (isEditing && isLoadingPessoa) {
    return <Loading />;
  }

  if (isEditing && isPessoaError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Não foi possível carregar os dados da pessoa.</Alert>

        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/pessoas')}>
          Voltar
        </Button>
      </Box>
    );
  }

  const isSubmitting = createPessoa.isPending || updatePessoa.isPending;

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isEditing ? 'Editar Pessoa' : 'Nova Pessoa'}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {isEditing
            ? 'Atualize os dados cadastrais da pessoa.'
            : 'Cadastre uma nova pessoa no sistema.'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
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
            name="tipoDocumento"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.tipoDocumento}>
                <InputLabel>Tipo de Documento</InputLabel>

                <Select {...field} label="Tipo de Documento">
                  <MenuItem value="CPF">CPF</MenuItem>
                  <MenuItem value="CNPJ">CNPJ</MenuItem>
                  <MenuItem value="RG">RG</MenuItem>
                  <MenuItem value="OUTRO">Outro</MenuItem>
                </Select>

                {errors.tipoDocumento && (
                  <FormHelperText>{errors.tipoDocumento.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="documento"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Documento"
                fullWidth
                required
                error={!!errors.documento}
                helperText={errors.documento?.message}
              />
            )}
          />

          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Telefone"
                fullWidth
                error={!!errors.telefone}
                helperText={errors.telefone?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="observacao"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Observação" fullWidth multiline minRows={3} />
            )}
          />

          {isEditing && (
            <Controller
              name="ativo"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>

                  <Select
                    value={field.value ? 'ativo' : 'inativo'}
                    label="Status"
                    onChange={(event) => field.onChange(event.target.value === 'ativo')}
                  >
                    <MenuItem value="ativo">Ativo</MenuItem>
                    <MenuItem value="inativo">Inativo</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          )}

          {feedback && <Feedback message={feedback.message} severity={feedback.severity} />}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              pt: 1,
            }}
          >
            <Button variant="outlined" onClick={() => navigate('/pessoas')} disabled={isSubmitting}>
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Pessoa'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
