import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../App.css'

const Navbar = () => {
  return (
   <nav>
    <NavLink to="/">Home </NavLink>
    <Link to="/about">About </Link>
    
   </nav>
  )
}

export default Navbar
