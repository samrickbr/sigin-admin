import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../auth/hooks/usePermission';

export function Sidebar() {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => navigate('/dashboard')}
          sx={{
            py: 0.5,
            justifyContent: 'flex-start',
          }}
        >
          <ListItemText
            primary="Dashboard"
            sx={{
              textAlign: 'left',
            }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => navigate('/pessoas')}
          sx={{
            py: 0.5,
            justifyContent: 'flex-start',
          }}
        >
          <ListItemText
            primary="Pessoas"
            sx={{
              textAlign: 'left',
            }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => navigate('/usuarios')}
          sx={{
            py: 0.5,
            justifyContent: 'flex-start',
          }}
        >
          <ListItemText
            primary="Usuários"
            sx={{
              textAlign: 'left',
            }}
          />
        </ListItemButton>
      </ListItem>

      {hasPermission('PRODUTO_VISUALIZAR') && (
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/produtos')}
            sx={{
              py: 0.5,
              justifyContent: 'flex-start',
            }}
          >
            <ListItemText
              primary="Produtos"
              sx={{
                textAlign: 'left',
              }}
            />
          </ListItemButton>
        </ListItem>
      )}

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => navigate('/categorias')}
          sx={{
            py: 0.5,
            justifyContent: 'flex-start',
          }}
        >
          <ListItemText
            primary="Categorias"
            sx={{
              textAlign: 'left',
            }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          onClick={() => navigate('/canais-venda')}
          sx={{
            py: 0.5,
            justifyContent: 'flex-start',
          }}
        >
          <ListItemText
            primary="Canais de Venda"
            sx={{
              textAlign: 'left',
            }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
