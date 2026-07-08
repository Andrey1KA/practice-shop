import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import './Header.scss';

export function Header() {
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__toolbar">
        <Link to="/login" className="header__logo-placeholder" aria-label="Логотип">
          <span className="header__logo-mark" />
        </Link>
        <nav className="header__nav">
          <Link to="/catalog" className="header__nav-button">
            Каталог
          </Link>
          <Link
            to="/cart"
            className={`header__nav-button header__cart-button${totalCount > 0 ? ' header__cart-button--with-badge' : ''}`}
          >
            Корзина
            {totalCount > 0 && <span className="header__badge">{totalCount}</span>}
          </Link>
          {user ? (
            <div className="header__user">
              <span className={`header__role header__role--${user.role}`}>
                {user.login}
              </span>
              <button type="button" className="header__nav-button" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
