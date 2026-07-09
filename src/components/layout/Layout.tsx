import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { Header } from './Header';
import './Layout.scss';

export function Layout() {
  const { pathname } = useLocation();
  const { loadProducts } = useProducts();
  const isAuthPage = pathname === '/register' || pathname === '/login';

  useEffect(() => {
    if (!isAuthPage) {
      loadProducts().catch(() => undefined);
    }
  }, [isAuthPage, loadProducts]);

  return (
    <div className="layout">
      {!isAuthPage && <Header />}
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}
