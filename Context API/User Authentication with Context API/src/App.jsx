import './App.css'
import Navbar from './components/Navbar'
import { AuthProvider } from './contexts/AuthProvider'

function App() {

  return (
    <>
    {/* <h1>Hello Devloper </h1>
     */}
     <AuthProvider>
      <Navbar />
     </AuthProvider>
    </>
  )
}

export default App
