import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { ProductImagePlaceholder } from '../../components/product/ProductImagePlaceholder';

export function Product() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <section>
        <Typography gutterBottom>Товар не найден.</Typography>
        <Button component={RouterLink} to="/">
          Вернуться в каталог
        </Button>
      </section>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <ProductImagePlaceholder sx={{ width: 240, height: 240, borderRadius: 2 }} iconSize={72} />
      <Box sx={{ flex: 1, minWidth: 240 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {product.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {product.description}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {formatPrice(product.price)}
        </Typography>
        <Button variant="contained" onClick={() => addItem(product)}>
          В корзину
        </Button>
      </Box>
    </Box>
  );
}
