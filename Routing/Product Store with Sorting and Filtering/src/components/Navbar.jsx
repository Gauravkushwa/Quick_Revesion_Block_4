import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ background: '#eee', padding: '10px' }}>
    <Link to="/">Home</Link>
  </nav>
);

export default Navbar;
