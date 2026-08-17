import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateUsuario, useUsuario, useUpdateUsuario } from '../hooks/useUsuarios';
import { UsuarioPerfisSection } from '../components/UsuarioPerfisSection';
import { usePessoa, usePessoas } from '../../pessoas/hooks/usePessoas';
import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const usuarioFieldsSchema = z.object({
  pessoaId: z.number().positive('Selecione uma pessoa.'),
  login: z.string().min(1, 'Login é obrigatório.'),
  senha: z.string(),
  confirmarSenha: z.string(),
  ativo: z.boolean(),
});

function createUsuarioSchema(isEditing: boolean) {
  return usuarioFieldsSchema.superRefine((data, ctx) => {
    // Na edição, campos vazios mantêm a senha atual.
    if (isEditing && !data.senha && !data.confirmarSenha) {
      return;
    }

    if (!data.senha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Senha é obrigatória.',
        path: ['senha'],
      });
    }

    if (!data.confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Confirmação de senha é obrigatória.',
        path: ['confirmarSenha'],
      });
    }

    if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não conferem.',
        path: ['confirmarSenha'],
      });
    }
  });
}

type UsuarioFormData = z.infer<typeof usuarioFieldsSchema>;

export default function UsuarioFormPage() {
  const navigate = useNavigate();
  const { id, pessoaId } = useParams<{ id: string; pessoaId: string }>();

  const usuarioId = id ? Number(id) : undefined;
  const isEditing = !!usuarioId;
  const contextualPessoaId = pessoaId ? Number(pessoaId) : undefined;
  const isContextual =
    contextualPessoaId !== undefined && Number.isInteger(contextualPessoaId) && contextualPessoaId > 0;
  const returnPath = isContextual ? `/pessoas/${contextualPessoaId}` : '/usuarios';

  const usuarioQuery = useUsuario(usuarioId);
  const pessoaQuery = usePessoa(isContextual ? contextualPessoaId : undefined);
  const pessoasQuery = usePessoas(!isContextual);

  const createUsuario = useCreateUsuario();
  const updateUsuario = useUpdateUsuario();

  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(createUsuarioSchema(isEditing)),
    defaultValues: {
      pessoaId: 0,
      login: '',
      senha: '',
      confirmarSenha: '',
      ativo: true,
    },
  });

  useEffect(() => {
    if (usuarioQuery.data) {
      reset({
        pessoaId: usuarioQuery.data.pessoaId,
        login: usuarioQuery.data.login,
        senha: '',
        confirmarSenha: '',
        ativo: usuarioQuery.data.ativo,
      });
      return;
    }

    if (isContextual && contextualPessoaId !== undefined) {
      reset({
        pessoaId: contextualPessoaId,
        login: '',
        senha: '',
        confirmarSenha: '',
        ativo: true,
      });
    }
  }, [contextualPessoaId, isContextual, reset, usuarioQuery.data]);

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      if (isEditing && usuarioId) {
        await updateUsuario.mutateAsync({
          id: usuarioId,
          data: {
            pessoaId: usuarioQuery.data!.pessoaId,
            login: usuarioQuery.data!.login,
            senha: data.senha,
            ativo: data.ativo,
          },
        });

        setFeedback({ message: 'Usuário atualizado com sucesso.', severity: 'success' });
      } else {
        await createUsuario.mutateAsync({
          pessoaId: isContextual ? contextualPessoaId! : data.pessoaId,
          login: data.login,
          senha: data.senha,
          ativo: data.ativo,
        });

        setFeedback({ message: 'Usuário cadastrado com sucesso.', severity: 'success' });
      }

      setTimeout(() => navigate(returnPath), 500);
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const apiMessage = axios.isAxiosError(error) ? error.response?.data?.mensagem : undefined;

      let message = isEditing
        ? 'Não foi possível atualizar o usuário.'
        : 'Não foi possível cadastrar o usuário.';

      if (apiMessage) {
        message = apiMessage;
      } else if (status === 400) {
        message = 'Os dados informados são inválidos.';
      } else if (status === 403) {
        message = 'Você não possui permissão para realizar esta operação.';
      } else if (status === 409) {
        message = 'Não foi possível concluir a operação.';
      }

      setFeedback({ message, severity: 'error' });
    }
  };

  if (
    usuarioQuery.isLoading ||
    (!isContextual && pessoasQuery.isLoading) ||
    (isContextual && pessoaQuery.isLoading)
  ) {
    return <Loading />;
  }

  if (isContextual && (pessoaQuery.isError || !pessoaQuery.data)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Não foi possível carregar os dados da pessoa.</Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/pessoas')}>
          Voltar
        </Button>
      </Box>
    );
  }

  if (isEditing && usuarioQuery.isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Não foi possível carregar os dados do usuário.</Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(returnPath)}>
          Voltar
        </Button>
      </Box>
    );
  }

  const isSubmitting = createUsuario.isPending || updateUsuario.isPending;
  const title = isContextual && !isEditing ? 'Criar acesso ao sistema' : isEditing ? 'Editar Usuário' : 'Novo Usuário';
  const description = isContextual && !isEditing
    ? 'Crie as credenciais de acesso para esta pessoa.'
    : isEditing
      ? 'Atualize a senha ou o status do usuário.'
      : 'Cadastre um novo usuário vinculado a uma pessoa.';

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          {isContextual && pessoaQuery.data ? (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Pessoa
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {pessoaQuery.data.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {pessoaQuery.data.tipoDocumento}: {pessoaQuery.data.documento} ·{' '}
                {pessoaQuery.data.ativo ? 'Ativa' : 'Inativa'}
              </Typography>
            </Paper>
          ) : (
            <Controller
              name="pessoaId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ''}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  select
                  label="Pessoa"
                  fullWidth
                  required
                  disabled={isEditing}
                  error={!!errors.pessoaId}
                  helperText={
                    errors.pessoaId?.message ??
                    (isEditing ? 'A pessoa vinculada não pode ser alterada.' : undefined)
                  }
                >
                  <MenuItem value="">Selecione uma pessoa</MenuItem>
                  {pessoasQuery.data
                    ?.filter((pessoa) => pessoa.ativo)
                    .map((pessoa) => (
                      <MenuItem key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome} — {pessoa.documento}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
          )}

          <Controller
            name="login"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Login"
                fullWidth
                required
                disabled={isEditing}
                error={!!errors.login}
                helperText={errors.login?.message ?? (isEditing ? 'O login não pode ser alterado.' : undefined)}
              />
            )}
          />

          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={isEditing ? 'Nova senha' : 'Senha'}
                type="password"
                fullWidth
                required={!isEditing}
                error={!!errors.senha}
                helperText={errors.senha?.message ?? (isEditing ? 'Deixe em branco para manter a senha atual.' : undefined)}
              />
            )}
          />

          <Controller
            name="confirmarSenha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirmar senha"
                type="password"
                fullWidth
                required={!isEditing}
                error={!!errors.confirmarSenha}
                helperText={errors.confirmarSenha?.message}
              />
            )}
          />

          {isEditing && (
            <Controller
              name="ativo"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />}
                  label="Usuário ativo"
                />
              )}
            />
          )}

          {isEditing && usuarioId && usuarioQuery.data && (
            <UsuarioPerfisSection usuarioId={usuarioId} usuarioLogin={usuarioQuery.data.login} />
          )}

          {feedback && <Feedback message={feedback.message} severity={feedback.severity} />}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
            <Button variant="outlined" onClick={() => navigate(returnPath)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar usuário'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
