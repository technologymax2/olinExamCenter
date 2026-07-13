import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './logo.css';
import AdminHome from './home';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Logo = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ image: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [sucssMessage, setSucssMessage] = useState('');

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there is already an uploaded image
    if (data.length > 0) {
      setErrorMessage('Delete the image uploaded before');
      return;
    }

    // Proceed with the upload if there is no image uploaded
    const formDataWithImage = new FormData();
    formDataWithImage.append('image', formData.image);

    try {
      await axios.post('http://localhost:5000/logos', formDataWithImage);
      setFormData({ image: null });
      fetchData();
      setSucssMessage('Uploaded successfully');
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/logos/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div>
      <AdminHome />
      <div className='container'>
        <div className="input-form">
          <h2>Upload Logo</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className='input-form-inputs'>
            <div className="form-grouplogo">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file<input type="file" name="image" className='uploadbtn' onChange={handleInputChange} />
              </Button>
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              {sucssMessage && <p style={{ color: 'green' }}>{sucssMessage}</p>}
            </div>
            <Button variant="contained" type="submit" color="success">
              Finish
            </Button>
          </form>
        </div>
        <div className='display_imput'>
          <h2>Added Logo</h2>
          <div className='together'>
            <ul>
              {data.map((item) => (
                <li key={item._id} className="data-item">
                  {item.image && (
                    <div className='img'>
                      <img src={item.image} alt="Uploaded" />
                    </div>
                  )}
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
