import './StarRating.scss';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
  return (
    <div className={`star-rating${readOnly ? ' star-rating--readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-rating__star${star <= value ? ' star-rating__star--active' : ''}`}
          onClick={readOnly ? undefined : () => onChange?.(star)}
          disabled={readOnly}
          aria-label={`${star} из 5`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
