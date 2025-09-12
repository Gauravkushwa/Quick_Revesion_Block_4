import React from 'react'
import { useState } from 'react'
import './style.css'

const Home = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");


    const fetchWeather = async () => {
        const API_KEY = "5575aa96161ccf48a282736af31b03b2";
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data = await res.json();
            console.log(data);
            setWeather(data);
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <>
            <div className="weather-app">
                <h1>Weather App</h1>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Please Enter Your City Name.."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button onClick={fetchWeather}>See Weather</button>
                </div>

                {weather && (
                    <div className="weather-card">
                        <h2>{Math.round(weather.main.temp)}°C</h2>
                        <p>{weather.weather[0].description}</p>
                        <ul>
                            <li>Humidity: <span>{weather.main.humidity}%</span></li>
                            <li>Pressure: <span>{weather.main.pressure} hPa</span></li>
                            <li>Wind Speed: <span>{weather.wind.speed} m/s</span></li>
                            <li>Feels Like: <span>{Math.round(weather.main.feels_like)}°C</span></li>
                        </ul>
                    </div>
                )}
            </div>

        </>
    )
}

export default Home
