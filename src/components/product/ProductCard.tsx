import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea component={RouterLink} to={`/product/${product.id}`}>
        <ProductImagePlaceholder sx={{ height: 140 }} iconSize={48} />
        <CardContent>
          <Typography variant="h6" component="h3">
            {product.title}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {formatPrice(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
        <Button variant="contained" fullWidth onClick={() => addItem(product)}>
          В корзину
        </Button>
      </CardActions>
    </Card>
  );
}
