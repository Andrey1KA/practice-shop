import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validateLogin, validatePassword } from '../../utils/validation';
import styles from './Login.module.scss';

type RegisterFieldErrors = {
  email?: string;
  login?: string;
  password?: string;
};

export function Login() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [formError, setFormError] = useState('');

  const clearFieldError = (field: keyof RegisterFieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const nextFieldErrors: RegisterFieldErrors = {
      email: validateEmail(email) ?? undefined,
      login: validateLogin(login) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };

    const hasFieldErrors = Object.values(nextFieldErrors).some(Boolean);

    if (hasFieldErrors) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    try {
      const isRegistered = await register(email, login, password);

      if (!isRegistered) {
        setFormError('Пользователь с таким email или логином уже зарегистрирован');
        return;
      }

      navigate('/catalog');
    } catch {
      setFormError('Не удалось выполнить регистрацию');
    }
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-card']}>
        <h1 className={styles['login-card__title']}>Регистрация</h1>

        <form className={styles['login-form']} onSubmit={handleRegister} noValidate>
          <label className={styles['login-form__field']}>
            <span>Email</span>
            <input
              className={`${styles['login-form__input']}${fieldErrors.email ? ` ${styles['login-form__input--invalid']}` : ''}`}
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError('email');
              }}
            />
            {fieldErrors.email && <span className={styles['login-form__field-error']}>{fieldErrors.email}</span>}
          </label>
          <label className={styles['login-form__field']}>
            <span>Логин</span>
            <input
              className={`${styles['login-form__input']}${fieldErrors.login ? ` ${styles['login-form__input--invalid']}` : ''}`}
              type="text"
              value={login}
              onChange={(event) => {
                setLogin(event.target.value);
                clearFieldError('login');
              }}
            />
            {fieldErrors.login && <span className={styles['login-form__field-error']}>{fieldErrors.login}</span>}
          </label>
          <label className={styles['login-form__field']}>
            <span>Пароль</span>
            <input
              className={`${styles['login-form__input']}${fieldErrors.password ? ` ${styles['login-form__input--invalid']}` : ''}`}
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError('password');
              }}
            />
            {fieldErrors.password && <span className={styles['login-form__field-error']}>{fieldErrors.password}</span>}
          </label>

          {formError && <div className={styles['login-form__error']}>{formError}</div>}

          <button type="submit" className={styles['login-form__submit']}>
            Зарегистрироваться
          </button>

          <div className={styles['login-form__sign-in']}>
            <span className={styles['login-form__question']}>Уже зарегистрированы?</span>
            <RouterLink to="/login" className={styles['login-form__sign-in-link']}>
              Войти
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  );
}
