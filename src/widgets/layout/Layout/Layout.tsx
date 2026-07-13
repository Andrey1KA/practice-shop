import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useProducts } from '../../../hooks/useProducts';
import { Header } from '../Header/Header';
import styles from './Layout.module.scss';

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
    <div className={styles.layout}>
      {!isAuthPage && <Header />}
      <main className={styles.layout__content}>
        <Outlet />
      </main>
    </div>
  );
}
