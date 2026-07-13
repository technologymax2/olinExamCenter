import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminApp from './admin/home/home';
import AddSection from './admin/home/addSection';
import AddCategory from './admin/home/addcategory';
import AddUser from './admin/home/addUser';
import  ContactFormA from './admin/home/comment_view';
import Logo from './admin/home/logo';
import './App.css'; // Import CSS file for styling
import Allitem from './components/Allitems';
import ContactForm from './components/Contact';
import ShoppingCart from './components/homeCart';
import SearchCost from './components/search-cost';
import Templet from './components/Template';
import Videos from './components/Video';
import Images from './components/Image';
import Codes from './components/Code';
import Audios from './components/Audio';
import  NavVer from './categoris';

const App = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  const handleLogin = () => {
    // Perform login logic
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Perform logout logic
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="menu-icon-line"></div>
          <div className="menu-icon-line"></div>
          <div className="menu-icon-line"></div>
        </div>
        <div className={`overlay ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
        <div>
          <NavigationBar isOpen={menuOpen} closeMenu={closeMenu} isLoggedIn={isLoggedIn} /> {/* Pass isLoggedIn state to NavigationBar */}
          <div>
        <NavVer />
        </div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {isLoggedIn ? null : <Route path="/login" element={<Login onLogin={handleLogin} />} />} {/* Render the Login component only if not logged in */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/allitems" element={<Allitem />} />
          <Route path="/home" element={<AdminApp />} />
          <Route path="/addSection" element={<AddSection />} />
          <Route path="/addUser" element={<AddUser />} />
          
          <Route path="/logo" element={<Logo />} />
          <Route path="/comment" element={<ContactForm />} />
          <Route path="/homeCart" element={<ShoppingCart />} />
          <Route path="/search-cost" element={<SearchCost />} />
          <Route path="/Template" element={<Templet />} />
          <Route path="/Video" element={<Videos />} />
          <Route path="/Image" element={<Images />} />
          <Route path="/Code" element={<Codes />} />
          <Route path="/Audio" element={<Audios />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/comment-view" element={<ContactFormA />} />
          
        </Routes>

      </div>
     
    </Router>
  );
};

export default App;
