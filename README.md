# Интернет-магазин (practice-shop)

Учебный SPA-проект интернет-магазина на **Vite + React + TypeScript** с собственным бэкендом на **Express + SQLite**.  
Данные пользователей, товаров и отзывов хранятся на сервере и общие для всех клиентов.

## Стек технологий

**Frontend**
- Vite, React 19, TypeScript
- React Router
- Redux Toolkit
- SCSS + CSS Modules (без UI-библиотек)

**Backend**
- Node.js, Express, TypeScript
- SQLite
- JWT-авторизация
- Multer (загрузка изображений товаров)

**Запуск**
- Docker Compose (фронт + API)

## Ролевая модель

| Роль | Доступ |
|------|--------|
| **Неавторизованный пользователь (guest)** | Только каталог (`/catalog`), вход (`/login`) и регистрация (`/register`). Стартовая страница — `/catalog`. Карточка товара, корзина и остальные разделы недоступны — при попытке перехода выполняется редирект на `/login`. В шапке: «Каталог», «Корзина» (ведёт на `/login`), «Авторизоваться». |
| **user** | Каталог, страница товара, корзина, mock-оплата, отзывы, профиль |
| **admin** | Каталог, CRUD товаров (добавление, редактирование, удаление). Корзины и оплаты нет |

Защита маршрутов реализована компонентом `RequireAuth` (`src/ui/RequireAuth`).

### Тестовые аккаунты

| Логин | Пароль | Роль |
|-------|--------|------|
| `user` | `user123` | user |
| `admin` | `123` | admin |

## Страницы приложения

| Маршрут | Страница | Доступ |
|---------|----------|--------|
| `/` | Редирект на `/catalog` | все |
| `/catalog` | Каталог товаров | все |
| `/login` | Вход | все |
| `/register` | Регистрация | все |
| `/product/:id` | Карточка товара | авторизованные |
| `/product/:id/edit` | Редактирование товара | admin |
| `/product/:id/reviews` | Отзывы о товаре | авторизованные |
| `/add-product` | Добавление товара | admin |
| `/cart` | Корзина | авторизованные (не admin) |
| `/payment` | Оплата (mock) | авторизованные (не admin) |
| `/profile` | Профиль пользователя | авторизованные |

## Функциональность

- Регистрация и вход (JWT-токен в `localStorage`)
- Ролевая модель: guest / user / admin
- Каталог товаров с общим API
- Корзина (Redux, только для user)
- Mock-оплата заказа
- Профиль: email, логин, пароль, роль
- Отзывы: оценка 1–5 и комментарий
- Admin: CRUD товаров (создание, редактирование, удаление, загрузка фото)
- Валидация форм с отображением ошибок под полями (регистрация, вход, товар, оплата, отзыв)

## Структура проекта

```
practic/
├── src/                        # Frontend
│   ├── pages/                  # Страницы приложения
│   ├── ui/                     # UI-компоненты (ProductImage, StarRating, RequireAuth)
│   ├── widgets/                # Виджеты (Header, Layout, ProductCard, CartItemRow)
│   ├── store/                  # Redux slices (auth, cart, products)
│   ├── api/                    # HTTP-клиент и запросы к API
│   ├── hooks/                  # React-хуки
│   ├── types/                  # TypeScript-типы
│   ├── utils/                  # Утилиты (formatPrice, validation)
│   └── styles/                 # Глобальные стили (global.scss)
├── server/                     # Backend (Express + SQLite)
│   └── src/
│       ├── routes/
│       └── middleware/
├── docker-compose.yml
├── Dockerfile                  # Сборка фронта (nginx)
└── nginx.conf
```

### Стили

Стили компонентов и страниц — **CSS Modules** (`*.module.scss`):

```tsx
import styles from './Component.module.scss';

<div className={styles['block-name']} />
```

Глобальные переменные и reset — в `src/styles/global.scss`.

## Запуск через Docker (рекомендуется)

Требуется установленный **Docker Desktop**.

```bash
docker compose up --build
```

Приложение: **http://localhost:8080**

Остановка:

```bash
docker compose down
```

Файл `.env` не нужен — переменные заданы в `docker-compose.yml`.

## Локальная разработка (без Docker)

### 1. Установка зависимостей

```bash
npm install
npm install --prefix server
```

### 2. Запуск API

```bash
npm run dev:server
```

API: **http://localhost:3001**

### 3. Запуск фронтенда

```bash
npm run dev
```

Сайт: **http://localhost:5173** (прокси `/api` и `/uploads` на бэкенд)

## Сборка

```bash
npm run build
npm run build --prefix server
```

## API (основные эндпоинты)

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/auth/me` | Текущий пользователь |
| GET | `/api/products` | Список товаров |
| POST | `/api/products` | Создать товар (admin) |
| PUT | `/api/products/:id` | Обновить товар (admin) |
| DELETE | `/api/products/:id` | Удалить товар (admin) |
| GET | `/api/products/:id/reviews` | Отзывы товара |
| POST | `/api/products/:id/reviews` | Оставить отзыв |
| GET | `/api/health` | Проверка API |

## Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run dev` | Фронтенд (Vite) |
| `npm run dev:server` | Бэкенд (Express) |
| `npm run build` | Сборка фронтенда |
| `npm run build:server` | Сборка бэкенда |
| `npm run lint` | Линтер (oxlint) |
| `npm run docker:up` | Docker Compose up --build |
| `npm run docker:down` | Остановка контейнеров |

## Репозиторий

https://github.com/Andrey1KA/practice-shop.git
