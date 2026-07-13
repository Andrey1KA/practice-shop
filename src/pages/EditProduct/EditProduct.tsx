import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AdminProductForm } from '../../widgets/product/AdminProductForm/AdminProductForm';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import styles from './EditProduct.module.scss';

export function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const { products } = useProducts();
  const product = products.find((item) => item.id === id);

  if (role !== 'admin') {
    return <Navigate to="/catalog" replace />;
  }

  if (!product) {
    return (
      <section>
        <p>Товар не найден.</p>
      </section>
    );
  }

  return (
    <div className={styles['edit-product-page']}>
      <div className={styles['edit-product-card']}>
        <h1 className={styles['edit-product-card__title']}>Редактировать товар</h1>
        <AdminProductForm product={product} onSuccess={() => navigate('/catalog')} />
      </div>
    </div>
  );
}
