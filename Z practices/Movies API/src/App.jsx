import {Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import MoviesDetails from './pages/MoviesDetails'

function App() {

  return (
    <>
      <h1>Movies Store API </h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/movies/:id' element={<MoviesDetails />} />
      </Routes>
    </>
  )
}

export default App
