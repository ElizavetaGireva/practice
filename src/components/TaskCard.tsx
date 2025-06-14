import React, { useState } from "react";
import {
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  Check,
} from "lucide-react";
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

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

const statusConfig = {
  pending: {
    label: "В ожидании",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  "in-progress": {
    label: "В работе",
    icon: AlertCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  completed: {
    label: "Завершено",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
};

const priorityConfig = {
  low: { label: "Низкий", color: "text-gray-600", bg: "bg-gray-100" },
  medium: { label: "Средний", color: "text-app-accent", bg: "bg-orange-50" },
  high: { label: "Высокий", color: "text-red-600", bg: "bg-red-50" },
};

export function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      if (task.status === "pending") {
        onStatusChange(task.id, "in-progress");
      } else if (task.status === "in-progress") {
        onStatusChange(task.id, "completed");
      }
    }
  };

  const getActionButton = () => {
    if (task.status === "completed") return null;

    const buttonConfig = {
      pending: {
        label: "Взять в работу",
        icon: Play,
        className: "bg-blue-500 hover:bg-blue-600 text-white",
      },
      "in-progress": {
        label: "Завершить",
        icon: Check,
        className: "bg-green-500 hover:bg-green-600 text-white",
      },
    };

    const config = buttonConfig[task.status as keyof typeof buttonConfig];
    if (!config) return null;

    const ActionIcon = config.icon;

    return (
      <button
        onClick={handleActionClick}
        className={cn(
          "flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          config.className,
        )}
      >
        <ActionIcon size={14} />
        <span>{config.label}</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-app-border-light shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="cursor-pointer" onClick={onClick}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={cn(
                "inline-block px-2 py-1 text-xs font-medium rounded-full",
                priority.color,
                priority.bg,
              )}
            >
              {priority.label}
            </span>
            <span className="text-xs text-app-text-light">{task.category}</span>
          </div>

          <div
            className={cn(
              "flex items-center px-2 py-1 rounded-full text-xs font-medium",
              status.color,
              status.bg,
            )}
          >
            <StatusIcon size={12} className="mr-1" />
            {status.label}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-base font-semibold text-app-text mb-2 line-clamp-1">
          {task.title}
        </h3>

        <div className="mb-4">
          <p
            className={cn(
              "text-sm text-app-text-light",
              isExpanded ? "" : "line-clamp-2",
            )}
          >
            {task.description}
          </p>

          {task.description.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-app-accent text-sm font-medium hover:text-app-primary transition-colors mt-1"
            >
              {isExpanded ? "Скрыть" : "Показать полностью"}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-app-text-light">
          <div className="flex items-center">
            <User size={12} className="mr-1" />
            {task.assignee}
          </div>

          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            {task.dueDate}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {getActionButton() && (
        <div className="mt-3 pt-3 border-t border-app-border-light flex justify-end">
          {getActionButton()}
        </div>
      )}
    </div>
  );
}
