import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import './Layout.scss';

export function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/register' || pathname === '/login';

  return (
    <div className="layout">
      {!isAuthPage && <Header />}
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}
