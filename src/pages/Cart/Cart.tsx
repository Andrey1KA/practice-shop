import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { formatPrice } from '../../utils/formatPrice';
import './Cart.scss';

export function Cart() {
  const { items, totalPrice, clear } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h1 className="cart-title">Корзина пуста</h1>
        <Link to="/catalog" className="cart-link-button">
          Перейти в каталог
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="cart-title">Корзина</h1>
      <div className="cart-list">
        {items.map((item) => (
          <CartItemRow key={item.product.id} item={item} />
        ))}
      </div>
      <div className="cart-summary">
        <p className="cart-summary__total">Итого: {formatPrice(totalPrice)}</p>
        <div className="cart-summary__actions">
          <button type="button" className="cart-summary__button cart-summary__button--secondary" onClick={clear}>
            Очистить корзину
          </button>
          <button type="button" className="cart-summary__button">
            Оформить заказ
          </button>
        </div>
      </div>
    </section>
  );
}
