import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateSignInCredentials, validateSignInPassword } from '../../utils/validation';
import styles from './SignIn.module.scss';

type SignInFieldErrors = {
  email?: string;
  password?: string;
};

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({});
  const [formError, setFormError] = useState('');

  const clearFieldError = (field: keyof SignInFieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const nextFieldErrors: SignInFieldErrors = {
      email: validateSignInCredentials(email) ?? undefined,
      password: validateSignInPassword(password) ?? undefined,
    };

    const hasFieldErrors = Object.values(nextFieldErrors).some(Boolean);

    if (hasFieldErrors) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    try {
      const isLoggedIn = await login(email, password);

      if (!isLoggedIn) {
        setFormError('Неверно заполнена почта или пароль');
        return;
      }

      const redirectTo =
        typeof location.state === 'object' &&
        location.state &&
        'from' in location.state &&
        typeof location.state.from === 'string'
          ? location.state.from
          : '/catalog';

      navigate(redirectTo);
    } catch {
      setFormError('Не удалось выполнить вход');
    }
  };

  return (
    <div className={styles['sign-in-page']}>
      <div className={styles['sign-in-card']}>
        <h1 className={styles['sign-in-card__title']}>Вход</h1>

        <form className={styles['sign-in-form']} onSubmit={handleLogin} noValidate>
          <label className={styles['sign-in-form__field']}>
            <span>Почта или логин</span>
            <input
              className={`${styles['sign-in-form__input']}${fieldErrors.email ? ` ${styles['sign-in-form__input--invalid']}` : ''}`}
              type="text"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError('email');
              }}
            />
            {fieldErrors.email && <span className={styles['sign-in-form__field-error']}>{fieldErrors.email}</span>}
          </label>
          <label className={styles['sign-in-form__field']}>
            <span>Пароль</span>
            <input
              className={`${styles['sign-in-form__input']}${fieldErrors.password ? ` ${styles['sign-in-form__input--invalid']}` : ''}`}
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError('password');
              }}
            />
            {fieldErrors.password && <span className={styles['sign-in-form__field-error']}>{fieldErrors.password}</span>}
          </label>

          {formError && <div className={styles['sign-in-form__error']}>{formError}</div>}

          <button type="submit" className={styles['sign-in-form__submit']}>
            Войти
          </button>

          <div className={styles['sign-in-form__register']}>
            <span className={styles['sign-in-form__question']}>Нет аккаунта?</span>
            <RouterLink to="/register" className={styles['sign-in-form__register-link']}>
              Зарегистрироваться
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  );
}
