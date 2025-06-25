import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    contactNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/log_reg/register', { ...formData, recaptchaToken });
      console.log('Registration successful:', response.data);
      setSuccess('Registration successful! Redirecting to home page...');
      setError('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Registration failed');
      setSuccess('');
    }
  };

  const handleCasLogin = async () => {
    try {
      // const response = await axios.get('http://localhost:3000/api/log_reg/cas/login');
      window.location.href ="http://localhost:3000/api/log_reg/cas/login";
      return ;
    } catch (error) {
      console.error('CAS login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
      <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
      <ReCAPTCHA sitekey="6LeVwMUqAAAAAPna23FsLfxs2PrHHsK5nOUPicj3" onChange={handleRecaptchaChange} />
      <button type="submit">Register</button>
      <button type="button" onClick={handleCasLogin}>Register with CAS</button>
    </form>
  );
};

export default Register;