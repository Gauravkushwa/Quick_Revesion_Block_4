import './App.css'
import ThemeComponet from './components/ThemeComponet'
import { ThemeContext, ThemeProvider } from './contexts/ThemeContext'

function App() {

  return (
    <>
    <ThemeProvider>
        <ThemeComponet />
    </ThemeProvider>

    </>
  )
}

export default App
