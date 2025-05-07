// SignupForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // ✅ Import your CSS with .button class

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'first_name' || name === 'last_name') {
      if (value && !/^[A-Za-z]+$/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Only letters allowed' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else if (name === 'phone') {
      if (value && !/^[0-9]+$/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Only numbers allowed' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else if (name === 'email') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Invalid email format' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else if (name === 'username') {
      if (!value) {
        setErrors(prev => ({ ...prev, username: 'Username required' }));
      } else {
        setErrors(prev => ({ ...prev, username: '' }));
      }
    } else if (name === 'password') {
      if (!value || value.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some(error => error !== '')) {
      setMessage({ text: 'Please fix form errors', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5051/api/users/signup', formData);
      setMessage({ text: 'Signup successful! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Signup failed', type: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Sign Up</h1>

      {message.text && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          background: message.type === 'success' ? '#dff0d8' : '#f2dede',
          color: message.type === 'success' ? '#3c763d' : '#a94442'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
        
        {/* Last Name */}
        <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
        
        {/* Email */}
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
        
        {/* Phone */}
        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />

        {/* Username */}
        <InputField label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} />

        {/* Password */}
        <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} />
        <p style={{ fontSize: '0.9em', textAlign: 'left', marginBottom: '10px', marginTop: '10px', marginRight: '35px' }}>
                  Already have an account? <a href="/login">Login</a>
                </p>
        <button
          type="submit"
          className="button" // ✅ uses your imported CSS
          disabled={Object.values(errors).some(error => error !== '')}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, type = 'text' }) => (
  <div style={{ marginBottom: '15px' }}>
    <label htmlFor={name}>{label}:</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      style={{
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        border: error ? '1px solid red' : '1px solid #ccc'
      }}
    />
    {error && <div style={{ color: 'red', fontSize: '0.8em' }}>{error}</div>}
  </div>
);

export default SignupForm;
