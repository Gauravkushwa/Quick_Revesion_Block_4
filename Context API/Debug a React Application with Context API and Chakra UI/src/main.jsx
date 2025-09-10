import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import { AuthContext, AuthContextProvider } from './contexts/AuthContext.jsx'
import { ThemeContext, ThemeContextProvider } from './contexts/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <AuthContextProvider>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </AuthContextProvider>
  </ChakraProvider>
)
