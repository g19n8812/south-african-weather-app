import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { fetchWeatherData } from '../services/weatherService';
import { getUserLocation } from '../utils/geolocation';
import '../styles/WeatherApp.css';

const WeatherApp: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleInitialLoad();
  }, []);

  const handleInitialLoad = async () => {
    try {
      const userLocation = await getUserLocation();
      await fetchWeatherForLocation(userLocation);
    } catch (error) {
      setError('Unable to retrieve your location. Please search for a location.');
      setLoading(false);
    }
  };

  const fetchWeatherForLocation = async (searchLocation: string | { latitude: number; longitude: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(searchLocation);
      setWeatherData(data);
      setLocation(typeof searchLocation === 'string' ? searchLocation : 'Current Location');
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      fetchWeatherForLocation(location);
    }
  };

  const getWeatherIcon = (description: string) => {
    // Map weather descriptions to emoji icons
    const iconMap: { [key: string]: string } = {
      'clear sky': '☀️',
      'few clouds': '🌤️',
      'scattered clouds': '☁️',
      'broken clouds': '☁️',
      'shower rain': '🌧️',
      'rain': '🌧️',
      'thunderstorm': '⛈️',
      'snow': '❄️',
      'mist': '🌫️'
    };
    return iconMap[description.toLowerCase()] || '🌡️';
  };

  return (
    <div className="weather-app">
      <h1 className="app-title">South African Weather App</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p className="loading">Loading weather data...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="weather-container">
          <h2 className="location-title">{location}</h2>
          {weatherData.map((day, index) => (
            <div key={index} className="weather-card">
              <h3 className="date">{day.date}</h3>
              <p className="temperature">{day.temp}°C</p>
              <p className="description">
                {getWeatherIcon(day.description)} {day.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;