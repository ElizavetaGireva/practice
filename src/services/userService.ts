import { apiInstance } from '../lib/api';

export interface User {
  id: number;
  telegram_id: string;
  role_id: number;
  is_active: boolean;
  name: string;
  surname: string;
  position: string;
  email: string;
  workPhone: string;
  personalPhone: string;
  role: string; // Добавляем новое поле
}


export const getUser = async (telegramId: string): Promise<User> => {
  const url = '/users/' + telegramId;
  const response = await apiInstance.get(url);
  const userData = response.data;

  // Преобразуем role_id в строковое значение
  const role = userData.role_id === 1 ? 'admin' : 'user';
  console.log(userData);
  return {
    ...userData,
    role, // Добавляем вычисленную роль
  };
};