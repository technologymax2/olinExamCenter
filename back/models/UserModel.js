const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true // Set unique option to true to enforce uniqueness
  },
  password: String,
  usertype: { type: String  }
  
});

// Create a schema for the image model
const linkSchema = new mongoose.Schema({
  telegram: String,
  facebook: String,
  instagram: String,
  tuter: String,
});

// Create products model
const sectionSchema = new mongoose.Schema({
  name: String,
  link: String,
  image: String,
  price: String,
  detail:String,
  cat:String,

});


const logoSchema = new mongoose.Schema({
  name: String,
  image: String,

});


const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String
});



// Define Image schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  min_price: {
    type: Number,
    required: true
  },
  max_price: {
    type: Number,
    required: true
  },
  image: {
    type: String  // Assuming you store image URLs
  }
});


const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});
const Contact = mongoose.model('Contact', contactSchema);
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Logo = mongoose.model('Logo', logoSchema );
const Section = mongoose.model('section', sectionSchema );
const Link = mongoose.model('Link', linkSchema);
const UserModel = mongoose.model('User', userSchema);



module.exports = { UserModel, Link, Section,Logo,Category,Product,Contact};









