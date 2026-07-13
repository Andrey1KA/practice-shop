import type { CartItem } from '../../../types/cart';
import { formatPrice } from '../../../utils/formatPrice';
import { useCart } from '../../../hooks/useCart';
import { ProductImage } from '../../../ui/ProductImage/ProductImage';
import styles from './CartItemRow.module.scss';

export function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem } = useCart();

  return (
    <>
      <div className={styles['cart-item']}>
        <ProductImage image={item.product.image} title={item.product.title} variant="cart" />
        <div className={styles['cart-item__info']}>
          <p className={styles['cart-item__title']}>{item.product.title}</p>
          <p className={styles['cart-item__meta']}>
            {item.quantity} × {formatPrice(item.product.price)}
          </p>
        </div>
        <button type="button" className={styles['cart-item__remove']} onClick={() => removeItem(item.product.id)}>
          Удалить
        </button>
      </div>
      <hr className={styles['cart-item__divider']} />
    </>
  );
}
