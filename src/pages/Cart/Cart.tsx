import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItemRow } from '../../widgets/cart/CartItemRow/CartItemRow';
import { formatPrice } from '../../utils/formatPrice';
import styles from './Cart.module.scss';

export function Cart() {
  const { items, totalPrice, clear } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h1 className={styles['cart-title']}>Корзина пуста</h1>
        <Link to="/catalog" className={styles['cart-link-button']}>
          Перейти в каталог
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className={styles['cart-title']}>Корзина</h1>
      <div className={styles['cart-list']}>
        {items.map((item) => (
          <CartItemRow key={item.product.id} item={item} />
        ))}
      </div>
      <div className={styles['cart-summary']}>
        <p className={styles['cart-summary__total']}>Итого: {formatPrice(totalPrice)}</p>
        <div className={styles['cart-summary__actions']}>
          <button
            type="button"
            className={`${styles['cart-summary__button']} ${styles['cart-summary__button--secondary']}`}
            onClick={clear}
          >
            Очистить корзину
          </button>
          <Link to="/payment" className={styles['cart-summary__button']}>
            Оформить заказ
          </Link>
        </div>
      </div>
    </section>
  );
}
