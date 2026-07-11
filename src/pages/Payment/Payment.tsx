import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import './Payment.scss';

export function Payment() {
  const { isAuthenticated } = useAuth();
  const { items, totalPrice, clear } = useCart();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (items.length === 0 && !isPaid) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    clear();
    setIsPaid(true);
    setIsSubmitting(false);
  };

  if (isPaid) {
    return (
      <div className="payment-page">
        <div className="payment-card payment-card--success">
          <h1 className="payment-card__title">Оплата прошла успешно</h1>
          <p className="payment-card__message">Спасибо за заказ. Мы уже начали его обработку.</p>
          <Link to="/catalog" className="payment-card__button">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-layout">
        <section className="payment-card payment-card--summary">
          <h1 className="payment-card__title">Ваш заказ</h1>

          <div className="payment-order">
            {items.map((item) => (
              <div key={item.product.id} className="payment-order__row">
                <div>
                  <p className="payment-order__title">{item.product.title}</p>
                  <p className="payment-order__meta">
                    {item.quantity} × {formatPrice(item.product.price)}
                  </p>
                </div>
                <p className="payment-order__price">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="payment-order__total">
            <span>Итого</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
        </section>

        <section className="payment-card">
          <h2 className="payment-card__subtitle">Оплата картой</h2>

          <form className="payment-form" onSubmit={handleSubmit}>
            <label className="payment-form__field">
              <span>Имя на карте</span>
              <input
                className="payment-form__input"
                type="text"
                value={cardName}
                onChange={(event) => setCardName(event.target.value)}
                placeholder="IVAN IVANOV"
              />
            </label>

            <label className="payment-form__field">
              <span>Номер карты</span>
              <input
                className="payment-form__input"
                type="text"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
            </label>

            <div className="payment-form__row">
              <label className="payment-form__field">
                <span>Срок действия</span>
                <input
                  className="payment-form__input"
                  type="text"
                  value={cardExpiry}
                  onChange={(event) => setCardExpiry(event.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </label>

              <label className="payment-form__field">
                <span>CVV</span>
                <input
                  className="payment-form__input"
                  type="password"
                  value={cardCvv}
                  onChange={(event) => setCardCvv(event.target.value)}
                  placeholder="123"
                  maxLength={3}
                />
              </label>
            </div>

            <div className="payment-form__actions">
              <Link to="/cart" className="payment-card__button payment-card__button--secondary">
                Назад в корзину
              </Link>
              <button type="submit" className="payment-card__button" disabled={isSubmitting}>
                {isSubmitting ? 'Оплата...' : `Оплатить ${formatPrice(totalPrice)}`}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
