import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Phone, Mail, Briefcase } from "lucide-react";
import { getUser, User } from "@/services/userService";
import { useTelegram } from "@/hooks/useTelegram";

export default function Account() {
  const { telegramId } = useTelegram();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock statistics
  const statistics = {
    tasksCreated: 24,
    tasksInProgressAssignedToMe: 5,
    tasksInProgressFromMe: 8,
    tasksCompletedAssignedToMe: 18,
    tasksCompletedFromMe: 16,
  };

  // Загрузка данных пользователя
  useEffect(() => {
    if (!telegramId) {
      setError("Telegram ID не определен");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await getUser(telegramId);
        setUserData(data);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить данные пользователя");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [telegramId]);

  // Определяем роль пользователя для Layout
  const userRole = (userData?.role || "user") as "admin" | "user";

  return (
    <Layout userRole={userRole}>
      <div className="h-full overflow-y-auto">
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div>Загрузка данных профиля...</div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : userData ? (
            <>
              {/* User Profile Card */}
              <div className="bg-white rounded-xl border border-app-border-light shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-app-primary to-app-primary/80 px-6 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-app-accent rounded-full flex items-center justify-center">
                      <span className="text-app-primary text-2xl font-bold">
                        {userData.name
                          ? userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          : "?"}
                      </span>
                    </div>
                    <div className="text-white">
                      <h2 className="text-xl font-semibold">
                        {userData.name || "Имя не указано"}
                      </h2>
                      <p className="text-white/80 flex items-center mt-1">
                        <Briefcase size={16} className="mr-2" />
                        {userData.position || "Должность не указана"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone size={18} className="text-app-accent" />
                      <div>
                        <p className="text-sm text-app-text-light">
                          Личный телефон
                        </p>
                        <p className="text-app-text font-medium">
                          {userData.personalPhone || "Не указан"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone size={18} className="text-app-accent" />
                      <div>
                        <p className="text-sm text-app-text-light">
                          Рабочий телефон
                        </p>
                        <p className="text-app-text font-medium">
                          {userData.workPhone || "Не указан"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail size={18} className="text-app-accent" />
                      <div>
                        <p className="text-sm text-app-text-light">
                          Электронная почта
                        </p>
                        <p className="text-app-text font-medium">
                          {userData.email || "Не указан"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Usage Statistics */}
              <div className="bg-white rounded-xl border border-app-border-light shadow-sm p-6">
                <h3 className="text-lg font-semibold text-app-text mb-4">
                  Статистика использования приложения
                </h3>

                <div className="space-y-4">
                  {/* Tasks Created */}
                  <div className="flex items-center justify-between p-4 bg-app-accent/5 rounded-lg">
                    <div>
                      <p className="font-medium text-app-text">Создано задач</p>
                      <p className="text-sm text-app-text-light">
                        Всего созданных задач
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-app-accent">
                      {statistics.tasksCreated}
                    </span>
                  </div>

                  {/* Tasks In Progress */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="mb-2">
                        <span className="font-medium text-app-text">
                          В работе
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-app-text-light">У меня</p>
                          <p className="text-lg font-bold text-blue-600">
                            {statistics.tasksInProgressAssignedToMe}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-app-text-light">От меня</p>
                          <p className="text-lg font-bold text-blue-600">
                            {statistics.tasksInProgressFromMe}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="mb-2">
                        <span className="font-medium text-app-text">
                          Выполнено
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-app-text-light">У меня</p>
                          <p className="text-lg font-bold text-green-600">
                            {statistics.tasksCompletedAssignedToMe}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-app-text-light">От меня</p>
                          <p className="text-lg font-bold text-green-600">
                            {statistics.tasksCompletedFromMe}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              Данные пользователя не загружены
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}