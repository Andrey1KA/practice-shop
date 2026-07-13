import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import styles from './Header.module.scss';

export function Header() {
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const { user, role, isAuthenticated, logout } = useAuth();
  const isAdmin = role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/catalog');
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__toolbar}>
        <Link to="/catalog" className={styles['header__logo-placeholder']} aria-label="Логотип">
          <span className={styles['header__logo-mark']} />
        </Link>
        <nav className={styles.header__nav}>
          <Link to="/catalog" className={styles['header__nav-button']}>
            Каталог
          </Link>
          {isAdmin && (
            <Link to="/add-product" className={styles['header__nav-button']}>
              Добавить товар
            </Link>
          )}
          {!isAdmin && (
            <Link
              to={isAuthenticated ? '/cart' : '/login'}
              className={`${styles['header__nav-button']} ${styles['header__cart-button']}${isAuthenticated && totalCount > 0 ? ` ${styles['header__cart-button--with-badge']}` : ''}`}
            >
              Корзина
              {isAuthenticated && totalCount > 0 && <span className={styles.header__badge}>{totalCount}</span>}
            </Link>
          )}
          {user ? (
            <div className={styles.header__user}>
              <Link to="/profile" className={`${styles.header__role} ${styles[`header__role--${user.role}`]}`}>
                {user.login}
              </Link>
              <button type="button" className={styles['header__nav-button']} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles['header__nav-button']}>
              Авторизоваться
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
