import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/items/${id}`);
        console.log('Fetched item:', response.data);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        console.log('Fetching user profile with token:', token);
        const response = await axios.get('http://localhost:3000/api/log_reg/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched user:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchItem();
    fetchUser();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    try {
      console.log('Adding item to cart with token:', token);
      await axios.post('http://localhost:3000/api/cart', { itemId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Item added to cart');
      navigate('/search-items');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeItem = async () => {
    const token = localStorage.getItem('token');
    try {
      console.log('Removing item with token:', token);
      await axios.delete(`http://localhost:3000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Item removed successfully');
      navigate('/search-items');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!item || !user) return <div>Loading...</div>;

  const isVendor = user._id === item.sellerId._id;
  console.log('isVendor:', isVendor);
  return (
    <div>
      <br></br>  <br></br>    <br></br>  <br></br> 
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <p>Price: ${item.price}</p>
      <p>Category: {item.category}</p>
      <p>Vendor: {item.vendor}</p>
      {isVendor ? (
        <button onClick={removeItem}>Remove Item</button>
      ) : (
        <button onClick={addToCart}>Add to Cart</button>
      )}
    </div>
  );
};

export default ItemDetail;