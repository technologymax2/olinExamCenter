import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Footer from './Footer';
import { IconButton } from '@material-ui/core';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { MdExpandLess } from 'react-icons/md';
import './search.css';
import './Home.css';

const useStyles = makeStyles((theme) => ({
  homePage: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center', // Center align items vertically
    justifyContent: 'center', 
    marginLeft: theme.spacing(9),// Center align items horizontally
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
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    color: '#4c4c4c',
    maxWidth: 700,
    float: "left",
    right: 10,
  },
}));

const Templete = () => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/addsec`);
      const filteredData = response.data.filter(item => item.cat === 'template' && item.price !== 'free'); // Filter data based on cost being "free"
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCart = (item) => {
    try {
      navigate('/login', { state: { itemName: item.name, itemPrice: item.price } });
    } catch (error) {
      console.error('Error navigating to homeCart:', error);
    }
  };


  const handleShowDetail = (id) => {
    const detailId = `detail-hide-display-${id}`;
    document.getElementById(detailId).style.display = "block";
  };

  const handleHideDetail = (id) => {
    const detailId = `detail-hide-display-${id}`;
    document.getElementById(detailId).style.display = "none";
  };



  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Calculate the range of items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  // Add animation class when the component is mounted
  useEffect(() => {
    const listItems = document.querySelectorAll('.data-item-section-display-cliant-li');
    if (listItems) {
      listItems.forEach(item => {
        item.classList.add('animate');
      });
    }
  }, []);

  return (
<div>
    <div className={classes.homePage}>
      <Container className={classes.homeContainer}>
        <Grid container className={classes.homeBannerContainer}>
          <Grid item className={classes.homeTextSection}>
            <Typography>
              <div className="search-input">
                <input type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
                <button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
                {searchTerm && displayedData.length === 0 && (
          <div className="search-not-found">
            <p>No items found matching your search.</p>
          </div>
        )}
              </div>
            </Typography>
          </Grid>
          <div className="homeImageContainer"></div>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="together-section-display">
              <ul>
                {displayedData.map((item) => (
                  <li key={item._id} className="data-item-section-display-li">
                    {item.image && (
                      <div className="together-section-display-img">
                        <img src={item.image} alt="Uploaded" />
                      </div>
                    )}
                    <div className="section-name">
                      <strong>{item.name}</strong>
                    </div>
                    <div>
                          <a href={item.link}>
                            <button className="preview-button">Preview</button>
                          </a>
                          

                          <button
                            onClick={() => handleShowDetail(item._id)}
                            className="detail-button"
                          >
                            Detail
                          </button>
                        </div>

                        <div
                          id={`detail-hide-display-${item._id}`}
                          className="detail-display"
                        >
                          <>{item.detail}</>
                          
                          <button
                            onClick={() => handleHideDetail(item._id)}
                            className="hide-button"
                          >
                             <MdExpandLess size={24} />
                          </button>
                        </div>
                        <div className='cart-home'>
                          <IconButton color="primary" aria-label='Add to Cart' onClick={() => handleCart(item)}>
                            <FaShoppingCart size={24} />
                          </IconButton>
                          <div className='section-price'>
                            ${item.price}
                          </div>
                        </div>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="pagination-container">
              <Pagination
                count={Math.ceil(data.length / itemsPerPage)}
                color="secondary"
                page={currentPage}
                onChange={handlePageChange}
              />
            </div>
          </Grid>
        </Grid>

      </Container>
      </div>
      <Footer />
    </div>
  );
}

export default Templete;
