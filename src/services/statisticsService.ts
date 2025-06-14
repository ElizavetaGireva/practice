import { apiInstance } from '../lib/api';

export interface GraphInfoItem {
  day: string;
  count: number;
}

export interface StatisticsResponse {
  graphInfo: GraphInfoItem[];
  uniqueUserInPeriod: number;
}

export const getStatistics = async (startDate: string, endDate: string): Promise<StatisticsResponse> => {
  const url = '/statistics/graph';
  const response = await apiInstance.post(url, {
    startDate,
    endDate
  });
  return response.data;
};