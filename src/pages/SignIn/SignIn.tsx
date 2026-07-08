import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './SignIn.scss';

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Введите почту или логин и пароль');
      return;
    }

    const isLoggedIn = login(email, password);

    if (!isLoggedIn) {
      setError('Неверно заполнена почта или пароль');
      return;
    }

    navigate('/catalog');
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-card">
        <h1 className="sign-in-card__title">Вход</h1>

        <form className="sign-in-form" onSubmit={handleLogin}>
          <label className="sign-in-form__field">
            <span>Почта или логин</span>
            <input
              className="sign-in-form__input"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="sign-in-form__field">
            <span>Пароль</span>
            <input
              className="sign-in-form__input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <div className="sign-in-form__error">{error}</div>}

          <button type="submit" className="sign-in-form__submit">
            Войти
          </button>

          <div className="sign-in-form__register">
            <span className="sign-in-form__question">Нет аккаунта?</span>
            <RouterLink to="/register" className="sign-in-form__register-link">
              Зарегистрироваться
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  );
}
