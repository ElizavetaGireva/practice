import axios from 'axios';

// Базовый URL вашего API (в продакшене замените на реальный)
const BASE_URL = 'https://api.et-bot.bytes2b.ru/api/v1';

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Можно добавить интерцепторы для обработки ошибок
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);