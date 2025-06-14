import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
}

const priorityLevels = [
  { key: "low", label: "Низкий", value: 0 },
  { key: "medium", label: "Средний", value: 1 },
  { key: "high", label: "Высокий", value: 2 },
];

export function AddTaskModal({ isOpen, onClose, onSave }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 1, // medium by default
    assignmentType: "me", // "me" or "colleagues"
    category: "Общее",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    const priorityKey = priorityLevels[formData.priority].key as
      | "low"
      | "medium"
      | "high";

    const newTask: Omit<Task, "id"> = {
      title: formData.title,
      description: formData.description,
      priority: priorityKey,
      status: formData.assignmentType === "me" ? "in-progress" : "pending",
      assignee: formData.assignmentType === "me" ? "Я" : "Команда",
      dueDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("ru-RU"),
      category: formData.category,
    };

    onSave(newTask);

    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: 1,
      assignmentType: "me",
      category: "Общее",
    });

    onClose();
  };

  const handlePriorityChange = (value: number) => {
    setFormData((prev) => ({ ...prev, priority: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" style={{ paddingBottom: '64px' }}>
      <div className="bg-white w-full max-w-md rounded-t-xl" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="p-4 border-b border-app-border-light">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-app-text">
              Добавить задачу
            </h3>
            <button
              onClick={onClose}
              className="text-app-text-light hover:text-app-text transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Название задачи *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Введите название задачи"
              className="w-full px-3 py-2 border border-app-border rounded-lg text-app-text placeholder-app-text-light focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Описание задачи *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Опишите задачу подробно"
              rows={3}
              className="w-full px-3 py-2 border border-app-border rounded-lg text-app-text placeholder-app-text-light focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Priority Buttons */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Приоритет
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityLevels.map((level) => (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => handlePriorityChange(level.value)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    formData.priority === level.value
                      ? level.key === "low"
                        ? "bg-green-500 text-white"
                        : level.key === "medium"
                          ? "bg-app-accent text-white"
                          : "bg-red-500 text-white"
                      : "bg-gray-100 text-app-text-light hover:bg-gray-200",
                  )}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assignment Type */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Тип задачи
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, assignmentType: "me" }))
                }
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  formData.assignmentType === "me"
                    ? "bg-app-accent text-white"
                    : "bg-gray-100 text-app-text-light hover:bg-gray-200",
                )}
              >
                На меня
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    assignmentType: "colleagues",
                  }))
                }
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  formData.assignmentType === "colleagues"
                    ? "bg-app-accent text-white"
                    : "bg-gray-100 text-app-text-light hover:bg-gray-200",
                )}
              >
                Для коллег
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-app-border rounded-lg text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent"
            >
              <option value="Общее">Общее</option>
              <option value="Продажи">Продажи</option>
              <option value="Разработка">Разработка</option>
              <option value="Маркетинг">Маркетинг</option>
              <option value="HR">HR</option>
              <option value="Администрирование">Администрирование</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-app-accent text-white py-3 px-4 rounded-lg font-medium hover:bg-app-accent/90 transition-colors flex items-center justify-center space-x-2"
            >
              <Save size={18} />
              <span>Создать задачу</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
