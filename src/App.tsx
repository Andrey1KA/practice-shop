import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Catalog } from './pages/Catalog/Catalog';
import { Product } from './pages/Product/Product';
import { Cart } from './pages/Cart/Cart';
import { Login } from './pages/Login/Login';
import { SignIn } from './pages/SignIn/SignIn';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
