import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import type { CartItem } from '../../types/cart';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { ProductImagePlaceholder } from '../product/ProductImagePlaceholder';

export function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem } = useCart();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
        <ProductImagePlaceholder sx={{ width: 56, height: 56, borderRadius: 1, flexShrink: 0 }} iconSize={24} />
        <Box sx={{ flex: 1 }}>
          <Typography>{item.product.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {item.quantity} × {formatPrice(item.product.price)}
          </Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={() => removeItem(item.product.id)}>
          Удалить
        </Button>
      </Box>
      <Divider />
    </>
  );
}
