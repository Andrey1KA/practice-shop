import styles from './ProductImagePlaceholder.module.scss';

interface ProductImagePlaceholderProps {
  variant?: 'card' | 'detail' | 'cart';
}

export function ProductImagePlaceholder({ variant = 'card' }: ProductImagePlaceholderProps) {
  return (
    <div className={`${styles['product-image-placeholder']} ${styles[`product-image-placeholder--${variant}`]}`}>
      <span className={styles['product-image-placeholder__icon']} />
    </div>
  );
}
