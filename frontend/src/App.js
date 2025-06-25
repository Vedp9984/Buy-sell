import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Profile from './views/Profile';
import SearchItems from './views/SearchItems';
import ItemDetail from './views/ItemDetail'; // Ensure this import
import OrdersHistory from './views/OrdersHistory';
import DeliverItems from './views/DeliverItems';
import Cart from './views/Cart';
import Orders from './views/Orders';
import AddItem from './views/AddItem';
import Chat from './views/Chat';
import CompleteProfile from './views/CompleteProfile';
import OrderDetail from './views/OrderDetail'; // Ensure this import
import Navbar from './components/Navbar';

const PrivateRoute = ({ element: Component, tokenInUrl, ...rest }) => {
  let token;
  if (tokenInUrl) {
    const params = new URLSearchParams(window.location.search);
    token = params.get('token');
    localStorage.setItem('token', token);
  } else {
    token = localStorage.getItem('token');
  }
  console.log('token', token);

  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div>
        {token && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route path="/search-items" element={<PrivateRoute element={SearchItems} />} />
          <Route path="/items/:id" element={<PrivateRoute element={ItemDetail} />} /> {/* Ensure this route */}
          <Route path="/orders-history" element={<PrivateRoute element={OrdersHistory} />} />
          <Route path="/deliver-items" element={<PrivateRoute element={DeliverItems} />} />
          <Route path="/cart" element={<PrivateRoute element={Cart} />} />
          <Route path="/orders" element={<PrivateRoute element={Orders} />} />
          <Route path="/orders/:id" element={<PrivateRoute element={OrderDetail} />} /> {/* Ensure this route */}
          <Route path="/ItemDetail" element={<PrivateRoute element={ItemDetail} />} />
          <Route path="/add-item" element={<PrivateRoute element={AddItem} />} />
          <Route path="/chat" element={<PrivateRoute element={Chat} />} />
          <Route path="/complete-profile" element={<PrivateRoute element={CompleteProfile} tokenInUrl={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;