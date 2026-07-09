import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useProducts } from '../../hooks/useProducts';
import './AdminProductForm.scss';

type AdminProductFormProps = {
  onSuccess?: () => void;
};

export function AdminProductForm({ onSuccess }: AdminProductFormProps) {
  const { createProduct } = useProducts();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericPrice = Number(price);

    if (!title.trim() || !description.trim() || !price.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('price', String(numericPrice));
    formData.append('description', description.trim());

    if (imageFile) {
      formData.append('image', imageFile);
    }

    setIsSubmitting(true);

    try {
      await createProduct(formData);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <div className="admin-product-form__grid">
        <label className="admin-product-form__field">
          <span>Название</span>
          <input
            className="admin-product-form__input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="admin-product-form__field">
          <span>Цена</span>
          <input
            className="admin-product-form__input"
            type="number"
            min="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </label>

        <label className="admin-product-form__field admin-product-form__field--wide">
          <span>Описание</span>
          <textarea
            className="admin-product-form__textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label className="admin-product-form__field admin-product-form__field--wide">
          <span>Картинка</span>
          <input className="admin-product-form__file" type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      {previewUrl && <img src={previewUrl} alt="Предпросмотр товара" className="admin-product-form__preview" />}

      <button type="submit" className="admin-product-form__button" disabled={isSubmitting}>
        {isSubmitting ? 'Сохранение...' : 'Добавить товар'}
      </button>
    </form>
  );
}
