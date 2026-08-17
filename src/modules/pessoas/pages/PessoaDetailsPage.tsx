import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { EmptyState, Loading } from '../../../components/common';
import { usePessoa } from '../hooks/usePessoas';
import { useUsuarioDaPessoa } from '../../usuarios/hooks/useUsuarios';
import { useUsuarioPerfis } from '../../usuarios/hooks/useUsuarioPerfis';

export function PessoaDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pessoaId = id ? Number(id) : undefined;

  const pessoaQuery = usePessoa(pessoaId);
  const usuarioQuery = useUsuarioDaPessoa(pessoaId);

  const usuarioPerfisQuery = useUsuarioPerfis(usuarioQuery.data?.id);

  if (pessoaQuery.isLoading) {
    return <Loading />;
  }

  if (!pessoaQuery.data || pessoaQuery.isError) {
    return <EmptyState message="Pessoa não encontrada." />;
  }

  const pessoa = pessoaQuery.data;
  const usuario = usuarioQuery.data;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5">Pessoa</Typography>
          <Typography variant="body2" color="text.secondary">
            Visualização dos dados e acesso ao sistema.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate('/pessoas')}
          >
            Voltar
          </Button>

          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/pessoas/${pessoa.id}/editar`)}
          >
            Editar
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dados da pessoa
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Nome
            </Typography>
            <Typography>{pessoa.nome}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Documento
            </Typography>
            <Typography>
              {pessoa.tipoDocumento}: {pessoa.documento}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Telefone
            </Typography>
            <Typography>{pessoa.telefone || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              E-mail
            </Typography>
            <Typography>{pessoa.email || '-'}</Typography>
          </Box>

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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Acesso ao sistema
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Usuário vinculado a esta pessoa.
        </Typography>

        {usuarioQuery.isLoading ? (
          <Loading />
        ) : usuario ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box>
              <Typography>{usuario.login}</Typography>

              <Chip label={usuario.ativo ? 'Ativo' : 'Inativo'} size="small" sx={{ mt: 0.5 }} />

              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Perfil
                </Typography>

                {usuarioPerfisQuery.isLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Carregando...
                  </Typography>
                ) : usuarioPerfisQuery.isError ? (
                  <Typography variant="body2" color="error">
                    Não foi possível carregar o perfil.
                  </Typography>
                ) : usuarioPerfisQuery.data?.length ? (
                  <Box sx={{ mt: 0.5 }}>
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
                        <Typography>{perfil.nome}</Typography>

                        {!perfil.ativo && <Chip label="Inativo" size="small" />}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">Nenhum perfil vinculado.</Typography>
                )}
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => navigate(`/pessoas/${pessoa.id}/usuario/${usuario.id}`)}
            >
              Gerenciar acesso
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography color="text.secondary">
              Esta pessoa ainda não possui acesso ao sistema.
            </Typography>

            <Button
              variant="contained"
              startIcon={<PersonAddOutlinedIcon />}
              onClick={() => navigate(`/pessoas/${pessoa.id}/usuario/novo`)}
            >
              Criar acesso ao sistema
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
