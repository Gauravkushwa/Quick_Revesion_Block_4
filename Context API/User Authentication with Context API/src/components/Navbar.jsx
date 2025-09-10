import React, { useContext } from 'react'
import { AuthContext, AuthProvider } from '../contexts/AuthProvider'
import Main from './Main'
import Footer from './Footer'

const Navbar = () => {
    const {auth, setAuth} = useContext(AuthContext)
  return (
    <div>
      <button onClick={() => setAuth(auth === false ? true : false)}>{auth ? "LogOut" : "LogIn"}</button>
      <Main />
      <Footer />
    </div>
  )
}

export default Navbar
