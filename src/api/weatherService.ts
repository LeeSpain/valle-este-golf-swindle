
import { WeatherData } from '@/types';
import { apiClient } from './apiClient';

export async function getWeather(): Promise<WeatherData> {
  return apiClient<WeatherData>('/weather');
}
