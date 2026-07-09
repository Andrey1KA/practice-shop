import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { ProductImage } from '../../components/product/ProductImage';
import './Product.scss';

export function Product() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { products } = useProducts();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <section>
        <p>Товар не найден.</p>
        <Link to="/catalog" className="product-page__back-link">
          Вернуться в каталог
        </Link>
      </section>
    );
  }

  return (
    <section className="product-page">
      <ProductImage image={product.image} title={product.title} variant="detail" />
      <div className="product-page__content">
        <h1 className="product-page__title">{product.title}</h1>
        <p className="product-page__description">{product.description}</p>
        <p className="product-page__price">{formatPrice(product.price)}</p>
        <button type="button" className="product-page__button" onClick={() => addItem(product)}>
          В корзину
        </button>
      </div>
    </section>
  );
}
