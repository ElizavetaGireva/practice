import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { FilterInput } from "@/components/FilterInput";
import { NewsCard } from "@/components/NewsCard";
import { getNews, NewsItem } from "@/services/newsService";
import { useTelegram } from "@/hooks/useTelegram";
import { getUser, User as AppUser } from "@/services/userService";

export default function News() {
  const { telegramId } = useTelegram();
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Загрузка данных пользователя
  useEffect(() => {
    if (telegramId) {
      const fetchUser = async () => {
        try {
          const user = await getUser(telegramId);
          setUserData(user);
        } catch (err) {
          setUserError("Ошибка загрузки данных пользователя");
          console.error(err);
        } finally {
          setUserLoading(false);
        }
      };
      fetchUser();
    } else {
      setUserLoading(false);
    }
  }, [telegramId]);

  // Загрузка новостей
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNews(10, 0);
        setNews(response.items);
      } catch (err) {
        setNewsError("Не удалось загрузить новости");
        console.error("Ошибка загрузки новостей:", err);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Функция для обработки лайков
  const handleLike = async (newsId: number) => {
    try {
      // Оптимистичное обновление UI
      setNews(prevNews =>
        prevNews.map(item =>
          item.id === newsId ? { ...item, likes: item.likes + 1 } : item
        )
      );

      // Отправка запроса к API (заглушка - реализуйте вашу функцию likeNews)
      // await likeNews(newsId);
    } catch (err) {
      // Откат изменений при ошибке
      setNews(prevNews =>
        prevNews.map(item =>
          item.id === newsId ? { ...item, likes: item.likes - 1 } : item
        )
      );
      console.error("Ошибка при лайке:", err);
    }
  };

  // Фильтрация новостей
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Форматирование даты
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  // Обработка состояний загрузки пользователя
  if (userLoading) {
    return (
      <Layout userRole={(userData?.role || "user") as "admin" | "user"}>
        <div className="h-full flex items-center justify-center">
          <p>Загрузка данных пользователя...</p>
        </div>
      </Layout>
    );
  }

  if (userError) {
    return (
      <Layout userRole={(userData?.role || "user") as "admin" | "user"}>
        <div className="h-full flex items-center justify-center">
          <p className="text-red-500">{userError}</p>
        </div>
      </Layout>
    );
  }

  // Обработка состояний загрузки новостей
  if (newsLoading) {
    return (
      <Layout userRole={(userData?.role || 'user') as 'admin' | 'user'}>
        <div className="h-full flex items-center justify-center">
          <p>Загрузка новостей...</p>
        </div>
      </Layout>
    );
  }

  if (newsError) {
    return (
      <Layout userRole={(userData?.role || 'user') as 'admin' | 'user'}>
        <div className="h-full flex items-center justify-center">
          <p className="text-red-500">{newsError}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={(userData?.role || "user") as "admin" | "user"}>
      <div className="h-full flex flex-col">
        {/* Шапка с поиском */}
        <div className="bg-white border-b border-app-border-light px-4 py-4">
          <FilterInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск новостей..."
          />
        </div>

        {/* Список новостей */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <NewsCard
                  key={item.id}
                  news={{
                    id: item.id.toString(),
                    title: item.title,
                    summary: item.summary,
                    content: item.content,
                    date: formatDate(item.date),
                    likes: item.likes,
                    comments: item.comments || 0,
                    category: item.category || "Общее",
                  }}
                  onLike={() => handleLike(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-app-text-light">
                  {searchQuery ? "Ничего не найдено" : "Новостей пока нет"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}