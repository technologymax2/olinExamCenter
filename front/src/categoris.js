import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import './categoris.css';

function NavVer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState(''); // State to keep track of active page

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = (page) => {
    setActivePage(page);
  };

  return (
    <div>
      <div className={`navbar-btn`} onMouseEnter={toggleNav} onMouseLeave={toggleNav}>
        <button className='Category_title'><u>Categories</u></button>
      </div>
      <nav className={`topnav_v ${isOpen ? 'open' : ''}`}>
        <button className='Category_cancel' onClick={toggleNav}><u>X</u></button>
        <ul>
          <li>
            <label>
              
              <NavLink to="/Template">Templates <input type="checkbox" checked={activePage === '/Template'} onChange={() => handleNavLinkClick('/Template')} /></NavLink>
            </label>
          </li>
          <li>
            <label>
             
              <NavLink to="/Video">Videos  <input type="checkbox" checked={activePage === '/Video'} onChange={() => handleNavLinkClick('/Video')} /></NavLink>
            </label>
          </li>
          <li>
            <label>
              
              <NavLink to="/Image">Images <input type="checkbox" checked={activePage === '/Image'} onChange={() => handleNavLinkClick('/Image')} /></NavLink>
            </label>
          </li>
          <li>
            <label>
             
              <NavLink to="/Code">Codes   <input type="checkbox" checked={activePage === '/Code'} onChange={() => handleNavLinkClick('/Code')} /></NavLink>
            </label>
          </li>
          <li>
            <label>
              
              <NavLink to="/Audio">Audios <input type="checkbox" checked={activePage === '/Audio'} onChange={() => handleNavLinkClick('/Audio')} /></NavLink>
            </label>
          </li>
          <div className='for-free'>
            <li>
              <label>
                
                <NavLink to="/Allitems">For Free  <input type="checkbox" checked={activePage === '/Allitems'} onChange={() => handleNavLinkClick('/Allitems')} /></NavLink>
              </label>
            </li>
            <li>
              <label>
                
                <NavLink to="/search-cost">Search by Cost  <input type="checkbox" checked={activePage === '/search-cost'} onChange={() => handleNavLinkClick('/search-cost')} /></NavLink>
              </label>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default NavVer;
