// seed.js

const mongoose = require('mongoose');
const { UserModel } = require('./models/UserModel'); // Destructure UserModel from the exported object

const mongoURI = 'mongodb://localhost:27017/KTS'; // Replace with your MongoDB URI

const seedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI);

        // Clear existing users
        await UserModel.deleteMany({}); // Use UserModel here

        // Create an array of users to seed
        const users = [
            {
                email: 'mex@gmail.com',
                password: '192589', // Make sure to hash passwords in production
                usertype: 'admin',
            }
            
           
        ];

        // Insert users into the database
        await UserModel.insertMany(users); // Use UserModel here
        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Run the seed function
seedUsers();