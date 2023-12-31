import React, { useEffect, useState } from 'react';
import { TextField, Slide, CircularProgress } from '@mui/material';

import './App.scss';

interface WeatherData {
  name: string;
  weather: {
    main: string;
    icon: string;
  }[];
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };

  wind: {
    speed: number;
  };
}

function App() {
  const [cityName, setNameCity] = useState('Paris');
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState<WeatherData>({} as WeatherData);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=02aeb6cec098cc655b156d3084cd659b&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error('Erreur, Oups');
        }
      })
      .then((responseData: WeatherData) => {
        setData(responseData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cityName, error]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputElement = e.target as HTMLInputElement;
      setNameCity(inputElement.value);
      setInputText('');
    }
  };

  return (
    <div className="bg_img">
      {!loading ? (
        <>
          <TextField
            variant="filled"
            label="recherche de location"
            className="input"
            error={error}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearch}
          />
          <h1 className="city">{data.name}</h1>
          <div className="group">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="logo"
            />
            <h1>{data.weather[0].main}</h1>
          </div>
          <h1 className="temp">{data.main.temp.toFixed()} °C</h1>

          <Slide direction="right" timeout={900} in={!loading}>
            <div className="box_container">
              <div className="box">
                <p>Humidité</p>
                <h1>{data.main.humidity.toFixed()}%</h1>
              </div>

              <div className="box">
                <p>Vent</p>
                <h1>{data.wind.speed.toFixed()}km/h</h1>
              </div>

              <div className="box">
                <p>Ressenti</p>
                <h1>{data.main.feels_like.toFixed()}°C</h1>
              </div>
            </div>
          </Slide>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default App;
