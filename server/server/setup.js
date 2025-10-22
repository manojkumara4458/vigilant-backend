#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚨 Setting up Neighborhood Safety Alert System...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create server .env file if it doesn't exist
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(serverEnvPath)) {
  const serverEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/neighborhood-safety

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
`;
  
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Created server/.env file');
} else {
  console.log('ℹ️  server/.env file already exists');
}

// Create client .env file if it doesn't exist
const clientEnvPath = path.join(__dirname, 'client', '.env');
if (!fs.existsSync(clientEnvPath)) {
  const clientEnvContent = `# Client Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
`;
  
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Created client/.env file');
} else {
  console.log('ℹ️  client/.env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Check if MongoDB is running
console.log('\n🔍 Checking MongoDB connection...');
try {
  // Try to connect to MongoDB (this is a simple check)
  const { MongoClient } = require('mongodb');
  const client = new MongoClient('mongodb://localhost:27017');
  
  client.connect()
    .then(() => {
      console.log('✅ MongoDB is running and accessible');
      client.close();
    })
    .catch(() => {
      console.warn('⚠️  MongoDB is not running. Please start MongoDB before running the application.');
      console.log('   You can install MongoDB from: https://docs.mongodb.com/manual/installation/');
      console.log('   Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
    });
} catch (error) {
  console.warn('⚠️  Could not check MongoDB connection. Make sure MongoDB is installed and running.');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Update the .env files with your configuration');
console.log('3. Run the application: npm run dev');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n📚 For more information, check the README.md file');
console.log('\n🚨 Stay Safe, Stay Informed! 🛡️'); 