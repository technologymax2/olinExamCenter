const express = require('express');
const router = express.Router();
const { UserModel, Link, Section ,Logo,Contact, Category} = require('../models/UserModel');
const multer = require('multer');
const path = require('path');

// Define Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });


//signup.................................................................................
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      // User already exists, send error response
      console.log('Email already exists');
      return res.status(400).json({ error: 'Email already exists' });
    }

    // User does not exist, proceed with registration
    user = await UserModel.create({ email, password });
    
    // Send back the newly created user object in the response
    res.status(201).json(user);
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

//login.............................................................................................
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || user.password !== password) {
      // If user not found or password doesn't match, return error
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Password matches, login successful, return user type along with success message
    res.json({ message: 'Login successful', usertype: user.usertype });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

//add user.................................................................................
router.post('/adduser', async (req, res) => {
  const { email, password, usertype } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      // User already exists, send error response
      console.log('Email already exists');
      return res.status(400).json({ error: 'Email already exists' });
    }

    // User does not exist, proceed with user creation
    user = await UserModel.create({ email, password, usertype });
    
    // Send back the newly created user object in the response
    res.status(201).json(user);
  } catch (error) {
    console.error('User creation failed:', error);
    res.status(500).json({ error: 'User creation failed' });
  }
});


//.................................................................................
router.post('/addlink', async (req, res) => {
  const { telegram, tuter, facebook, instagram } = req.body;

  try {
    let link = await Link.findOne({ telegram });

    if (link) {
      // User already exists, send error response
      console.log('Delete the privius first');
      return res.status(400).json({ error: 'link already exists' });
    }

    // User does not exist, proceed with user creation
    user = await Link.create({ telegram, tuter, facebook, instagram });
    
    // Send back the newly created user object in the response
    res.status(201).json(link);
  } catch (error) {
    console.error('User creation failed:', error);
    res.status(500).json({ error: 'User creation failed' });
  }
});

// Delete data by ID
router.delete('/addlink/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Data.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.sendStatus(500);
  }
});
//.......................................

//......................................................................................
router.post('/addsec', upload.single('image'), async (req, res) => {
  try {
    const { name, link, price, cat,detail } = req.body;
    const imageUrl = `http://localhost:5000/${req.file.filename}`;
    const newData = new Section({ name, link,price,detail,cat, image: imageUrl });
    await newData.save();
    res.sendStatus(201);
  } catch (error) {
    console.error('Error creating data:', error);
    res.sendStatus(500);
  }
});

// Get all product
router.get('/addsec', async (req, res) => {
  try {
    const data = await Section.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.sendStatus(500);
  }
});

// Delete product by ID
router.delete('/addsec/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Section.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.sendStatus(500);
  }
});
//search.......................................................
router.get('/addsec/:name', async (req, res) => {
  const { name } = req.params;
  const images = await Section.find({ name });
  res.json(images);
});



// logoooooooooooooooooooooooooooooooooooooooooo

router.post('/logos', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrl = `http://localhost:5000/${req.file.filename}`;
    const newLogo = new Logo({ name, image: imageUrl });
    await newLogo.save();
    res.sendStatus(201);
  } catch (error) {
    console.error('Error creating data:', error);
    res.sendStatus(500);
  }
});

// Get all product
router.get('/logos', async (req, res) => {
  try {
    const logo = await Logo.find();
    res.json(logo);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.sendStatus(500);
  }
});

// Delete product by ID
router.delete('/logos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Logo.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.sendStatus(500);
  }
});


//comment........................
router.post('/api/contact', async (req, res) => {
  try {
      const { name, email, message } = req.body;
      const newContact = new Contact({ name, email, message });
      await newContact.save();
      res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/api/contact', async (req, res) => {
  try {
      const contacts = await Contact.find();
      res.json({ success: true, contacts });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/contact:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.sendStatus(500);
  }
});



// Add a new category
router.post('/addcat', upload.single('image'), async (req, res) => {
  try {
    const { name, min_price, max_price } = req.body;
    const imageUrl = `http://localhost:5000/${req.file.filename}`;
    const newCategory = new Category({ name, min_price, max_price, image: imageUrl });
    await newCategory.save();
    res.sendStatus(201);
  } catch (error) {
    console.error('Error creating category:', error);
    res.sendStatus(500);
  }
});

// Get all categories
router.get('/addcat', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.sendStatus(500);
  }
});

// Delete category by ID
router.delete('/addcat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting category:', error);
    res.sendStatus(500);
  }
});
//search.......................................................
router.get('/addcat/:name', async (req, res) => {
  const { name } = req.params;
  const images = await Category.find({ name });
  res.json(images);
});




module.exports = router;
