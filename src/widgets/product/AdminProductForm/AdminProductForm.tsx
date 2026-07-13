import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Product } from '../../../types/product';
import { useProducts } from '../../../hooks/useProducts';
import {
  validateProductDescription,
  validateProductImage,
  validateProductPrice,
  validateProductTitle,
} from '../../../utils/validation';
import styles from './AdminProductForm.module.scss';

type AdminProductFormProps = {
  product?: Product;
  onSuccess?: () => void;
};

type AdminProductFieldErrors = {
  title?: string;
  price?: string;
  description?: string;
  image?: string;
};

export function AdminProductForm({ product, onSuccess }: AdminProductFormProps) {
  const { createProduct, updateProduct } = useProducts();
  const isEditMode = Boolean(product);
  const [title, setTitle] = useState(product?.title ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(product?.image ?? '');
  const [fieldErrors, setFieldErrors] = useState<AdminProductFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (field: keyof AdminProductFieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : product?.image ?? '');
    clearFieldError('image');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasImage = Boolean(imageFile || previewUrl);
    const nextFieldErrors: AdminProductFieldErrors = {
      title: validateProductTitle(title) ?? undefined,
      price: validateProductPrice(price) ?? undefined,
      description: validateProductDescription(description) ?? undefined,
      image: validateProductImage(!isEditMode, hasImage) ?? undefined,
    };

    const hasFieldErrors = Object.values(nextFieldErrors).some(Boolean);

    if (hasFieldErrors) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    const numericPrice = Number(price);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('price', String(numericPrice));
    formData.append('description', description.trim());

    if (imageFile) {
      formData.append('image', imageFile);
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }

      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = (hasError: boolean) =>
    `${styles['admin-product-form__input']}${hasError ? ` ${styles['admin-product-form__input--invalid']}` : ''}`;

  return (
    <form className={styles['admin-product-form']} onSubmit={handleSubmit} noValidate>
      <div className={styles['admin-product-form__grid']}>
        <label className={styles['admin-product-form__field']}>
          <span>Название</span>
          <input
            className={inputClassName(Boolean(fieldErrors.title))}
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              clearFieldError('title');
            }}
          />
          {fieldErrors.title && <span className={styles['admin-product-form__field-error']}>{fieldErrors.title}</span>}
        </label>

        <label className={styles['admin-product-form__field']}>
          <span>Цена</span>
          <input
            className={inputClassName(Boolean(fieldErrors.price))}
            type="number"
            min="1"
            value={price}
            onChange={(event) => {
              setPrice(event.target.value);
              clearFieldError('price');
            }}
          />
          {fieldErrors.price && <span className={styles['admin-product-form__field-error']}>{fieldErrors.price}</span>}
        </label>

        <label className={`${styles['admin-product-form__field']} ${styles['admin-product-form__field--wide']}`}>
          <span>Описание</span>
          <textarea
            className={`${styles['admin-product-form__textarea']}${fieldErrors.description ? ` ${styles['admin-product-form__input--invalid']}` : ''}`}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              clearFieldError('description');
            }}
          />
          {fieldErrors.description && (
            <span className={styles['admin-product-form__field-error']}>{fieldErrors.description}</span>
          )}
        </label>

        <label className={`${styles['admin-product-form__field']} ${styles['admin-product-form__field--wide']}`}>
          <span>Картинка</span>
          <input
            className={`${styles['admin-product-form__file']}${fieldErrors.image ? ` ${styles['admin-product-form__input--invalid']}` : ''}`}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {fieldErrors.image && <span className={styles['admin-product-form__field-error']}>{fieldErrors.image}</span>}
        </label>
      </div>

      {previewUrl && <img src={previewUrl} alt="Предпросмотр товара" className={styles['admin-product-form__preview']} />}

      <button type="submit" className={styles['admin-product-form__button']} disabled={isSubmitting}>
        {isSubmitting ? 'Сохранение...' : isEditMode ? 'Сохранить изменения' : 'Добавить товар'}
      </button>
    </form>
  );
}
