import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('You have been logged out');
    localStorage.removeItem('token');
    navigate('/');
  };

  const [showMenu, setShowMenu] = React.useState(false);

  const handleDashboardClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav style={{ position: 'absolute', top: 0, left: 0 }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><Link to="/dashboard" onClick={handleDashboardClick}>Dashboard</Link></li>
        {showMenu && (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/search-items">Search Items</Link></li>
            <li><Link to="/orders-history">Orders History</Link></li>
            <li><Link to="/deliver-items">Deliver Items</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/add-item">Add Item</Link></li>
           <li> <Link to="/chat">Support</Link></li> 
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;