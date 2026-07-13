import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './comment.css'; // Import your CSS file for additional styling
import { Grid } from '@material-ui/core';
import Footer from '../../components/Footer';
import AdminHome from "./home";

const ContactFormA = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contact');
            // Sort contacts array to display latest messages at the top
            const sortedContacts = response.data.contacts.reverse();
            setContacts(sortedContacts);
        } catch (err) {
            console.error(err);
        }
    };

  

    return (
        <div>
            <AdminHome />
            <div>
                <div className="comments-section">
                    <h2 className="comments-header">Comments</h2>
                    <ul className="comments-list">
                        {contacts.map(contact => (
                            <li key={contact._id} className="comment-item">
                                <div className={contact.read ? 'read-comment' : 'unread-comment'}>
                                    <strong className="comment-name"> {contact.name}</strong> <br />
                                    
                                    <p className="comment-message">{contact.message}</p> <br />
                                    <div className='email-display'>
                                    {contact.email}
                                    </div>
                                   
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                </div>
                <Grid>
                    <Footer />
                </Grid>
            </div>
        </div>
    );
};

export default ContactFormA;
