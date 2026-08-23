import { Box, Button, Chip, Paper, Typography } from '@mui/material';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { Feedback, Loading } from '../../../components/common';

import { useUsuarioDaPessoa } from '../../usuarios/hooks/useUsuarios';
import { useUsuarioPerfis } from '../../usuarios/hooks/useUsuarioPerfis';

type PessoaAcessoSistemaProps = {
  pessoaId: number;
  onGerenciarAcesso: (usuarioId: number) => void;
  onCriarAcesso: () => void;
};

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>

      <Box>{children}</Box>
    </Box>
  );
}

export function PessoaAcessoSistema({
  pessoaId,
  onGerenciarAcesso,
  onCriarAcesso,
}: PessoaAcessoSistemaProps) {
  const usuarioQuery = useUsuarioDaPessoa(pessoaId);
  const usuario = usuarioQuery.data;

  const usuarioPerfisQuery = useUsuarioPerfis(usuario?.id);

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h6">Acesso ao sistema</Typography>

          <Typography variant="body2" color="text.secondary">
            Usuário vinculado a esta pessoa.
          </Typography>
        </Box>
      </Box>

      {usuarioQuery.isLoading ? (
        <Loading />
      ) : usuarioQuery.isError ? (
        <Feedback message="Não foi possível carregar o acesso desta pessoa." severity="error" />
      ) : usuario ? (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr',
              },
              gap: 2,
              mb: 2,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                minWidth: 0,
              }}
            >
              <InfoBlock title="Usuário">
                <Typography sx={{ fontWeight: 600 }}>{usuario.login}</Typography>

                <Box sx={{ mt: 0.75 }}>
                  <Chip label={usuario.ativo ? 'Ativo' : 'Inativo'} size="small" />
                </Box>
              </InfoBlock>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                minWidth: 0,
              }}
            >
              <InfoBlock title="Perfil">
                {usuarioPerfisQuery.isLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Carregando...
                  </Typography>
                ) : usuarioPerfisQuery.isError ? (
                  <Typography variant="body2" color="error">
                    Não foi possível carregar o perfil.
                  </Typography>
                ) : usuarioPerfisQuery.data?.length ? (
                  <Box>
                    {usuarioPerfisQuery.data.map((perfil) => (
                      <Box
                        key={perfil.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography sx={{ fontWeight: 500 }}>{perfil.nome}</Typography>

                        {!perfil.ativo && <Chip label="Inativo" size="small" />}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">Nenhum perfil vinculado.</Typography>
                )}
              </InfoBlock>
            </Paper>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => onGerenciarAcesso(usuario.id)}
            >
              Gerenciar acesso
            </Button>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography color="text.secondary">
            Esta pessoa ainda não possui acesso ao sistema.
          </Typography>

          <Button variant="contained" onClick={onCriarAcesso}>
            Criar acesso ao sistema
          </Button>
        </Box>
      )}
    </Paper>
  );
}
