import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';
import { Grid } from '@material-ui/core';
import Footer from './Footer';

const Contacthome = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [contacts, setContacts] = useState([]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/contact', formData);
            setSuccessMessage(response.data.message);
            setErrorMessage('');
            setFormData({ name: '', email: '', message: '' });
            fetchContacts();
        } catch (err) {
            console.error(err);
            setErrorMessage('Failed to send message');
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contact');
            setContacts(response.data.contacts);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div>
            <div className="container-contact">
                <div className="form-container-contact">
                    <h2>Send Comment</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange}></textarea>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
            
            <Grid>
                
            </Grid>
        </div>
    );
};

export default Contacthome;
