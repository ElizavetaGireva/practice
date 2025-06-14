import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Newspaper, CheckSquare, Users, User, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  userRole: "admin" | "user";
}

export function TabNavigation({ userRole }: TabNavigationProps) {
  const location = useLocation();

  const userTabs = [
    { path: "/news", label: "Новости", icon: Newspaper },
    { path: "/tasks", label: "Задачи", icon: CheckSquare },
    { path: "/employees", label: "Структура", icon: Users },
    { path: "/account", label: "Профиль", icon: User },
  ];

  const adminTabs = [
    { path: "/news", label: "Новости", icon: Newspaper },
    { path: "/tasks", label: "Задачи", icon: CheckSquare },
    { path: "/employees", label: "Структура", icon: Users },
    { path: "/statistics", label: "Статистика", icon: BarChart3 },
    { path: "/account", label: "Профиль", icon: User },
  ];

  const tabs = userRole === "admin" ? adminTabs : userTabs;

  return (
    <nav className="flex items-center justify-around py-2">
      {tabs.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;

        return (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1",
              isActive
                ? "text-app-accent"
                : "text-app-text-light hover:text-app-primary",
            )}
          >
            <Icon
              size={20}
              className={cn("mb-1", isActive && "text-app-accent")}
            />
            <span
              className={cn(
                "text-xs font-medium truncate",
                isActive && "text-app-accent",
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
