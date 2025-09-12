import React from 'react'
import { useState } from 'react'
import './style.css'

const Weather = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");


  return (
    <div>
      {/* <input type="text" /> */}
    </div>
  )
}

export default Weather
