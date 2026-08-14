import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { Loading } from '../../../components/common/Loading/Loading';

import { useMateriais } from '../../materiais/hooks/useMateriais';
import {
  useCreateProdutoMaterial,
  useDeleteProdutoMaterial,
  useProdutoMateriais,
  useUpdateProdutoMaterial,
} from '../hooks/useProdutoMateriais';

import type { ProdutoMaterialResponse } from '../types/produtoMateriais';

const quantidadeSchema = z.object({
  materialId: z.number().int().positive('Selecione um material.'),
  quantidade: z
    .number({
      message: 'Informe uma quantidade válida.',
    })
    .min(0.001, 'A quantidade mínima é 0,001.'),
});

type ProdutoMaterialFormData = z.infer<typeof quantidadeSchema>;

interface ProdutoMateriaisSectionProps {
  produtoId: number;
}

export function ProdutoMateriaisSection({ produtoId }: ProdutoMateriaisSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProdutoMaterialResponse | null>(null);
  const [removing, setRemoving] = useState<ProdutoMaterialResponse | null>(null);
  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'error';
    message: string;
  } | null>(null);

  const produtoMateriaisQuery = useProdutoMateriais(produtoId);
  const materiaisQuery = useMateriais();

  const createMutation = useCreateProdutoMaterial(produtoId);
  const updateMutation = useUpdateProdutoMaterial(produtoId);
  const deleteMutation = useDeleteProdutoMaterial(produtoId);

  const form = useForm<ProdutoMaterialFormData>({
    resolver: zodResolver(quantidadeSchema),
    defaultValues: {
      materialId: 0,
      quantidade: 0,
    },
  });

  const produtoMateriais = useMemo(
    () => (produtoMateriaisQuery.data ?? []).filter((item) => item.ativo),
    [produtoMateriaisQuery.data],
  );

  const materiaisDisponiveis = useMemo(() => {
    const vinculados = new Set(produtoMateriais.map((item) => item.materialId));

    return (materiaisQuery.data ?? []).filter(
      (material) => material.ativo && !vinculados.has(material.id),
    );
  }, [materiaisQuery.data, produtoMateriais]);

  const abrirAdicionar = () => {
    setFeedback(null);
    setEditing(null);

    form.reset({
      materialId: 0,
      quantidade: 0,
    });

    setDialogOpen(true);
  };

  const abrirEditar = (produtoMaterial: ProdutoMaterialResponse) => {
    setFeedback(null);
    setEditing(produtoMaterial);

    form.reset({
      materialId: produtoMaterial.materialId,
      quantidade: Number(produtoMaterial.quantidade),
    });

    setDialogOpen(true);
  };

  const fecharDialog = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setDialogOpen(false);
    setEditing(null);
    form.reset();
  };

  const extrairMensagemErro = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
        }
      ).response;

      return response?.data?.message ?? response?.data?.error ?? fallback;
    }

    return fallback;
  };

  const onSubmit = async (data: ProdutoMaterialFormData) => {
    setFeedback(null);

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          data: {
            quantidade: data.quantidade,
          },
        });

        setDialogOpen(false);
        setEditing(null);
        form.reset();

        setFeedback({
          severity: 'success',
          message: 'Material atualizado com sucesso.',
        });

        return;
      }

      await createMutation.mutateAsync({
        produtoId,
        materialId: data.materialId,
        quantidade: data.quantidade,
      });

      setDialogOpen(false);
      setEditing(null);
      form.reset();

      setFeedback({
        severity: 'success',
        message: 'Material adicionado com sucesso.',
      });
    } catch (error) {
      setFeedback({
        severity: 'error',
        message: extrairMensagemErro(
          error,
          editing
            ? 'Não foi possível atualizar o material.'
            : 'Não foi possível adicionar o material.',
        ),
      });
    }
  };

  const confirmarRemocao = async () => {
    if (!removing) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(removing.id);

      setRemoving(null);

      setFeedback({
        severity: 'success',
        message: 'Material removido com sucesso.',
      });
    } catch (error) {
      setFeedback({
        severity: 'error',
        message: extrairMensagemErro(error, 'Não foi possível remover o material.'),
      });
    }
  };

  const carregando = produtoMateriaisQuery.isLoading || materiaisQuery.isLoading;

  if (carregando) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Materiais utilizados
        </Typography>

        <Loading />
      </Box>
    );
  }

  if (produtoMateriaisQuery.isError || materiaisQuery.isError) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Materiais utilizados
        </Typography>

        <Feedback severity="error" message="Não foi possível carregar os materiais do produto." />
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6">Materiais utilizados</Typography>

          <Typography variant="body2" color="text.secondary">
            Materiais vinculados ao produto e suas respectivas quantidades.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirAdicionar}>
          Adicionar Material
        </Button>
      </Stack>

      {feedback && (
        <Box sx={{ mb: 2 }}>
          <Alert severity={feedback.severity}>{feedback.message}</Alert>
        </Box>
      )}

      {produtoMateriais.length === 0 ? (
        <EmptyState message="Este produto ainda não possui materiais vinculados." />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Situação</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {produtoMateriais.map((produtoMaterial) => (
                <TableRow key={produtoMaterial.id}>
                  <TableCell>{produtoMaterial.material}</TableCell>

                  <TableCell>
                    {Number(produtoMaterial.quantidade).toLocaleString('pt-BR', {
                      minimumFractionDigits: 3,
                    })}
                  </TableCell>

                  <TableCell>
                    <Chip label="Ativo" color="success" size="small" />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <IconButton
                        aria-label="Editar material"
                        onClick={() => abrirEditar(produtoMaterial)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="Remover material"
                        onClick={() => setRemoving(produtoMaterial)}
                        disabled={deleteMutation.isPending}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={fecharDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar material' : 'Adicionar material'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Controller
              name="materialId"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Material"
                  disabled={!!editing}
                  value={field.value || ''}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="">Selecione um material</MenuItem>

                  {materiaisDisponiveis.map((material) => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.codigo} — {material.nome}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="quantidade"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Quantidade"
                  slotProps={{
                    htmlInput: {
                      min: 0.001,
                      step: 0.001,
                    },
                  }}
                  value={field.value || ''}
                  onChange={(event) =>
                    field.onChange(event.target.value === '' ? 0 : Number(event.target.value))
                  }
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? 'Quantidade mínima: 0,001.'}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={fecharDialog}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editing ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!removing}
        title="Remover material"
        message={
          removing
            ? `Deseja remover o material "${removing.material}" deste produto?`
            : 'Deseja remover este material?'
        }
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setRemoving(null);
          }
        }}
        onConfirm={confirmarRemocao}
      />
    </Box>
  );
}
