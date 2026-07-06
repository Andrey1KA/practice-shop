import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Catalog } from './pages/Catalog/Catalog';
import { Product } from './pages/Product/Product';
import { Cart } from './pages/Cart/Cart';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Catalog />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="cart" element={<Cart />} />
      </Route>
    </Routes>
  );
}

export default App;
