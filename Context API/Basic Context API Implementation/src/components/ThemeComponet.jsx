import React, { useContext } from 'react'
import { ThemeContext, ThemeProvider } from '../contexts/ThemeContext'

const ThemeComponet = () => {
    const {theme, setTheme} = useContext(ThemeContext);
  return (
    <div>
      <div style={{height: "250px",marginLeft:"10%", color: theme === "dark" ? "#F5F6FA" : "#2D3436",
          backgroundColor: theme === "dark" ? "#2D3436" : "#F5F6FA",}}>
        <h1>Change Theme </h1>
      </div>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark" )}>Change Theme </button>
    </div>
  )
}

export default ThemeComponet