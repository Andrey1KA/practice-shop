const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CARD_NAME_PATTERN = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
const CARD_EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/\d{2}$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) {
    return 'Введите email';
  }

  if (!EMAIL_PATTERN.test(value.trim())) {
    return 'Некорректный формат email';
  }

  return null;
}

export function validateLogin(value: string): string | null {
  if (!value.trim()) {
    return 'Введите логин';
  }

  if (value.trim().length < 3) {
    return 'Логин должен содержать минимум 3 символа';
  }

  return null;
}

export function validatePassword(value: string): string | null {
  if (!value.trim()) {
    return 'Введите пароль';
  }

  if (value.length < 6) {
    return 'Пароль должен содержать минимум 6 символов';
  }

  return null;
}

export function validateSignInCredentials(value: string): string | null {
  if (!value.trim()) {
    return 'Введите почту или логин';
  }

  return null;
}

export function validateSignInPassword(value: string): string | null {
  if (!value.trim()) {
    return 'Введите пароль';
  }

  return null;
}

export function validateProductTitle(value: string): string | null {
  if (!value.trim()) {
    return 'Введите название товара';
  }

  if (value.trim().length < 2) {
    return 'Название должно содержать минимум 2 символа';
  }

  return null;
}

export function validateProductPrice(value: string): string | null {
  if (!value.trim()) {
    return 'Введите цену';
  }

  const numericPrice = Number(value);

  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    return 'Цена должна быть положительным числом';
  }

  return null;
}

export function validateProductDescription(value: string): string | null {
  if (!value.trim()) {
    return 'Введите описание товара';
  }

  if (value.trim().length < 10) {
    return 'Описание должно содержать минимум 10 символов';
  }

  return null;
}

export function validateProductImage(isRequired: boolean, hasImage: boolean): string | null {
  if (isRequired && !hasImage) {
    return 'Загрузите изображение товара';
  }

  return null;
}

export function validateCardName(value: string): string | null {
  if (!value.trim()) {
    return 'Введите имя на карте';
  }

  if (!CARD_NAME_PATTERN.test(value.trim())) {
    return 'Имя может содержать только буквы, пробелы и дефис';
  }

  return null;
}

export function validateCardNumber(value: string): string | null {
  const digits = value.replace(/\s/g, '');

  if (!digits) {
    return 'Введите номер карты';
  }

  if (!/^\d{16}$/.test(digits)) {
    return 'Номер карты должен содержать 16 цифр';
  }

  return null;
}

export function validateCardExpiry(value: string): string | null {
  if (!value.trim()) {
    return 'Введите срок действия';
  }

  if (!CARD_EXPIRY_PATTERN.test(value.trim())) {
    return 'Формат срока действия: MM/YY';
  }

  const [month, year] = value.trim().split('/').map(Number);
  const now = new Date();
  const expiry = new Date(2000 + year, month, 0, 23, 59, 59);

  if (expiry < now) {
    return 'Срок действия карты истёк';
  }

  return null;
}

export function validateCardCvv(value: string): string | null {
  if (!value.trim()) {
    return 'Введите CVV';
  }

  if (!/^\d{3}$/.test(value.trim())) {
    return 'CVV должен содержать 3 цифры';
  }

  return null;
}

export function validateReviewComment(value: string): string | null {
  if (!value.trim()) {
    return 'Введите комментарий';
  }

  if (value.trim().length < 5) {
    return 'Комментарий должен содержать минимум 5 символов';
  }

  return null;
}
