import { Box, Button, Chip, Paper, Typography } from '@mui/material';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

import type { PessoaEnderecoResponse } from '../types/pessoaEndereco';

type PessoaEnderecoCardProps = {
  endereco: PessoaEnderecoResponse;
  onDefinirPrincipal: (endereco: PessoaEnderecoResponse) => void;
  onEditar: (endereco: PessoaEnderecoResponse) => void;
  onExcluir: (endereco: PessoaEnderecoResponse) => void;
  disabledDefinirPrincipal: boolean;
  disabledExcluir: boolean;
};

export function PessoaEnderecoCard({
  endereco,
  onDefinirPrincipal,
  onEditar,
  onExcluir,
  disabledDefinirPrincipal,
  disabledExcluir,
}: PessoaEnderecoCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
              flexWrap: 'wrap',
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {endereco.logradouro}, {endereco.numero}
            </Typography>

            {endereco.principal && (
              <Chip label="Principal" size="small" icon={<StarOutlinedIcon />} />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            {endereco.bairro} — {endereco.cidade}/{endereco.uf}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            CEP: {endereco.cep}
          </Typography>

          {endereco.complemento && (
            <Typography variant="body2" color="text.secondary">
              Complemento: {endereco.complemento}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {!endereco.principal && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<StarBorderOutlinedIcon />}
              onClick={() => onDefinirPrincipal(endereco)}
              disabled={disabledDefinirPrincipal}
            >
              Definir principal
            </Button>
          )}

          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEditar(endereco)}
          >
            Editar
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => onExcluir(endereco)}
            disabled={disabledExcluir}
          >
            Excluir
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
