
import React from 'react';
import { WeatherData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CloudRain, Sun } from 'lucide-react';

interface WeatherProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

const Weather: React.FC<WeatherProps> = ({ weatherData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <div className="flex items-center mt-2">
          <Skeleton className="h-16 w-16 rounded-full mr-4" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weather at Valle del Este</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-gray-400">
            <Sun className="w-12 h-12 mr-4 opacity-50" />
            <p>Weather data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Weather at Valle del Este</h3>
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          {weatherData.iconUrl ? (
            <img 
              src={weatherData.iconUrl} 
              alt={weatherData.condition} 
              className="w-16 h-16"
            />
          ) : (
            weatherData.condition?.includes('rain') ? (
              <CloudRain className="w-16 h-16 text-blue-500" />
            ) : (
              <Sun className="w-16 h-16 text-yellow-500" />
            )
          )}
        </div>
        <div>
          <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
          <p className="text-gray-600 capitalize">{weatherData.condition}</p>
          <p className="text-sm text-gray-500">Wind: {weatherData.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
