import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, IconButton } from '@material-ui/core';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import Footer from './Footer';
import Abouthome from "./abouthome";
import Contacthome from "./contacthome";
import { useNavigate } from "react-router-dom";
import './Home.css';

const useStyles = makeStyles((theme) => ({
  homePage: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center', // Center align items vertically
    justifyContent: 'center', 
    marginLeft: theme.spacing(1), // Center align items horizontally
  },
  homeContainer: {
    position: 'relative',
    margin: '0 auto',
    padding: '0 1%',
    width: '100%', // Set width to 100%
  },
  homeBannerContainer: {
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  homeTextSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  primaryHeading: {
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    color: '#4c4c4c',
    maxWidth: '100%',
    float: "left",
    paddingRight:"10",
    paddingLeft:"30",
    marginTop:"30",
  },
}));

const Home = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/addcat`);
      const filteredData = response.data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.price !== 'free');
      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleCartAll = () => {
    try {
      navigate('./login');
    } catch (error) {
      console.error('Error navigating to homeCart:', error);
    }
  };

  return (
    <div>
      <div className={classes.homePage}>
        <Container className={classes.homeContainer}>
        <Grid container className={classes.homeBannerContainer}>
          <div className="title-and-search">
          <Grid item className={classes.homeTextSection}>
            <Typography variant="h1" className={classes.primaryHeading}>
              Kegeberew Technology Solutions
            </Typography>
           
            <Typography>
              <div className="search-input">
                <input type="text"
                  placeholder="Search ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
                <button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
                {searchTerm && data.length === 0 && (
          <div className="search-not-found">
            <p>No items found matching your search.</p>
          </div>
        )}
              </div>          
            </Typography>
           
          </Grid>
          <div className='cart-all'>
                          <IconButton color="primary" aria-label='Add to Cart' onClick={() => handleCartAll()}>
                            <FaShoppingCart size={44} />
                          </IconButton>
                        </div>
          </div>
        </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <div className="together-section-display-cat">
                <ul>
                  {data.map((item) => (
                    <div className="dilete-view-btn-safe-div-cat" key={item._id}>
                      <button onClick={() => navigate(`./${item.name}`)} className="cat-btn-display">
                        <li className="data-item-section-display-cat-li">
                        {item.image && (
                          <div className="together-section-display-cat-img">
                            <img src={item.image} alt="Uploaded" />
                          </div>
                        )}
                        
                        <div>
                         <strong className="section-name-cat">
                          {item.name}
                          </strong>
                        
                          <strong className="section-price-cat">
                            ${item.min_price} - ${item.max_price}
                          </strong>
                        </div>
                      </li></button>
                    </div>
                  ))}
                </ul>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
      {/* Additional components */}
      <Abouthome />
      <Contacthome />
      <Footer />
    </div>
  );
}

export default Home;
