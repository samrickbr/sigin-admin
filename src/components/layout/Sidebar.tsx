import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

import { usePermission } from '../../auth/hooks/usePermission';

export function Sidebar() {
  const { hasPermission } = usePermission();

  return (
    <List>
      {hasPermission('DASHBOARD') && (
        <ListItem disablePadding>
          <ListItemButton
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
      )}

      {hasPermission('USUARIOS') && (
        <ListItem disablePadding>
          <ListItemButton
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
      )}

      {hasPermission('PRODUTOS') && (
        <ListItem disablePadding>
          <ListItemButton
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
    </List>
  );
}
