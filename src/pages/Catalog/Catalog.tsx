import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { products } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';

export function Catalog() {
  return (
    <section>
      <Typography variant="h4" component="h1" gutterBottom>
        Каталог
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </section>
  );
}
