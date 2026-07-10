import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Profile.scss';

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
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="profile-card__avatar">{user.login.charAt(0).toUpperCase()}</div>
          <h1 className="profile-card__title">{user.login}</h1>
          <span className={`profile-card__role profile-card__role--${user.role}`}>{roleLabel}</span>
        </div>

        <div className="profile-info">
          {fields.map((field) => (
            <div key={field.label} className="profile-info__row">
              <span className="profile-info__label">{field.label}</span>
              {field.isRole ? (
                <span className={`profile-info__badge profile-info__badge--${user.role}`}>{field.value}</span>
              ) : (
                <span className="profile-info__value">{field.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
