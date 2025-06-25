import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h2>Order Details</h2>
      <p>Status: {order.status}</p>
      <p>Transaction ID: {order.transactionId}</p>
      <p>Buyer: {order.buyerId?.firstName} {order.buyerId?.lastName}</p>
      <p>Seller: {order.sellerId?.firstName} {order.sellerId?.lastName}</p>
      <p>Item: {order.itemId?.name}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Amount: ${order.itemId?.price * order.quantity}</p>
    </div>
  );
};

export default OrderDetail;