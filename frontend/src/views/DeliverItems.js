import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DeliverItems = () => {
  const [orders, setOrders] = useState([]);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/api/orders/deliver', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleCompleteOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:3000/api/orders/complete/${orderId}`, { otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.message === 'Order completed successfully') {
        alert('Order completed successfully');
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Deliver Items</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            {order.itemId.name} - ${order.itemId.price} - Buyer: {order.buyerId.firstName} {order.buyerId.lastName}
            <input type="text" value={otp} onChange={handleOtpChange} placeholder="Enter OTP" />
            <button onClick={() => handleCompleteOrder(order._id)}>Complete Order</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliverItems;