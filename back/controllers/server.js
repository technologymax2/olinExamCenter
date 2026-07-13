// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors'); // Import CORS module

// const app = express();

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/KTS', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log("Connected to MongoDB");
// }).catch(err => {
//   console.error("Error connecting to MongoDB", err);
// });

// // Define schema and model for your data (e.g., Product)
// const productSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   price: Number,
//   image: String
// });

// const Product = mongoose.model('Product', productSchema);

// // Image upload configuration
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage
// }).single('image');

// // Enable CORS
// app.use(cors());

// // API routes
// app.use(express.json());

// app.post('/api/products', (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Error uploading image" });
//     }
//     const product = new Product({
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       image: req.file.filename
//     });
//     product.save()
//       .then(savedProduct => {
//         res.status(201).json(savedProduct);
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Error saving product" });
//       });
//   });
// });

// app.get('/api/products', async (req, res) => {
//   try {
//     const products = await Product.find().exec();
//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: "Error fetching products" });
//   }
// });

// app.listen(5001, () => {
//   console.log('Server is running on port 5001');
// });
