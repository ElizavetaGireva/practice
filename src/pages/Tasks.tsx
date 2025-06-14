import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { FilterInput } from "@/components/FilterInput";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTelegram } from "@/hooks/useTelegram";
import { getUser, User as AppUser } from "@/services/userService";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee: string;
  category: string;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Подготовка презентации для клиента",
    description:
      "Создать презентацию для встречи с потенциальным клиентом ABC Corp. Включить финансовые показатели и примеры успешных проектов.",
    status: "in-progress" as const,
    priority: "high" as const,
    dueDate: "15.02.2024",
    assignee: "Анна Петрова",
    category: "Продажи",
  },
  {
    id: "2",
    title: "Обновление базы данных клиентов",
    description:
      "Провести аудит и обновление контактной информации в CRM системе. Удалить неактивные записи.",
    status: "pending" as const,
    priority: "medium" as const,
    dueDate: "20.02.2024",
    assignee: "Сергей Иванов",
    category: "Администрирование",
  },
  {
    id: "3",
    title: "Тестирование нового модуля",
    description:
      "Выполнить полное тестирование модуля аналитики перед релизом в продакшн.",
    status: "completed" as const,
    priority: "high" as const,
    dueDate: "10.02.2024",
    assignee: "Мария Сидорова",
    category: "Разработка",
  },
  {
    id: "4",
    title: "Подготовка отчета по маркетингу",
    description:
      "Составить ежемесячный отчет по маркетинговым активностям и ROI рекламных кампаний.",
    status: "in-progress" as const,
    priority: "medium" as const,
    dueDate: "25.02.2024",
    assignee: "Дмитрий Козлов",
    category: "Маркетинг",
  },
  {
    id: "5",
    title: "Организация тимбилдинга",
    description:
      "Спланировать и организовать корпоративное мероприятие для команды разработки.",
    status: "pending" as const,
    priority: "low" as const,
    dueDate: "05.03.2024",
    assignee: "Елена Волкова",
    category: "HR",
  },
];

const statusTabs = [
  { key: "all", label: "Все" },
  { key: "pending", label: "В ожидании" },
  { key: "in-progress", label: "В работе" },
  { key: "completed", label: "Завершено" },
];

const assignmentFilters = [
  { key: "all", label: "Все задачи" },
  { key: "fromMe", label: "От меня" },
  { key: "onMe", label: "На мне" },
];

export default function Tasks() {
  const { telegramId } = useTelegram();
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [tasks, setTasks] = useState(mockTasks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleStatusChange = (
    taskId: string,
    newStatus: "pending" | "in-progress" | "completed",
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const handleAddTask = (newTaskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || task.status === activeTab;

    let matchesAssignment = true;
    if (assignmentFilter === "fromMe") {
      // Tasks assigned by me (where I'm the creator/assigner)
      matchesAssignment = task.assignee !== "Я";
    } else if (assignmentFilter === "onMe") {
      // Tasks assigned to me
      matchesAssignment =
        task.assignee === "Я" || task.assignee === "Анна Петрова";
    }

    return matchesSearch && matchesStatus && matchesAssignment;
  });

  // Обработка состояний загрузки
  if (userLoading) {
    return (
      <Layout userRole="user">
        <div className="h-full flex items-center justify-center">
          <p>Загрузка данных пользователя...</p>
        </div>
      </Layout>
    );
  }

  if (userError) {
    return (
      <Layout userRole="user">
        <div className="h-full flex items-center justify-center">
          <p className="text-red-500">{userError}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={(userData?.role || 'user') as 'admin' | 'user'}>
      <div className="h-full flex flex-col">
        {/* Page Header */}
        <div className="bg-white border-b border-app-border-light px-4 py-4">
          <FilterInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск задач..."
          />

          {/* Assignment Filters and Add Button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2 flex-1 mr-4">
              {assignmentFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setAssignmentFilter(filter.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    assignmentFilter === filter.key
                      ? "bg-app-primary text-white"
                      : "text-app-text-light hover:text-app-text hover:bg-gray-100 border border-app-border",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-app-accent text-white p-2.5 rounded-lg hover:bg-app-accent/90 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white border-b border-app-border-light px-4 py-2">
          <div className="flex space-x-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "bg-app-accent text-white"
                    : "text-app-text-light hover:text-app-text hover:bg-gray-100",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => console.log("Task clicked:", task.id)}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-app-text-light">Задачи не найдены</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddTask}
        />
      </div>
    </Layout>
  );
}