import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import './ProductCard.scss';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__link">
        <ProductImagePlaceholder />
        <div className="product-card__content">
          <h3 className="product-card__title">{product.title}</h3>
          <p className="product-card__price">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <div className="product-card__actions">
        <button type="button" className="product-card__button" onClick={() => addItem(product)}>
          В корзину
        </button>
      </div>
    </article>
  );
}
