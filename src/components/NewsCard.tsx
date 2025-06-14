import React, { useState } from "react";
import { ChevronDown, Clock, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
}

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    summary: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
    category: string;
  };
  onLike: () => Promise<void>; // Добавьте это
}

export function NewsCard({ news }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news.likes);

  return (
    <div className="bg-white rounded-xl border border-app-border-light shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-app-accent/10 text-app-accent rounded-full">
            {news.category}
          </span>
          <div className="flex items-center text-app-text-light text-xs">
            <Clock size={12} className="mr-1" />
            {news.date}
          </div>
        </div>

        <h3 className="text-base font-semibold text-app-text mb-2 line-clamp-2">
          {news.title}
        </h3>

        <p className="text-sm text-app-text-light mb-3 line-clamp-2">
          {news.summary}
        </p>

        {/* Interaction Area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-app-text-light text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
                setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
              }}
              className={cn(
                "flex items-center space-x-1 transition-colors",
                isLiked ? "text-red-500" : "hover:text-red-500",
              )}
            >
              <Heart size={14} className={isLiked ? "fill-current" : ""} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
              <MessageCircle size={14} />
              <span>{news.comments}</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-app-accent text-sm font-medium hover:text-app-primary transition-colors"
          >
            {isExpanded ? "Скрыть" : "Читать далее"}
            <ChevronDown
              size={16}
              className={cn(
                "ml-1 transform transition-transform",
                isExpanded && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-app-border-light bg-gray-50/50">
          <div className="pt-4">
            <p className="text-sm text-app-text leading-relaxed whitespace-pre-line">
              {news.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
