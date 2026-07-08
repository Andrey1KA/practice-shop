import type { RegisteredUser } from '../types/auth';

const STORAGE_KEY = 'shop_mock_users';

export const defaultMockUsers: RegisteredUser[] = [
  {
    email: 'user@shop.local',
    login: 'user',
    password: 'user123',
    role: 'user',
    name: 'Пользователь',
  },
  {
    email: 'admin@shop.local',
    login: 'admin',
    password: '123',
    role: 'admin',
    name: 'Администратор',
  },
];

function mergeWithDefaultUsers(savedUsers: RegisteredUser[]) {
  const users = savedUsers.map((user) => ({
    ...user,
    login: user.login ?? user.email,
  }));

  defaultMockUsers.forEach((defaultUser) => {
    const userIndex = users.findIndex(
      (user) => user.email === defaultUser.email || user.login === defaultUser.login,
    );

    if (userIndex === -1) {
      users.push(defaultUser);
      return;
    }

    users[userIndex] = {
      ...users[userIndex],
      login: defaultUser.login,
      role: defaultUser.role,
      name: defaultUser.name,
      password: defaultUser.password,
    };
  });

  return users;
}

export function getMockUsers(): RegisteredUser[] {
  if (typeof localStorage === 'undefined') {
    return [...defaultMockUsers];
  }

  const savedUsers = localStorage.getItem(STORAGE_KEY);

  if (!savedUsers) {
    return [...defaultMockUsers];
  }

  try {
    return mergeWithDefaultUsers(JSON.parse(savedUsers) as RegisteredUser[]);
  } catch {
    return [...defaultMockUsers];
  }
}

export function saveMockUsers(users: RegisteredUser[]) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
