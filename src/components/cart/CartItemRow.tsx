import type { CartItem } from '../../types/cart';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { ProductImage } from '../product/ProductImage';
import './CartItemRow.scss';

export function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem } = useCart();

  return (
    <>
      <div className="cart-item">
        <ProductImage image={item.product.image} title={item.product.title} variant="cart" />
        <div className="cart-item__info">
          <p className="cart-item__title">{item.product.title}</p>
          <p className="cart-item__meta">
            {item.quantity} × {formatPrice(item.product.price)}
          </p>
        </div>
        <button type="button" className="cart-item__remove" onClick={() => removeItem(item.product.id)}>
          Удалить
        </button> 
      </div>
      <hr className="cart-item__divider" />
    </>
  );
}
