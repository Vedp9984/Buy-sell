import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const backgroundStyle = {
    backgroundImage: 'url(./assets/dash.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  };

  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#ff9800',
    color: 'white',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#e68900',
  };

  return (
    <div style={backgroundStyle}>
      <h1>Welcome to Buy-Sell Rent IIIT-H</h1>
      <p>Your one-stop solution for buying, selling, and renting within the IIIT-H community.</p>

      <div className="buttons">
        <Link to="/register">
          <button style={buttonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}>Sign Up</button>
        </Link>
        <Link to="/login">
          <button style={buttonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}>Sign In</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
