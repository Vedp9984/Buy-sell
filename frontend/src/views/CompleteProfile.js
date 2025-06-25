import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    age: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
  
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || '';
    const email = params.get('email') || '';

    console.log({name,email})

    setFormData({ ...formData, name, email });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      await axios.put('http://localhost:3000/api/log_reg/profile', formData,
        {headers: { Authorization: `Bearer ${token}`}}
      );
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Error updating profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Complete Your Profile</h2>
      <input type="text" name="name" value={formData.name} disabled />
      <input type="email" name="email" value={formData.email} disabled />
      <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CompleteProfile;
