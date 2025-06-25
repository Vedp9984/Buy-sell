import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      console.log('Fetching orders with token:', token);
      try {
        const response = await axios.get('http://localhost:3000/api/orders/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            {order.status} - ${order.amount}
            <Link to={`/orders/${order._id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;