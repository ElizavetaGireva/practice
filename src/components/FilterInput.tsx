import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FilterInput({
  value,
  onChange,
  placeholder = "Поиск...",
  className,
}: FilterInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        size={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-text-light"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-white border border-app-border rounded-xl text-app-text placeholder-app-text-light focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent"
      />
    </div>
  );
}
