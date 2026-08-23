import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

type PessoaData = {
  nome: string;
  tipoDocumento: string;
  documento: string;
  telefone?: string | null;
  email?: string | null;
  ativo: boolean;
  observacao?: string | null;
};

type PessoaInfoItemProps = {
  label: string;
  children: React.ReactNode;
};

function PessoaInfoItem({ label, children }: PessoaInfoItemProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography>{children}</Typography>
    </Box>
  );
}

type PessoaDataSectionProps = {
  pessoa: PessoaData;
};

export function PessoaDataSection({ pessoa }: PessoaDataSectionProps) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dados da pessoa
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 2,
        }}
      >
        <PessoaInfoItem label="Nome">{pessoa.nome}</PessoaInfoItem>

        <PessoaInfoItem label="Documento">
          {pessoa.tipoDocumento}: {pessoa.documento}
        </PessoaInfoItem>

        <PessoaInfoItem label="Telefone">{pessoa.telefone || '-'}</PessoaInfoItem>

        <PessoaInfoItem label="E-mail">{pessoa.email || '-'}</PessoaInfoItem>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>

          <Box sx={{ mt: 0.5 }}>
            <Chip label={pessoa.ativo ? 'Ativo' : 'Inativo'} size="small" />
          </Box>
        </Box>
      </Box>

      {pessoa.observacao && (
        <>
          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Observação
          </Typography>

          <Typography>{pessoa.observacao}</Typography>
        </>
      )}
    </Paper>
  );
}
