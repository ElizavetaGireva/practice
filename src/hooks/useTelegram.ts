declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData?: string;
      };
    };
  }
}

import { useEffect, useState } from 'react';

// Константа для заглушки
const DEV_TELEGRAM_ID = '764381135';

export const useTelegram = () => {
  const [telegramId, setTelegramId] = useState<string | null>(null);

  useEffect(() => {
    // Режим разработки - используем заглушку, если Telegram WebApp не доступен
    if (typeof window.Telegram === 'undefined') {
      console.warn('Telegram WebApp not detected, using dev ID');
      setTelegramId(DEV_TELEGRAM_ID);
      return;
    }

    if (window.Telegram?.WebApp?.initData) {
      try {
        const initData = new URLSearchParams(window.Telegram.WebApp.initData);
        const userData = initData.get('user');
        if (userData) {
          const user = JSON.parse(userData);
          setTelegramId(user.id.toString());
        }
      } catch (e) {
        console.error('Error parsing Telegram initData', e);
        // В случае ошибки парсинга тоже используем заглушку
        setTelegramId(DEV_TELEGRAM_ID);
      }
    }
  }, []);

  return {
    telegramId,
    telegramParams: telegramId ? { telegram_id: telegramId } : null,
    isDevMode: telegramId === DEV_TELEGRAM_ID // Дополнительное поле для проверки режима разработки
  };
};