import { Navigate, useNavigate } from 'react-router-dom';
import { AdminProductForm } from '../../components/product/AdminProductForm';
import { useAuth } from '../../hooks/useAuth';
import './AddProduct.scss';

export function AddProduct() {
  const navigate = useNavigate();
  const { role } = useAuth();

  if (role !== 'admin') {
    return <Navigate to="/catalog" replace />;
  }

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h1 className="add-product-card__title">Добавить товар</h1>
        <AdminProductForm onSuccess={() => navigate('/catalog')} />
      </div>
    </div>
  );
}
