import { useState } from 'react'

import './App.css'
import GrandParent from './components/GrandParent'
import { APIProvider, DataContext } from './contexts/APIProvider'
import ContextConsume from './components/ContextConsume'

function App() {
  const [name, setName] = useState("Seet")

  return (
    <>
      {/* <h1>Prop Drilling</h1>
      <GrandParent name={name} /> */}
      
     <h1>API Context </h1>
     <APIProvider>
        <ContextConsume />
     </APIProvider>
    </>
  )
}

export default App
