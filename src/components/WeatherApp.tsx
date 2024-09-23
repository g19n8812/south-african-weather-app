import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { fetchWeatherData } from '../services/weatherService';
import { getUserLocation } from '../utils/geolocation';

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

  return (
    <div>
      <h1>South African Weather App</h1>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading weather data...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          {weatherData.map((day, index) => (
            <div key={index}>
              <h2>{day.date}</h2>
              <p>Temperature: {day.temp}°C</p>
              <p>Description: {day.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;