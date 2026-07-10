import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { createReviewRequest, fetchReviews } from '../../api/reviews';
import { StarRating } from '../../components/review/StarRating';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import type { Review } from '../../types/review';
import './ProductReviews.scss';

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
        <Link to="/catalog" className="product-reviews__back-link">
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

    if (!id || !comment.trim()) {
      return;
    }

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
    <section className="product-reviews">
      <Link to={`/product/${product.id}`} className="product-reviews__back-link">
        ← К товару
      </Link>

      <div className="product-reviews__header">
        <h1 className="product-reviews__title">Отзывы о «{product.title}»</h1>
        {reviews.length > 0 && (
          <div className="product-reviews__summary">
            <StarRating value={Math.round(averageRating)} readOnly />
            <span className="product-reviews__summary-text">
              {averageRating.toFixed(1)} · {reviews.length} отзывов
            </span>
          </div>
        )}
      </div>

      <form className="product-reviews__form" onSubmit={handleSubmit}>
        <h2 className="product-reviews__form-title">Оставить отзыв</h2>

        <div className="product-reviews__field">
          <span>Оценка</span>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <label className="product-reviews__field">
          <span>Комментарий</span>
          <textarea
            className="product-reviews__textarea"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Напишите, что понравилось или не понравилось"
          />
        </label>

        <button type="submit" className="product-reviews__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
        </button>
      </form>

      <div className="product-reviews__list">
        <h2 className="product-reviews__list-title">Отзывы пользователей</h2>

        {reviews.length === 0 ? (
          <p className="product-reviews__empty">Пока нет отзывов. Будьте первым.</p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="product-reviews__item">
              <div className="product-reviews__item-header">
                <div>
                  <p className="product-reviews__author">
                    {review.userLogin}
                    {review.userLogin === user?.login ? ' (вы)' : ''}
                  </p>
                  <p className="product-reviews__date">{formatReviewDate(review.createdAt)}</p>
                </div>
                <StarRating value={review.rating} readOnly />
              </div>
              <p className="product-reviews__comment">{review.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
