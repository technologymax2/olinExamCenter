import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Signup.css';
import { Grid} from '@material-ui/core';
import Footer from "./Footer";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('@gmail.com');
  const [password, setPassword] = useState('0000');
  const [password2, setPassword2] = useState('0000');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password !== password2) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 2) {
        setError('Password must be at least 8 characters long');
        return;
      }

      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/homeCart');
        console.log('Signup successful');
      } else {
        const data = await response.json();
        if (data.error === 'Email already exists') {
          setError('Email already exists, please choose another one');
          setEmail(''); // Clear the email input field
        } else {
          console.log('Signup failed');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
    <div className="signup-page">
      <div className="signup-form-container">
        <h2>Signup</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
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
          <div className="form-group">
            <label>Retype Password:</label>
            <div  className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
                  <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

          </div>
          <button type="submit">Signup</button>
          <a
        href="./Login"
        rel="noopener noreferrer"
        className='dont-have-account'
      >
       <b>Login</b>  {/* Set size to 30 */}
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

export default Signup;
