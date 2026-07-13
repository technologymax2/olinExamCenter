import React, { useState } from 'react';
import './addUser.css';
import AdminHome from './home';

const AddUser = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('000000');
  const [password2, setPassword2] = useState('000000');
  const [usertype, setUsertype] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password !== password2) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      const response = await fetch('http://localhost:5000/adduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, usertype }),
      });

      if (response.ok) {
        setSuccess('User added successfully');
        console.log('User added successfully');
      } else {
        const data = await response.json();
        if (response.status === 400 && data.error === 'Email already exists') {
          setError('Email already exists, please choose another one');
          setEmail(''); // Clear the email input field
        } else {
          setError('Failed to add user');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Failed to add user');
    }
  };

  return (
       <div><AdminHome />
    <div className="login-form-container-add">
      <h2>Add User</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Conifurm passwerd</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">User Type:</label>
          <input
            type="text"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
    </div>
  );
};

export default AddUser;
