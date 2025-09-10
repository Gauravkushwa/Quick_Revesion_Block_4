import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'

const Footer = () => {
    const {auth} = useContext(AuthContext)
  return (
    <div>
      <h2>{auth ? "Welcome, User ....!!!" : "Please LogIn First"}</h2>
    </div>
  )
}

export default Footer
