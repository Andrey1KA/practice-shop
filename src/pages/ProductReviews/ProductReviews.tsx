import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { createReviewRequest, fetchReviews } from '../../api/reviews';
import { StarRating } from '../../ui/StarRating/StarRating';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import type { Review } from '../../types/review';
import { validateReviewComment } from '../../utils/validation';
import styles from './ProductReviews.module.scss';

function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString('ru-RU');
}

export function ProductReviews() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { products } = useProducts();
  const product = products.find((item) => item.id === id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  if (!product) {
    return (
      <section>
        <p>Товар не найден.</p>
        <Link to="/catalog" className={styles['product-reviews__back-link']}>
          Вернуться в каталог
        </Link>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextCommentError = validateReviewComment(comment);

    if (nextCommentError) {
      setCommentError(nextCommentError);
      return;
    }

    if (!id) {
      return;
    }

    setCommentError('');
    setIsSubmitting(true);

    try {
      const review = await createReviewRequest(id, rating, comment.trim());
      setReviews((current) => {
        const withoutCurrent = current.filter((item) => item.userLogin !== review.userLogin);
        return [review, ...withoutCurrent];
      });
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles['product-reviews']}>
      <Link to={`/product/${product.id}`} className={styles['product-reviews__back-link']}>
        ← К товару
      </Link>

      <div className={styles['product-reviews__header']}>
        <h1 className={styles['product-reviews__title']}>Отзывы о «{product.title}»</h1>
        {reviews.length > 0 && (
          <div className={styles['product-reviews__summary']}>
            <StarRating value={Math.round(averageRating)} readOnly />
            <span className={styles['product-reviews__summary-text']}>
              {averageRating.toFixed(1)} · {reviews.length} отзывов
            </span>
          </div>
        )}
      </div>

      <form className={styles['product-reviews__form']} onSubmit={handleSubmit} noValidate>
        <h2 className={styles['product-reviews__form-title']}>Оставить отзыв</h2>

        <div className={styles['product-reviews__field']}>
          <span>Оценка</span>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <label className={styles['product-reviews__field']}>
          <span>Комментарий</span>
          <textarea
            className={`${styles['product-reviews__textarea']}${commentError ? ` ${styles['product-reviews__textarea--invalid']}` : ''}`}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              if (commentError) {
                setCommentError('');
              }
            }}
            placeholder="Напишите, что понравилось или не понравилось"
          />
          {commentError && <span className={styles['product-reviews__field-error']}>{commentError}</span>}
        </label>

        <button type="submit" className={styles['product-reviews__submit']} disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
        </button>
      </form>

      <div className={styles['product-reviews__list']}>
        <h2 className={styles['product-reviews__list-title']}>Отзывы пользователей</h2>

        {reviews.length === 0 ? (
          <p className={styles['product-reviews__empty']}>Пока нет отзывов. Будьте первым.</p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className={styles['product-reviews__item']}>
              <div className={styles['product-reviews__item-header']}>
                <div>
                  <p className={styles['product-reviews__author']}>
                    {review.userLogin}
                    {review.userLogin === user?.login ? ' (вы)' : ''}
                  </p>
                  <p className={styles['product-reviews__date']}>{formatReviewDate(review.createdAt)}</p>
                </div>
                <StarRating value={review.rating} readOnly />
              </div>
              <p className={styles['product-reviews__comment']}>{review.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
