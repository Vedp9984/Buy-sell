import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:3000/api/log_reg/login', { email, password, recaptchaToken });
      localStorage.setItem('token', response.data.token);
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    }
  };

  const handleCasLogin = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/cas/login');
      window.location.href = response.data.loginUrl;
    } catch (error) {
      console.error('CAS login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <ReCAPTCHA sitekey="6LeVwMUqAAAAAPna23FsLfxs2PrHHsK5nOUPicj3" onChange={handleRecaptchaChange} />
      <button type="submit">Login</button>
      
    </form>
  );
};

export default Login;