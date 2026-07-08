import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Login.scss';

export function Login() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !login.trim() || !password.trim()) {
      setError('Введите email, логин и пароль');
      return;
    }

    const isRegistered = register(email, login, password);

    if (!isRegistered) {
      setError('Пользователь с таким email или логином уже зарегистрирован');
      return;
    }

    navigate('/catalog');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card__title">Регистрация</h1>

        <form className="login-form" onSubmit={handleRegister}>
          <label className="login-form__field">
            <span>Email</span>
            <input
              className="login-form__input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="login-form__field">
            <span>Логин</span>
            <input
              className="login-form__input"
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
            />
          </label>
          <label className="login-form__field">
            <span>Пароль</span>
            <input
              className="login-form__input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <div className="login-form__error">{error}</div>}

          <button type="submit" className="login-form__submit">
            Зарегистрироваться
          </button>

          <div className="login-form__sign-in">
            <span className="login-form__question">Уже зарегистрированы?</span>
            <RouterLink to="/login" className="login-form__sign-in-link">
              Войти
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  );
}
