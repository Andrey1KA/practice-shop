import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { formatPrice } from '../../utils/formatPrice';

export function Cart() {
  const { items, totalPrice, clear } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <Typography variant="h4" component="h1" gutterBottom>
          Корзина пуста
        </Typography>
        <Button component={RouterLink} to="/">
          Перейти в каталог
        </Button>
      </section>
    );
  }

  return (
    <section>
      <Typography variant="h4" component="h1" gutterBottom>
        Корзина
      </Typography>
      <Box sx={{ my: 2 }}>
        {items.map((item) => (
          <CartItemRow key={item.product.id} item={item} />
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6">Итого: {formatPrice(totalPrice)}</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={clear}>
            Очистить корзину
          </Button>
          <Button variant="contained">Оформить заказ</Button>
        </Stack>
      </Box>
    </section>
  );
}
