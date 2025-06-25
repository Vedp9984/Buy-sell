import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Profile.css'; // Import the CSS file
import profileImage from '../assets/profile.png'; // Import the profile image

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/api/log_reg/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:3000/api/log_reg/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setEditMode(false);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img src={profileImage} alt="Profile" className="profile-image" />
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
          </div>
          {editMode ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
              <button type="submit" className="save-button">Save</button>
            </form>
          ) : (
            <div className="profile-details">
              <p><strong>First Name:</strong> {user.firstName}</p>
              <p><strong>Last Name:</strong> {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Contact Number:</strong> {user.contactNumber}</p>
              <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;