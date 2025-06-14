import React from "react";
import { Layout } from "@/components/Layout";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <Layout userRole="admin">
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <User size={64} className="text-app-accent mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-app-text mb-2">Профиль</h2>
          <p className="text-app-text-light mb-4">
            Здесь будет отображаться личная информация пользователя и
            статистика.
          </p>
          <div className="bg-white rounded-xl border border-app-border-light p-6 max-w-md">
            <h3 className="font-medium text-app-text mb-2">
              Планируемый функционал:
            </h3>
            <ul className="text-sm text-app-text-light space-y-1 text-left">
              <li>• Личная информация</li>
              <li>• Статистика активности</li>
              <li>• Настройки аккаунта</li>
              <li>• История действий</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
