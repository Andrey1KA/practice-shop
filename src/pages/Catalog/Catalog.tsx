import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../widgets/product/ProductCard/ProductCard';
import styles from './Catalog.module.scss';

export function Catalog() {
  const { products } = useProducts();

  return (
    <section>
      <h1 className={styles['catalog-title']}>Каталог</h1>
      <div className={styles['catalog-grid']}>
        {products.map((product) => (
          <div key={product.id} className={styles['catalog-grid__item']}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
