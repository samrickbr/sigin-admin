import { useEffect } from 'react';

import { enderecoDefaultValues, enderecoSchema, type EnderecoFormData } from './pessoaEnderecoForm';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { PessoaEnderecoResponse } from '../types/pessoaEndereco';
import { useCep, useEstados } from '../hooks/usePessoaEnderecos';

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
    control,
    setValue,
    formState: { errors },
  } = useForm<EnderecoFormData>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: enderecoDefaultValues,
  });

  const cep = useWatch({
    control,
    name: 'cep',
  });

  const normalizedCep = (cep ?? '').replace(/\D/g, '');

  const { data: cepData, isFetching: isConsultingCep, isError: isCepError } = useCep(cep ?? '');

  const { data: estados = [], isLoading: isLoadingEstados } = useEstados();

  useEffect(() => {
    if (!open) {
      reset(enderecoDefaultValues);
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

  useEffect(() => {
    if (!open || endereco || normalizedCep.length !== 8 || !cepData || cepData.erro) {
      return;
    }

    setValue('logradouro', cepData.logradouro ?? '');
    setValue('complemento', cepData.complemento ?? '');
    setValue('bairro', cepData.bairro ?? '');
    setValue('cidade', cepData.localidade ?? '');
    setValue('uf', cepData.uf ?? '');
  }, [open, endereco, normalizedCep, cepData, setValue]);

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{endereco ? 'Editar endereço' : 'Novo endereço'}</DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              {...register('cep')}
              label="CEP"
              fullWidth
              required
              disabled={isSubmitting}
              error={!!errors.cep || isCepError}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  maxLength: 8,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  onInput: (event: React.FormEvent<HTMLInputElement>) => {
                    event.currentTarget.value = event.currentTarget.value
                      .replace(/\D/g, '')
                      .slice(0, 8);
                  },
                },
              }}
            />
            {isConsultingCep && (
              <Typography variant="caption" color="text.secondary">
                Consultando CEP...
              </Typography>
            )}
            {isCepError && normalizedCep.length === 8 && (
              <Typography variant="caption" color="error">
                CEP não encontrado.
              </Typography>
            )}

            <TextField
              {...register('logradouro')}
              label="Logradouro"
              fullWidth
              required
              disabled={isSubmitting}
              error={!!errors.logradouro}
              helperText={errors.logradouro?.message || undefined}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              {...register('numero')}
              label="Número"
              fullWidth
              required
              disabled={isSubmitting}
              error={!!errors.numero}
              slotProps={{
                htmlInput: {
                  maxLength: 20,
                },
              }}
            />

            <TextField
              {...register('complemento')}
              label="Complemento"
              fullWidth
              disabled={isSubmitting}
              error={!!errors.complemento}
              helperText={errors.complemento?.message || undefined}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              {...register('bairro')}
              label="Bairro"
              fullWidth
              required
              disabled={isSubmitting}
              error={!!errors.bairro}
              helperText={errors.bairro?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              {...register('cidade')}
              label="Cidade"
              fullWidth
              required
              disabled={isSubmitting}
              error={!!errors.cidade}
              helperText={errors.cidade?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <FormControl
              fullWidth
              required
              disabled={isSubmitting || isLoadingEstados}
              error={!!errors.uf}
            >
              <InputLabel id="pessoa-endereco-uf-label">UF</InputLabel>

              <Controller
                name="uf"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="pessoa-endereco-uf-label" label="UF">
                    {estados.map((estado) => (
                      <MenuItem key={estado.sigla} value={estado.sigla}>
                        {estado.sigla} - {estado.nome}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />

              <FormHelperText>{errors.uf?.message}</FormHelperText>
            </FormControl>
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
