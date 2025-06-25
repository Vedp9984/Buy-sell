import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Cart = () => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(cart.items.filter(item => item.itemId._id !== itemId));
      window.location.href = '/cart'; 
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/api/cart/order', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.message === 'You cannot buy your own item') {
        alert('You cannot buy your own item');
      } else {
        const otp = response.data.orders[0].otp;
        console.log(response.data);
        alert(`Order placed successfully. Your OTP is: ${otp}`);
        setCart(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <br></br>  <br></br>    <br></br>  <br></br>    <br></br>  <br></br>
      <h2>My Cart </h2>
      <ul>
        {cart.items.map(item => (
          <li key={item.itemId._id}>
            {item.itemId.name} - ${item.itemId.price} - Quantity: {item.quantity}
            <button onClick={() => handleRemove(item.itemId._id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${cart.items.reduce((total, item) => total + item.itemId.price * item.quantity, 0)}</p>
      <button onClick={handleFinalOrder}>Final Order</button>
    </div>
  );
};

export default Cart;