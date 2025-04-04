
import React from 'react';
import { WeatherData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

const Weather: React.FC<WeatherProps> = ({ weatherData, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weather at Valle del Este</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-24">
          <p>Loading weather data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weather at Valle del Este</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Weather data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weather at Valle del Este</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            {weatherData.iconUrl && (
              <img 
                src={weatherData.iconUrl} 
                alt={weatherData.condition} 
                className="w-16 h-16"
              />
            )}
          </div>
          <div>
            <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
            <p className="text-gray-600 capitalize">{weatherData.condition}</p>
            <p className="text-sm text-gray-500">Wind: {weatherData.windSpeed} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;
