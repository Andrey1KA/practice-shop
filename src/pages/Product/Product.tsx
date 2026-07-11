import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { ProductImage } from '../../components/product/ProductImage';
import './Product.scss';

export function Product() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const { addItem } = useCart();
  const { products, deleteProduct } = useProducts();
  const product = products.find((item) => item.id === id);
  const isAdmin = role === 'admin';

  const handleDelete = async () => {
    if (!product || !window.confirm(`Удалить товар «${product.title}»?`)) {
      return;
    }

    await deleteProduct(product.id);
    navigate('/catalog');
  };

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
        <div className="product-page__actions">
          {isAdmin ? (
            <>
              <Link to={`/product/${product.id}/edit`} className="product-page__button">
                Редактировать
              </Link>
              <Link to={`/product/${product.id}/reviews`} className="product-page__button product-page__button--secondary">
                Отзывы
              </Link>
              <button type="button" className="product-page__button product-page__button--danger" onClick={handleDelete}>
                Удалить
              </button>
            </>
          ) : (
            <>
              <button type="button" className="product-page__button" onClick={() => addItem(product)}>
                В корзину
              </button>
              <Link to={`/product/${product.id}/reviews`} className="product-page__button product-page__button--secondary">
                Отзывы
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
