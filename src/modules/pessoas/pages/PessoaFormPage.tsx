import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useAdicionarTipoPessoa,
  useCreatePessoa,
  usePessoa,
  useTiposPessoa,
  useUpdatePessoa,
} from '../hooks/usePessoas';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const pessoaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  tipoDocumento: z.string().min(1, 'Tipo de documento é obrigatório.'),
  documento: z.string().min(1, 'Documento é obrigatório.'),
  telefone: z.string().optional(),
  email: z.string().email('Informe um e-mail válido.').or(z.literal('')).optional(),
  observacao: z.string().optional(),
  tiposPessoaIds: z.array(z.number()).min(1, 'Selecione pelo menos um tipo de pessoa.'),
  ativo: z.boolean(),
});

type PessoaFormData = z.infer<typeof pessoaSchema>;

export default function PessoaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const pessoaId = id ? Number(id) : undefined;
  const isEditing = !!pessoaId;

  const { data: pessoa, isLoading: isLoadingPessoa, isError: isPessoaError } = usePessoa(pessoaId);

  const {
    data: tiposPessoa = [],
    isLoading: isLoadingTiposPessoa,
    isError: isTiposPessoaError,
  } = useTiposPessoa();

  const createPessoa = useCreatePessoa();
  const updatePessoa = useUpdatePessoa();
  const adicionarTipoPessoa = useAdicionarTipoPessoa();

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
      tiposPessoaIds: [],
      ativo: true,
    },
  });

  useEffect(() => {
    if (!pessoa) {
      return;
    }

    const tiposSelecionados = tiposPessoa
      .filter((tipo) => pessoa.tipos?.includes(tipo.nome))
      .map((tipo) => tipo.id);

    reset({
      nome: pessoa.nome,
      tipoDocumento: pessoa.tipoDocumento,
      documento: pessoa.documento,
      telefone: pessoa.telefone ?? '',
      email: pessoa.email ?? '',
      observacao: pessoa.observacao ?? '',
      tiposPessoaIds: tiposSelecionados,
      ativo: pessoa.ativo,
    });
  }, [pessoa, tiposPessoa, reset]);

  const onSubmit = async (data: PessoaFormData) => {
    try {
      let pessoaCriadaId = pessoaId;

      if (isEditing && pessoaId) {
        await updatePessoa.mutateAsync({
          id: pessoaId,
          data: {
            nome: data.nome,
            tipoDocumento: data.tipoDocumento,
            documento: data.documento,
            telefone: data.telefone,
            email: data.email,
            observacao: data.observacao,
            ativo: data.ativo,
          },
        });
      } else {
        const pessoaCriada = await createPessoa.mutateAsync({
          nome: data.nome,
          tipoDocumento: data.tipoDocumento,
          documento: data.documento,
          telefone: data.telefone,
          email: data.email,
          observacao: data.observacao,
        });

        pessoaCriadaId = pessoaCriada.id;
      }

      if (pessoaCriadaId) {
        const tiposAtuais = pessoa?.tipos ?? [];

        const tiposParaAdicionar = data.tiposPessoaIds.filter((tipoId) => {
          const tipo = tiposPessoa.find((item) => item.id === tipoId);

          return tipo && !tiposAtuais.includes(tipo.nome);
        });

        for (const tipoId of tiposParaAdicionar) {
          await adicionarTipoPessoa.mutateAsync({
            pessoaId: pessoaCriadaId,
            data: {
              tipoPessoaId: tipoId,
            },
          });
        }
      }

      setFeedback({
        message: isEditing ? 'Pessoa atualizada com sucesso.' : 'Pessoa cadastrada com sucesso.',
        severity: 'success',
      });

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

  const isSubmitting =
    createPessoa.isPending || updatePessoa.isPending || adicionarTipoPessoa.isPending;

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

      {isTiposPessoaError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Não foi possível carregar os tipos de pessoa.
        </Alert>
      )}

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
                disabled={isSubmitting}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />

          <Controller
            name="tiposPessoaIds"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                required
                disabled={isSubmitting || isLoadingTiposPessoa}
                error={!!errors.tiposPessoaIds}
              >
                <InputLabel id="tipos-pessoa-label">Tipo de Pessoa</InputLabel>

                <Select
                  {...field}
                  multiple
                  labelId="tipos-pessoa-label"
                  label="Tipo de Pessoa"
                  value={field.value ?? []}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      {(selected as number[]).map((tipoId) => {
                        const tipo = tiposPessoa.find((item) => item.id === tipoId);

                        return tipo ? <Chip key={tipo.id} label={tipo.nome} size="small" /> : null;
                      })}
                    </Box>
                  )}
                  onChange={(event) => {
                    const value = event.target.value;

                    field.onChange(
                      typeof value === 'string' ? value.split(',').map(Number) : value,
                    );
                  }}
                >
                  {tiposPessoa
                    .filter((tipo) => tipo.ativo !== false)
                    .map((tipo) => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        <Checkbox checked={field.value?.includes(tipo.id) ?? false} />

                        <ListItemText primary={tipo.nome} />
                      </MenuItem>
                    ))}
                </Select>

                <FormHelperText>{errors.tiposPessoaIds?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="tipoDocumento"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                required
                disabled={isSubmitting}
                error={!!errors.tipoDocumento}
              >
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="observacao"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Observação"
                fullWidth
                multiline
                minRows={3}
                disabled={isSubmitting}
              />
            )}
          />

          {isEditing && (
            <Controller
              name="ativo"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth disabled={isSubmitting}>
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
