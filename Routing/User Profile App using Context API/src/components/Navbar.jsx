import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
    <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
    <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
    <Link to="/settings">Settings</Link>
  </nav>
);

export default Navbar;
