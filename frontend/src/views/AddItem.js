import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'clothing'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/api/items', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Item added successfully!');
      setError('');
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'clothing'
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item');
      setSuccess('');
    }
  };

  return (
    <div>
      <Navbar />
       <br></br>  <br></br>    <br></br>  <br></br>    <br></br>  <br></br>
      <h2>Add Item for - Sale</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" required />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="clothing">Clothing</option>
          <option value="grocery">Grocery</option>
          <option value="electronics">Electronics</option>
          <option value="others">Others</option>
        </select>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~HISTORY~~~~~~~~~~~~~~~~~~~~~~~~~

export default AddItem;

