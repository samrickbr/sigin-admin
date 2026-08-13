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
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateUsuario, useUsuario, useUpdateUsuario } from '../hooks/useUsuarios';

import { usePessoas } from '../../pessoas/hooks/usePessoas';

import { Loading } from '../../../components/common/Loading/Loading';
import { Feedback } from '../../../components/common/Feedback/Feedback';

const usuarioSchema = z
  .object({
    pessoaId: z.number().positive('Selecione uma pessoa.'),
    login: z.string().min(1, 'Login é obrigatório.'),
    senha: z.string(),
    confirmarSenha: z.string(),
    ativo: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // No cadastro, senha e confirmação são obrigatórias.
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

type UsuarioFormData = z.infer<typeof usuarioSchema>;

export default function UsuarioFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const usuarioId = id ? Number(id) : undefined;
  const isEditing = !!usuarioId;

  const {
    data: usuario,
    isLoading: isLoadingUsuario,
    isError: isUsuarioError,
  } = useUsuario(usuarioId);

  const { data: pessoas, isLoading: isLoadingPessoas } = usePessoas();

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
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      pessoaId: 0,
      login: '',
      senha: '',
      confirmarSenha: '',
      ativo: true,
    },
  });

  useEffect(() => {
    if (!usuario) {
      return;
    }

    reset({
      pessoaId: usuario.pessoaId,
      login: usuario.login,
      senha: '',
      confirmarSenha: '',
      ativo: usuario.ativo,
    });
  }, [usuario, reset]);

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      if (isEditing && usuarioId) {
        await updateUsuario.mutateAsync({
          id: usuarioId,
          data: {
            pessoaId: usuario!.pessoaId,
            login: usuario!.login,
            senha: data.senha,
            ativo: data.ativo,
          },
        });

        setFeedback({
          message: 'Usuário atualizado com sucesso.',
          severity: 'success',
        });
      } else {
        await createUsuario.mutateAsync({
          pessoaId: data.pessoaId,
          login: data.login,
          senha: data.senha,
          ativo: data.ativo,
        });

        setFeedback({
          message: 'Usuário cadastrado com sucesso.',
          severity: 'success',
        });
      }

      setTimeout(() => {
        navigate('/usuarios');
      }, 500);
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;

      let message = isEditing
        ? 'Não foi possível atualizar o usuário.'
        : 'Não foi possível cadastrar o usuário.';

      if (!isEditing && status === 409) {
        message = 'A pessoa selecionada já possui um usuário.';
      }

      if (status === 400) {
        message = 'Os dados informados são inválidos.';
      }

      if (status === 403) {
        message = 'Você não possui permissão para realizar esta operação.';
      }

      setFeedback({
        message,
        severity: 'error',
      });
    }
  };

  if (isLoadingUsuario || isLoadingPessoas) {
    return <Loading />;
  }

  if (isEditing && isUsuarioError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Não foi possível carregar os dados do usuário.</Alert>

        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/usuarios')}>
          Voltar
        </Button>
      </Box>
    );
  }

  const isSubmitting = createUsuario.isPending || updateUsuario.isPending;

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {isEditing
            ? 'Atualize a senha ou o status do usuário.'
            : 'Cadastre um novo usuário vinculado a uma pessoa.'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
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

                {pessoas
                  ?.filter((pessoa) => pessoa.ativo)
                  .map((pessoa) => (
                    <MenuItem key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} — {pessoa.documento}
                    </MenuItem>
                  ))}
              </TextField>
            )}
          />

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
                helperText={
                  errors.login?.message ??
                  (isEditing ? 'O login do usuário não pode ser alterado.' : undefined)
                }
              />
            )}
          />

          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={isEditing ? 'Nova Senha' : 'Senha'}
                type="password"
                fullWidth
                required={!isEditing}
                error={!!errors.senha}
                helperText={
                  errors.senha?.message ??
                  (isEditing ? 'Deixe em branco para manter a senha atual.' : undefined)
                }
              />
            )}
          />

          <Controller
            name="confirmarSenha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirmar Senha"
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
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  }
                  label="Usuário ativo"
                />
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
            <Button
              variant="outlined"
              onClick={() => navigate('/usuarios')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
