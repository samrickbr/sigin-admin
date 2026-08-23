import { useEffect } from 'react';
import { enderecoDefaultValues, enderecoSchema, type EnderecoFormData } from './pessoaEnderecoForm';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { PessoaEnderecoResponse } from '../types/pessoaEndereco';

type PessoaEnderecoDialogProps = {
  open: boolean;
  endereco: PessoaEnderecoResponse | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: EnderecoFormData) => Promise<void>;
};

export function PessoaEnderecoDialog({
  open,
  endereco,
  isSubmitting,
  onClose,
  onSubmit,
}: PessoaEnderecoDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnderecoFormData>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: enderecoDefaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (endereco) {
      reset({
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento ?? '',
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        uf: endereco.uf,
        principal: endereco.principal,
      });

      return;
    }

    reset(enderecoDefaultValues);
  }, [open, endereco, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{endereco ? 'Editar endereço' : 'Novo endereço'}</DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              {...register('cep')}
              label="CEP"
              fullWidth
              required
              error={!!errors.cep}
              helperText={errors.cep?.message}
            />

            <TextField
              {...register('logradouro')}
              label="Logradouro"
              fullWidth
              required
              error={!!errors.logradouro}
              helperText={errors.logradouro?.message}
            />

            <TextField
              {...register('numero')}
              label="Número"
              fullWidth
              required
              error={!!errors.numero}
              helperText={errors.numero?.message}
            />

            <TextField
              {...register('complemento')}
              label="Complemento"
              fullWidth
              error={!!errors.complemento}
              helperText={errors.complemento?.message}
            />

            <TextField
              {...register('bairro')}
              label="Bairro"
              fullWidth
              required
              error={!!errors.bairro}
              helperText={errors.bairro?.message}
            />

            <TextField
              {...register('cidade')}
              label="Cidade"
              fullWidth
              required
              error={!!errors.cidade}
              helperText={errors.cidade?.message}
            />

            <TextField
              {...register('uf')}
              label="UF"
              fullWidth
              required
              slotProps={{
                htmlInput: {
                  maxLength: 2,
                },
              }}
              error={!!errors.uf}
              helperText={errors.uf?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : endereco ? 'Salvar alterações' : 'Cadastrar endereço'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
