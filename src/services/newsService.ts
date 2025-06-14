import { apiInstance } from '../lib/api';

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
}

export interface NewsResponse {
  items: NewsItem[];
  total: number;
  limit: number;
  offset: number;
}

export const getNews = async (limit: number = 5, offset: number = 0): Promise<NewsResponse> => {
  const url = '/news?limit=' + limit + '&offset=' + offset;
  const response = await apiInstance.get(url);
  return response.data;
};

export const likeNews = async (newsId: number): Promise<{ news_id: number; new_likes: number }> => {
  const url = '/news/like/' + newsId;
  const response = await apiInstance.post(url);
  return response.data;
};

export const dislikeNews = async (newsId: number): Promise<{ news_id: number; new_likes: number }> => {
  const url = '/news/dislike/' + newsId;
  const response = await apiInstance.post(url);
  return response.data;
};
