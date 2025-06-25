import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const OrdersHistory = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [userId, setUserId] = useState(null); // Store logged-in user ID

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        // Fetch logged-in user
        const userResponse = await axios.get('http://localhost:3000/api/log_reg/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const loggedInUser = userResponse.data;
        setUserId(loggedInUser._id);

        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:3000/api/orders/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const orders = ordersResponse.data;

        console.log("Fetched orders:", orders);
        console.log("Logged-in user:", loggedInUser);

        // Filter orders based on user ID
        const pending = orders.filter(order => order.status === 'Pending');
        const bought = orders.filter(order => order.status === 'Completed' && order.buyerId === loggedInUser._id);
        const sold = orders.filter(order => order.status === 'Completed' && order.sellerId === loggedInUser._id);

        console.log("Pending orders:", pending);
        console.log("Bought items:", bought);
        console.log("Sold items:", sold);

        setPendingOrders(pending);
        setBoughtItems(bought);
        setSoldItems(sold);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserAndOrders();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Orders History</h2>
      <div>
        <button onClick={() => setActiveTab('pending')}>Pending Orders</button>
        <button onClick={() => setActiveTab('bought')}>Bought Items</button>
        <button onClick={() => setActiveTab('sold')}>Sold Items</button>
      </div>

      {activeTab === 'pending' && (
        <div>
          <h3>Pending Orders</h3>
          <ul>
            {pendingOrders.map(order => (
              <li key={order._id}>
                {order.itemId?.name || 'Unknown Item'} - ${order.itemId?.price || 'N/A'} - Quantity: {order.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'bought' && (
        <div>
          <h3>Bought Items</h3>
          <ul>
            {boughtItems.map(order => (
              <li key={order._id}>
                {order.itemId?.name || 'Unknown Item'} - ${order.itemId?.price || 'N/A'} - Quantity: {order.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'sold' && (
        <div>
          <h3>Sold Items</h3>
          <ul>
            {soldItems.map(order => (
              <li key={order._id}>
                {order.itemId?.name || 'Unknown Item'} - ${order.itemId?.price || 'N/A'} - Quantity: {order.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;