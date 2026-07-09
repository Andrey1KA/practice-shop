import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import './ProductImage.scss';

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
    <div className={`product-image product-image--${variant}`}>
      <img src={image} alt={title} className="product-image__img" />
    </div>
  );
}
