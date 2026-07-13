import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.scss';

export function Profile() {
  const { user, password, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const roleLabel = user.role === 'admin' ? 'Администратор' : 'Пользователь';

  const fields = [
    { label: 'Email', value: user.email },
    { label: 'Логин', value: user.login },
    { label: 'Пароль', value: password },
    { label: 'Роль', value: roleLabel, isRole: true },
  ];

  return (
    <div className={styles['profile-page']}>
      <div className={styles['profile-card']}>
        <div className={styles['profile-card__header']}>
          <div className={styles['profile-card__avatar']}>{user.login.charAt(0).toUpperCase()}</div>
          <h1 className={styles['profile-card__title']}>{user.login}</h1>
          <span className={`${styles['profile-card__role']} ${styles[`profile-card__role--${user.role}`]}`}>
            {roleLabel}
          </span>
        </div>

        <div className={styles['profile-info']}>
          {fields.map((field) => (
            <div key={field.label} className={styles['profile-info__row']}>
              <span className={styles['profile-info__label']}>{field.label}</span>
              {field.isRole ? (
                <span className={`${styles['profile-info__badge']} ${styles[`profile-info__badge--${user.role}`]}`}>
                  {field.value}
                </span>
              ) : (
                <span className={styles['profile-info__value']}>{field.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
