import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Stopwatch from './StopWatch'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1>Stop Watch </h1>
     <Stopwatch />
    </>
  )
}

export default App
