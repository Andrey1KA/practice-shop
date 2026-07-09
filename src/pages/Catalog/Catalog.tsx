import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProductCard';
import './Catalog.scss';

export function Catalog() {
  const { products } = useProducts();

  return (
    <section>
      <h1 className="catalog-title">Каталог</h1>
      <div className="catalog-grid">
        {products.map((product) => (
          <div key={product.id} className="catalog-grid__item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
