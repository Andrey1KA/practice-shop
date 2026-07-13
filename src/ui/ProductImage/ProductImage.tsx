import { ProductImagePlaceholder } from '../ProductImagePlaceholder/ProductImagePlaceholder';
import styles from './ProductImage.module.scss';

interface ProductImageProps {
  image?: string;
  title: string;
  variant?: 'card' | 'detail' | 'cart';
}

export function ProductImage({ image, title, variant = 'card' }: ProductImageProps) {
  if (!image) {
    return <ProductImagePlaceholder variant={variant} />;
  }

  return (
    <div className={`${styles['product-image']} ${styles[`product-image--${variant}`]}`}>
      <img src={image} alt={title} className={styles['product-image__img']} />
    </div>
  );
}
