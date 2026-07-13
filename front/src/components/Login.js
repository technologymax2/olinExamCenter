import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { Grid} from '@material-ui/core';
import Footer from "./Footer";

const Login = () => {
  const navigate = useNavigate(); // Use useNavigate hook instead of useHistory
  const [email, setEmail] = useState('@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check if the entered email and password match the admin credentials
      if (email === 'MaMaRu1989@gmail.com' && password === '123abc?!12') {
        
        navigate('/home'); // Navigate to admin page
        return; // Exit the function
      }
  
      // If not admin credentials, proceed with regular login
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('User type:', data.usertype);
        if (data.usertype === 'admin') {
          console.log('Redirecting to admin page');
          navigate('/home'); // Use navigate instead of history.push
        } else {
          console.log('Redirecting to home page');
          navigate('/homeCart'); // Use navigate instead of history.push
        }
        console.log('Login successful');
      } else {
        setError('Invalid email or password');
        console.log('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  return (
    <div>
    <div className="login-page">
      <div className="login-form-container1">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label"><FontAwesomeIcon icon={faEnvelope} /> Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label"><FontAwesomeIcon icon={faLock} /> Password:</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <button type="submit">Login</button>
          <a
            href="./Signup"
            rel="noopener noreferrer"
            className='have-account'
          >
            Don't have an account? 
            <b>Signup</b>  {/* Set size to 30 */}
          </a>
        </form>
      </div>
    </div>
    <Grid container>
    <Grid item xs={12}>
      <Footer />
    </Grid>
  </Grid>
  </div>
  );
};

export default Login;
