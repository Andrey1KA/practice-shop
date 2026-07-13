import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import {
  validateCardCvv,
  validateCardExpiry,
  validateCardName,
  validateCardNumber,
} from '../../utils/validation';
import styles from './Payment.module.scss';

type PaymentFieldErrors = {
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
};

export function Payment() {
  const { isAuthenticated } = useAuth();
  const { items, totalPrice, clear } = useCart();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [fieldErrors, setFieldErrors] = useState<PaymentFieldErrors>({});
  const [isPaid, setIsPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (field: keyof PaymentFieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (items.length === 0 && !isPaid) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFieldErrors: PaymentFieldErrors = {
      cardName: validateCardName(cardName) ?? undefined,
      cardNumber: validateCardNumber(cardNumber) ?? undefined,
      cardExpiry: validateCardExpiry(cardExpiry) ?? undefined,
      cardCvv: validateCardCvv(cardCvv) ?? undefined,
    };

    const hasFieldErrors = Object.values(nextFieldErrors).some(Boolean);

    if (hasFieldErrors) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    clear();
    setIsPaid(true);
    setIsSubmitting(false);
  };

  const inputClassName = (hasError: boolean) =>
    `${styles['payment-form__input']}${hasError ? ` ${styles['payment-form__input--invalid']}` : ''}`;

  if (isPaid) {
    return (
      <div className={styles['payment-page']}>
        <div className={`${styles['payment-card']} ${styles['payment-card--success']}`}>
          <h1 className={styles['payment-card__title']}>Оплата прошла успешно</h1>
          <p className={styles['payment-card__message']}>Спасибо за заказ. Мы уже начали его обработку.</p>
          <Link to="/catalog" className={styles['payment-card__button']}>
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['payment-page']}>
      <div className={styles['payment-layout']}>
        <section className={`${styles['payment-card']} ${styles['payment-card--summary']}`}>
          <h1 className={styles['payment-card__title']}>Ваш заказ</h1>

          <div className={styles['payment-order']}>
            {items.map((item) => (
              <div key={item.product.id} className={styles['payment-order__row']}>
                <div>
                  <p className={styles['payment-order__title']}>{item.product.title}</p>
                  <p className={styles['payment-order__meta']}>
                    {item.quantity} × {formatPrice(item.product.price)}
                  </p>
                </div>
                <p className={styles['payment-order__price']}>{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className={styles['payment-order__total']}>
            <span>Итого</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
        </section>

        <section className={styles['payment-card']}>
          <h2 className={styles['payment-card__subtitle']}>Оплата картой</h2>

          <form className={styles['payment-form']} onSubmit={handleSubmit} noValidate>
            <label className={styles['payment-form__field']}>
              <span>Имя на карте</span>
              <input
                className={inputClassName(Boolean(fieldErrors.cardName))}
                type="text"
                value={cardName}
                onChange={(event) => {
                  setCardName(event.target.value);
                  clearFieldError('cardName');
                }}
                placeholder="IVAN IVANOV"
              />
              {fieldErrors.cardName && <span className={styles['payment-form__field-error']}>{fieldErrors.cardName}</span>}
            </label>

            <label className={styles['payment-form__field']}>
              <span>Номер карты</span>
              <input
                className={inputClassName(Boolean(fieldErrors.cardNumber))}
                type="text"
                value={cardNumber}
                onChange={(event) => {
                  setCardNumber(event.target.value);
                  clearFieldError('cardNumber');
                }}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
              {fieldErrors.cardNumber && (
                <span className={styles['payment-form__field-error']}>{fieldErrors.cardNumber}</span>
              )}
            </label>

            <div className={styles['payment-form__row']}>
              <label className={styles['payment-form__field']}>
                <span>Срок действия</span>
                <input
                  className={inputClassName(Boolean(fieldErrors.cardExpiry))}
                  type="text"
                  value={cardExpiry}
                  onChange={(event) => {
                    setCardExpiry(event.target.value);
                    clearFieldError('cardExpiry');
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {fieldErrors.cardExpiry && (
                  <span className={styles['payment-form__field-error']}>{fieldErrors.cardExpiry}</span>
                )}
              </label>

              <label className={styles['payment-form__field']}>
                <span>CVV</span>
                <input
                  className={inputClassName(Boolean(fieldErrors.cardCvv))}
                  type="password"
                  value={cardCvv}
                  onChange={(event) => {
                    setCardCvv(event.target.value);
                    clearFieldError('cardCvv');
                  }}
                  placeholder="123"
                  maxLength={3}
                />
                {fieldErrors.cardCvv && <span className={styles['payment-form__field-error']}>{fieldErrors.cardCvv}</span>}
              </label>
            </div>

            <div className={styles['payment-form__actions']}>
              <Link to="/cart" className={`${styles['payment-card__button']} ${styles['payment-card__button--secondary']}`}>
                Назад в корзину
              </Link>
              <button type="submit" className={styles['payment-card__button']} disabled={isSubmitting}>
                {isSubmitting ? 'Оплата...' : `Оплатить ${formatPrice(totalPrice)}`}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
