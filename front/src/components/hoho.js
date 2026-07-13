import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './homeCart.css';

const HomeCart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize cartItems state with items retrieved from local storage
  const [cartItems, setCartItems] = useState(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    // Update local storage whenever cartItems changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate total number of items in cart
  const itemCount = cartItems.length;

  // Calculate total price of items in cart
  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.itemPrice), 0);

  const handleAddToCart = () => {
    const { itemName, itemPrice } = location.state;
    const newItem = { itemName, itemPrice };
    const existingItem = cartItems.find(item => item.itemName === newItem.itemName);
    if (existingItem) {
      console.log("Item already in cart:", newItem.itemName);
    } else {
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleRemoveFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const handleCheckout = () => {
    console.log("Items in cart:", cartItems);
    document.getElementById('payadress').style.display = 'block';
  };
//...............................................

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

  return (
    <div>
      <div className="after-item-added">
        <h3>Your Cart</h3>
        {cartItems.map((item, index) => (
          <div key={index}>
            <p>{item.itemName}</p>
            <p>Price: ${item.itemPrice}</p>
            <button onClick={() => handleRemoveFromCart(index)}>Remove</button>
          </div>
        ))}
        <div>
          <p>Items: {itemCount}</p>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        <div>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
        <div>
          <Link to="/"> <ArrowBackIcon /> Back</Link>
        </div>
      </div>
      <div>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <span className="cart-counter">{itemCount}</span>
        <ShoppingCartIcon />
      </div>
      <div className="address-checkout" id='payadress'>
  <form onSubmit={handleSubmit}>
    <div className="name-inputs">
      <input
        type="text"
        placeholder="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
    </div>
    <input
      type="text"
      placeholder="Country"
      name="country"
      value={formData.country}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      placeholder="State"
      name="state"
      value={formData.state}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      placeholder="City"
      name="city"
      value={formData.city}
      onChange={handleChange}
      required
    />
    <button type="submit">Submit</button>
  </form>
</div>
    </div>
  );
};

export default HomeCart;
