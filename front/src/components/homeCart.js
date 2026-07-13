import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { FaShoppingCart } from 'react-icons/fa';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Grid } from '@material-ui/core';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { MdExpandLess } from 'react-icons/md';
import Footer from './Footer';
import './homeCart.css';
import './search.css';

const HomeCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Move the declaration here
  const [itemsPerPage] = useState(4); // Move the declaration here

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/addsec`);
      const filteredData = response.data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.price !== 'free');
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    handleSearch();
  }, [handleSearch, searchTerm]); // Include handleSearch and searchTerm in the dependency array

  // Initialize cartItems state with items retrieved from local storage
  const [cartItems, setCartItems] = useState(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  // Calculate total number of items in cart
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price of items in cart
  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.itemPrice) * item.quantity, 0);

  const handleAddToCartView = () => {
    console.log("Items in cart:", cartItems);
    document.getElementById('checkout-verify').style.display = 'block';
  };

  const handleRemoveFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };
    


  const ViewCart= () => {
    console.log("Items in cart:", cartItems);
    document.getElementById('checkout-verify').style.display = 'block';
  };

  
  const handleCheckout = () => {
    console.log("Items in cart:", cartItems);
    document.getElementById('payadress').style.display = 'block';
    document.getElementById('checkout-verify').style.display = 'none';
  };
  const handleCancel = () => {
    console.log("Items in cart:", cartItems);
    document.getElementById('payadress').style.display = 'none';
  };

  const handleCancelCheackout=()=>{
        console.log("Items in cart:", cartItems);
    document.getElementById('checkout-verify').style.display = 'none';

  }

  const handleChangeQuantity = (index, newQuantity) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;
    setCartItems(updatedCartItems);
  };

  const handleCart = (item) => {
    const newItem = { itemName: item.name, itemPrice: item.price }; // Assuming 'name' and 'price' are the properties of the item object
    const existingItem = cartItems.find(item => item.itemName === newItem.itemName);
    if (existingItem) {
      console.log("Item already in cart:", newItem.itemName);
    } else {
      setCartItems([...cartItems, { ...newItem, quantity: 1 }]);
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    saveAddress: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data
    console.log("Form submitted:", formData);
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

  return (
    <div>
      {/* Cart items display */}
      <div className="after-item-added">
     
        <h3>Add Quantity</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="one-item">
            <div className="all-p">
              <p>{item.itemName}</p>
              <p>Price: ${item.itemPrice}</p>
              <div className="quantity-selector">
                <button className="increament-btn" onClick={() => handleChangeQuantity(index, item.quantity - 1)}>-</button>
                <span className="item-unit">{item.quantity}</span>
                <button className="increament-btn" onClick={() => handleChangeQuantity(index, item.quantity + 1)}>+</button>
              </div>
            </div>
            <IconButton color="secondary" aria-label="delete" onClick={() => handleRemoveFromCart(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <div>
          <p>Items: {itemCount}</p>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        <div>
          <button className="Checoutbtn" onClick={ViewCart}>View Cart</button>
        </div>
        <div>
          <Link to="/"> <ArrowBackIcon /> Logout</Link>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="add-to-cart-order-page">
        <span className="cart-counter">{itemCount}</span>
        <IconButton color="primary" aria-label='Add to Cart' onClick={handleAddToCartView}>
          <FaShoppingCart size={24} />
        </IconButton>
      </div>

      {/* Search input */}
      <div className="search-input">
        <input type="text" placeholder="Search ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        {searchTerm && displayedData.length === 0 && (
          <div className="search-not-found">
            <p>No items found matching your search.</p>
          </div>
        )}
      </div>

      {/* Address and checkout form */}
      <div className="address-checkout" id='payadress'>
        <form onSubmit={handleSubmit}>
       
          <div className="name-inputs">
            <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <input type="text" placeholder="Country" name="country" value={formData.country} onChange={handleChange} required />
          <input type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} required />
          <input type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} required />
          <button type="submit">Submit</button>
           <button className='Checkout_cancel' onClick={handleCancel}>Cancel</button>
        </form>
      </div>



        
<div className="checkout-verify" id="checkout-verify">
 <button className='your-cart_cancel' onClick={handleCancelCheackout}>X</button>
        <h5>Your Cart</h5>
        {cartItems.map((item, index) => (
          <div key={index} className="one-item">
            <div>
              <>{item.itemName}</> X <>{item.quantity}</>
              <>  = ${item.itemPrice}</>
              <button  className="remove-from-cart"  onClick={() => handleRemoveFromCart(index)}>
              X
            </button>
            </div>
            
          </div>
        ))}
        <div className="item_total">
          <p>Items: {itemCount}</p>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        <div>
          <button className="Checoutbtn" onClick={handleCheckout}>Checkout</button>
        </div>
        
      </div>
      
      
      
    







      {/* Displayed items */}
      <div className="together-section-display">
        <ul>
          {displayedData.map((item) => (
            <div className='dilete-view-btn-safe-div' key={item._id}>
              <li className="data-item-section-display-li">
                {item.image && (
                  <div className="together-section-display-img">
                    <img src={item.image} alt="Uploaded" />
                  </div>
                )}
                <div className='section-name'>
                  <strong>{item.name}</strong>
                </div>
                <div>
                  <a href={item.link}>
                    <button className="preview-button">Preview</button>
                  </a>
                  <button onClick={() => handleShowDetail(item._id)} className="detail-button">Detail</button>
                </div>
                <div id={`detail-hide-display-${item._id}`} className="detail-display">
                  <>{item.detail}</>
                  <button onClick={() => handleHideDetail(item._id)} className="hide-button"><MdExpandLess size={24} /></button>
                </div>
                <div className='cart-home'>
                  <IconButton color="primary" aria-label='Add to Cart' onClick={() => handleCart(item)}>
                    <FaShoppingCart size={24} />
                  </IconButton>
                  <div className='section-price'>${item.price}</div>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="pagination-container">
            <Pagination count={Math.ceil(data.length / itemsPerPage)} color="secondary" page={currentPage} onChange={handlePageChange} />
          </div>
        </Grid>
      </Grid>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeCart;
