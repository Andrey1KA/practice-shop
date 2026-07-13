import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/formatPrice';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { useProducts } from '../../../hooks/useProducts';
import { ProductImage } from '../../../ui/ProductImage/ProductImage';
import styles from './ProductCard.module.scss';

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { deleteProduct } = useProducts();
  const isAdmin = role === 'admin';

  const handleDelete = async () => {
    if (!window.confirm(`Удалить товар «${product.title}»?`)) {
      return;
    }

    await deleteProduct(product.id);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    addItem(product);
  };

  const cardContent = (
    <>
      <ProductImage image={product.image} title={product.title} />
      <div className={styles['product-card__content']}>
        <h3 className={styles['product-card__title']}>{product.title}</h3>
        <p className={styles['product-card__price']}>{formatPrice(product.price)}</p>
      </div>
    </>
  );

  return (
    <article className={styles['product-card']}>
      {isAuthenticated ? (
        <Link to={`/product/${product.id}`} className={styles['product-card__link']}>
          {cardContent}
        </Link>
      ) : (
        <div className={styles['product-card__link']}>{cardContent}</div>
      )}
      <div className={styles['product-card__actions']}>
        {isAdmin ? (
          <Link
            to={`/product/${product.id}/edit`}
            className={`${styles['product-card__button']} ${styles['product-card__button--secondary']}`}
          >
            Редактировать
          </Link>
        ) : (
          <button type="button" className={styles['product-card__button']} onClick={handleAddToCart}>
            В корзину
          </button>
        )}
        {isAdmin && (
          <button
            type="button"
            className={`${styles['product-card__button']} ${styles['product-card__button--danger']}`}
            onClick={handleDelete}
          >
            Удалить
          </button>
        )}
      </div>
    </article>
  );
}
