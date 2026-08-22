import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  DashboardOutlined,
  PeopleOutlined,
  PersonOutlined,
  SecurityOutlined,
  LockOutlined,
  Inventory2Outlined,
  CategoryOutlined,
  PointOfSaleOutlined,
  ReceiptLongOutlined,
  BuildOutlined,
  LocationOnOutlined,
  PaymentsOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const menuGroups = [
  {
    label: 'Visão geral',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: DashboardOutlined,
      },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      {
        label: 'Pessoas',
        path: '/pessoas',
        icon: PeopleOutlined,
      },
      {
        label: 'Usuários',
        path: '/usuarios',
        icon: PersonOutlined,
      },
      {
        label: 'Perfis',
        path: '/perfis',
        icon: SecurityOutlined,
      },
      {
        label: 'Permissões',
        path: '/permissoes',
        icon: LockOutlined,
      },
      {
        label: 'Formas de Pagamento',
        path: '/formas-pagamento',
        icon: PaymentsOutlined,
      },
      {
        label: 'Produtos',
        path: '/produtos',
        icon: Inventory2Outlined,
      },
      {
        label: 'Categorias',
        path: '/categorias',
        icon: CategoryOutlined,
      },
      {
        label: 'Canais de Venda',
        path: '/canais-venda',
        icon: PointOfSaleOutlined,
      },
      {
        label: 'Materiais',
        path: '/materiais',
        icon: BuildOutlined,
      },
      {
        label: 'Locais',
        path: '/locais',
        icon: LocationOnOutlined,
      },
    ],
  },
  {
    label: 'Operação',
    items: [
      {
        label: 'Pedidos',
        path: '/pedidos',
        icon: ReceiptLongOutlined,
      },
    ],
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        height: '100%',
        px: 1.5,
        py: 2,
        overflowY: 'auto',
      }}
    >
      {menuGroups.map((group) => {
        const visibleItems = group.items.filter((item) => {
          if (item.path === '/produtos') {
            return true;
          }

          return true;
        });

        if (visibleItems.length === 0) {
          return null;
        }

        return (
          <Box key={group.label} sx={{ mb: 2 }}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                px: 1.5,
                mb: 0.75,
                fontWeight: 700,
                letterSpacing: 1,
                color: 'text.secondary',
              }}
            >
              {group.label}
            </Typography>

            <List disablePadding>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname.startsWith(item.path);

                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={active}
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 44,
                        borderRadius: 2,
                        px: 1.5,
                        '&.Mui-selected': {
                          bgcolor: 'action.selected',
                          color: 'primary.main',
                        },
                        '&.Mui-selected:hover': {
                          bgcolor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: 'inherit',
                        }}
                      >
                        <Icon fontSize="small" />
                      </ListItemIcon>

                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontWeight: active ? 600 : 500,
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        );
      })}
    </Box>
  );
}
