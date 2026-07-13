import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';
import Profile from './components/profile';
import Socialicons from './components/Socialicons';

const NavigationBar = ({ isOpen, closeMenu }) => {
  const handleLinkClick = () => {
    if (isOpen) {
      closeMenu();
    }
  };

  const handleOutsideClick = (event) => {
    if (isOpen && !event.target.closest('.navbar')) {
      closeMenu();
    }
  };

  return (
    <div className='nave-and-logo'>
     
   
        
    <nav className={`navbar ${isOpen ? 'open' : ''}`} onClick={handleOutsideClick}>
     <div className='social-profile'> 
        <Profile />
        </div> 
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        
        <li>
          <NavLink to="/" onClick={handleLinkClick}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/about" onClick={handleLinkClick}>About</NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={handleLinkClick}>Contact</NavLink>
        </li>
        <li id='login-signup'>
          <NavLink to="/allitems" onClick={handleLinkClick}>For Free</NavLink>
        </li>
        <li id='login-signup'>
          <NavLink to="/login" onClick={handleLinkClick}>Login</NavLink>
        </li>
        <li>
          <NavLink to="/signup" onClick={handleLinkClick}>Signup</NavLink>
        </li>

        
      </ul>
      
    </nav>
    </div>
  );
};

export default NavigationBar;
