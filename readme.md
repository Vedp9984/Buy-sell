# Buy-sell: 
## Overview
Buy-sell is a web-based platform that facilitates buying and selling of products between users. It creates a virtual marketplace where sellers can list their products and buyers can browse, search, and purchase items of interest.

## Features
- **User Authentication**: Secure registration and login system along with captcha and cas login features
- **Product Listings**: Users can create, edit, and delete product listings
- **Search & Filter**: Advanced search functionality with multiple filtering options
- **Categories**: Browse products by categories
- **User Profiles**: Personalized profiles for buyers and sellers
- **Messaging System**: In-app communication between buyers and sellers
- **Wishlist**: Save products for later viewing
- **Ratings & Reviews**: Rate sellers and products
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technologies Used
- **Frontend**: React.js, HTML5, CSS3, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: AWS S3/Cloudinary
- **Deployment**: Docker, AWS/Heroku

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Steps to Run Locally
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Buy-sell.git
   cd Buy-sell
   ```

2. Install dependencies for both frontend and backend
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   - Create `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers
   ```bash
   # Start backend server
   cd server
   node s.js
   
   # In a new terminal, start frontend server
   cd frontend
   npm start
   ```

5. Access the application at `http://localhost:3000`

## Project Structure
