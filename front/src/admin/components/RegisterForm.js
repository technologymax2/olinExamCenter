import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './signup.css';



const RegisterForm = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState('@gmail.com');
  const [password, setPassword] = useState('00000000');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        Navigate('/home/home');
        console.log('Registration successful');
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    setEmail('@gmail.com');
    setPassword('00000000');
  };

  return (
    <div>
      
      <div className="login-form-container1">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='label'>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className='label'>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='signup_btn_sign'>Signup</button>
        </form>
      </div>
    </div>
  );
};


export default RegisterForm;