// Kunju Menon - sxm220267
// user profile creation and storing it to mysql db

import React from 'react'; 
import { useState } from 'react'; 
import axios from 'axios';

// state for form data with empty values inititally
const ProfileForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // handles updated values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users', formData);
      setMessage({
        text: 'User registered successfully!',
        type: 'success'
      });
      // reset form after submission
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        year: '',
      });
      // errors
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error registering user',
        type: 'error'
      });
    }
  };

  // renders the form
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>User Registration</h1>
      
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

      {/* handles submission */}
      <form onSubmit={handleSubmit}>
      {/* first name */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {/* last name */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {/*  email */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {/* phone */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
    
        
    
        {/* submission button */}
        <button
          type="submit"
          style={{
            background: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;