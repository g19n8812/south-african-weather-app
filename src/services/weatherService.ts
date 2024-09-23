import { WeatherData, Location } from '../types/weather';

const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.example.com/weather';

export async function fetchWeatherData(location: string | Location): Promise<WeatherData[]> {
  let url: string;

  if (typeof location === 'string') {
    url = `${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric&cnt=10`;
  } else {
    url = `${BASE_URL}?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&cnt=10`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    const data = await response.json();
    
    // Parse the API response and return WeatherData[]
    // This is a placeholder implementation. You'll need to adjust it based on the actual API response structure
    return data.list.map((day: any) => ({
      date: new Date(day.dt * 1000).toLocaleDateString(),
      temp: Math.round(day.temp.day),
      description: day.weather[0].description
    }));
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}