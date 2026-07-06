import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export function Header() {
  const { totalCount } = useCart();

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'action.hover',
            color: 'action.active',
          }}
        >
          <ImageOutlinedIcon fontSize="small" />
        </Box>
        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/" startIcon={<StorefrontIcon />}>
            Каталог
          </Button>
          <Button
            component={RouterLink}
            to="/cart"
            startIcon={
              <Badge badgeContent={totalCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            }
          >
            Корзина
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
