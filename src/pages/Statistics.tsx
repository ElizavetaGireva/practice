import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getStatistics,
  StatisticsResponse,
  GraphInfoItem,
} from "@/services/statisticsService";
import { useTelegram } from "@/hooks/useTelegram";
import { getUser, User as AppUser } from "@/services/userService";

const timePeriods = [
  { key: "week", label: "За неделю", days: 7 },
  { key: "month", label: "За месяц", days: 30 },
  { key: "year", label: "За год", days: 365 },
  { key: "all", label: "За все время", days: 365 * 2 },
];

export default function Statistics() {
  const { telegramId } = useTelegram();
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Загрузка данных пользователя
  useEffect(() => {
    if (!telegramId) {
      setUserError("Telegram ID не определен");
      setUserLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await getUser(telegramId);
        setUserData(user);
        setUserError(null);
      } catch (err) {
        setUserError("Ошибка загрузки данных пользователя");
        console.error(err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [telegramId]);

  // Получение дат для выбранного периода
  const getDateRange = (periodKey: string) => {
    const now = new Date();
    const period =
      timePeriods.find((p) => p.key === periodKey) || timePeriods[0];

    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - period.days);
    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
  };

  // Загрузка статистики
  useEffect(() => {
    if (userLoading) return;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);

        const { startDate, endDate } = getDateRange(selectedPeriod);
        const data = await getStatistics(
          startDate.toISOString(),
          endDate.toISOString(),
        );

        setStats(data);
      } catch (err) {
        setStatsError("Не удалось загрузить статистику");
        console.error("Ошибка загрузки статистики:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [selectedPeriod, userLoading]);

  // Преобразование данных для графика
  const getChartData = () => {
    if (!stats || !stats.graphInfo || stats.graphInfo.length === 0) return [];

    const sortedData = [...stats.graphInfo].sort(
      (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime(),
    );

    return sortedData.map((item) => item.count);
  };

  const currentData = getChartData();

  // Расчет min/max для графика
  let maxValue = 1;
  let minValue = 0;

  if (currentData.length > 0) {
    maxValue = Math.max(...currentData, 1);
    minValue = Math.min(...currentData, 0);
  }

  const padding = (maxValue - minValue) * 0.1;
  const chartMax = maxValue + padding;
  const chartMin = Math.max(0, minValue - padding);

  // Подписи оси X
  const getXAxisLabels = () => {
    if (!stats || !stats.graphInfo) return [];

    const sortedData = [...stats.graphInfo].sort(
      (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime(),
    );

    return sortedData.map((item) => {
      const date = new Date(item.day);

      switch (selectedPeriod) {
        case "week":
          return ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()];
        case "month":
          return date.getDate().toString();
        default:
          return new Intl.DateTimeFormat("ru-RU", {
            day: "numeric",
            month: "short",
          }).format(date);
      }
    });
  };

  const xLabels = getXAxisLabels();

  // Генерация плавного пути для графика
  const generateSmoothPath = (data: number[]) => {
    if (data.length === 0) return "";

    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: ((chartMax - value) / (chartMax - chartMin)) * 100,
    }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
      const cp2y = curr.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Среднее значение
  const averageRequests =
    currentData.length > 0
      ? Math.round(currentData.reduce((a, b) => a + b, 0) / currentData.length)
      : 0;

  // Определение роли пользователя
  const userRole = (userData?.role || "user") as "admin" | "user";

  return (
    <Layout userRole={userRole}>
      <div className="h-full flex flex-col">
        {/* Шапка с выбором периода */}
        <div className="bg-white border-b border-app-border-light px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            {timePeriods.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  selectedPeriod === period.key
                    ? "bg-app-accent text-white"
                    : "text-app-text-light hover:text-app-text hover:bg-gray-100 border border-app-border",
                )}
                disabled={statsLoading}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Основное содержимое */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Состояния загрузки и ошибок */}
          {userError ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {userError}
            </div>
          ) : statsError ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {statsError}
            </div>
          ) : userLoading || statsLoading ? (
            <div className="h-full flex items-center justify-center">
              <p>
                {userLoading
                  ? "Загрузка данных пользователя..."
                  : "Загрузка статистики..."}
              </p>
            </div>
          ) : (
            <>
              {/* График */}
              <div className="bg-white rounded-xl border border-app-border-light shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp size={20} className="text-app-accent" />
                  <h3 className="text-lg font-semibold text-app-text">
                    Запросы в чат
                  </h3>
                </div>

                <div className="relative">
                  {/* Ось Y */}
                  <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 -rotate-90">
                    <span className="text-sm text-app-text-light whitespace-nowrap">
                      Количество запросов
                    </span>
                  </div>

                  {/* Область графика */}
                  <div className="ml-16 mb-8">
                    {/* Шкала оси Y */}
                    <div className="flex flex-col-reverse justify-between h-64 absolute -ml-12 text-sm text-app-text-light">
                      <span>{Math.round(chartMin)}</span>
                      <span>
                        {Math.round(chartMin + (chartMax - chartMin) * 0.25)}
                      </span>
                      <span>
                        {Math.round(chartMin + (chartMax - chartMin) * 0.5)}
                      </span>
                      <span>
                        {Math.round(chartMin + (chartMax - chartMin) * 0.75)}
                      </span>
                      <span>{Math.round(chartMax)}</span>
                    </div>

                    {/* SVG график */}
                    <div className="relative h-64 bg-gray-50/30 rounded-lg border border-gray-100">
                      <svg
                        width="100%"
                        height="100%"
                        className="absolute inset-0"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {/* Горизонтальные линии сетки */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="#f1f5f9"
                            strokeWidth="0.5"
                          />
                        ))}

                        {/* Вертикальные линии сетки */}
                        {currentData.map((_, index) => {
                          const x = (index / (currentData.length - 1)) * 100;
                          return (
                            <line
                              key={index}
                              x1={x}
                              y1="0"
                              x2={x}
                              y2="100"
                              stroke="#f8fafc"
                              strokeWidth="0.5"
                            />
                          );
                        })}

                        {/* Линия графика */}
                        <path
                          d={generateSmoothPath(currentData)}
                          fill="none"
                          stroke="#fcac22"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ vectorEffect: "non-scaling-stroke" }}
                        />
                      </svg>
                    </div>

                    {/* Подписи оси X */}
                    <div className="flex justify-between mt-4 text-sm text-app-text-light px-2">
                      {xLabels.map((label, index) => (
                        <span key={index} className="text-center">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Подпись оси X */}
                  <div className="text-center mt-2">
                    <span className="text-sm text-app-text-light">
                      {selectedPeriod === "week" ? "Дни недели" : "Дни"}
                    </span>
                  </div>
                </div>

                {/* Легенда */}
                <div className="flex items-center justify-center space-x-4 text-sm text-app-text-light mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-app-accent rounded" />
                    <span>Запросы в чат от всех пользователей</span>
                  </div>
                </div>
              </div>

              {/* Общая информация */}
              <div className="bg-white rounded-xl border border-app-border-light shadow-sm p-6">
                <h3 className="text-lg font-semibold text-app-text mb-2">
                  Общая информация
                </h3>
                <p className="text-app-text">
                  Уникальных пользователей за период:{" "}
                  <span className="font-bold text-app-accent">
                    {stats?.uniqueUserInPeriod || 0}
                  </span>
                </p>
                <p className="text-app-text mt-1">
                  Средняя активность:{" "}
                  <span className="font-bold text-app-accent">
                    {averageRequests}
                  </span>{" "}
                  запросов в день
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
