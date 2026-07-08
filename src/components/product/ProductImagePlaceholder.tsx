import './ProductImagePlaceholder.scss';

interface ProductImagePlaceholderProps {
  variant?: 'card' | 'detail' | 'cart';
}

export function ProductImagePlaceholder({ variant = 'card' }: ProductImagePlaceholderProps) {
  return (
    <div className={`product-image-placeholder product-image-placeholder--${variant}`}>
      <span className="product-image-placeholder__icon" />
    </div>
  );
}
