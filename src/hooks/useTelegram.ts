declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData?: string; // Опциональное свойство
      };
    };
  }
}

import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [telegramId, setTelegramId] = useState<string | null>(null);

  useEffect(() => {
    // Telegram WebView передает данные через window.Telegram.WebApp.initData
    if (window.Telegram?.WebApp?.initData) {
      const initData = new URLSearchParams(window.Telegram.WebApp.initData);
      const userData = initData.get('user');
      if (userData) {
        const user = JSON.parse(userData);
        setTelegramId(user.id.toString());
      }
    }
  }, []);

  return { telegramId };
};