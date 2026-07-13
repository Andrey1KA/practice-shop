import { Navigate, useNavigate } from 'react-router-dom';
import { AdminProductForm } from '../../widgets/product/AdminProductForm/AdminProductForm';
import { useAuth } from '../../hooks/useAuth';
import styles from './AddProduct.module.scss';

export function AddProduct() {
  const navigate = useNavigate();
  const { role } = useAuth();

  if (role !== 'admin') {
    return <Navigate to="/catalog" replace />;
  }

  return (
    <div className={styles['add-product-page']}>
      <div className={styles['add-product-card']}>
        <h1 className={styles['add-product-card__title']}>Добавить товар</h1>
        <AdminProductForm onSuccess={() => navigate('/catalog')} />
      </div>
    </div>
  );
}
