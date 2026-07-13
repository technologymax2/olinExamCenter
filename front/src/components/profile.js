import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './profile.css';

const Profile = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logos');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <ul className='ul-profile'>
        {data.map((item) => (
          <li key={item._id}>
            {item.image && (
              <Link to="/"> {/* Wrap the image with Link component */}
                <img
                  src={item.image}
                  className="data-item-profile"
                  alt="profile"
                />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
