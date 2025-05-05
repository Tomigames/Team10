import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const ProfileForm = ({ setActiveTab }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // handle input changes with validation
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
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Navigate to edit profile
  const navigateToEditProfile = () => {
    if (typeof setActiveTab === 'function') {
      setActiveTab('ProfileEdit');
    }
    navigate('/edit-profile'); // ✅ use navigate instead of history.push
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some(error => error !== '')) {
      setMessage({ text: 'Please fix form errors', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5050/api/users', formData);
      setMessage({
        text: 'User registered successfully!',
        type: 'success'
      });
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
      });
      setErrors({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error registering user',
        type: 'error'
      });
    }
  };

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

      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: errors.first_name ? '1px solid red' : '1px solid #ccc'
            }}
          />
          {errors.first_name && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.first_name}</div>}
        </div>

        {/* Last Name */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: errors.last_name ? '1px solid red' : '1px solid #ccc'
            }}
          />
          {errors.last_name && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.last_name}</div>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: errors.email ? '1px solid red' : '1px solid #ccc'
            }}
          />
          {errors.email && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.email}</div>}
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: errors.phone ? '1px solid red' : '1px solid #ccc'
            }}
          />
          {errors.phone && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.phone}</div>}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Submit */}
          <button
            type="submit"
            style={{
              background: '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              cursor: 'pointer'
            }}
            disabled={Object.values(errors).some(error => error !== '')}
          >
            Submit
          </button>

          {/* Navigate */}
          <button
            type="button"
            onClick={navigateToEditProfile}
            style={{
              background: '#007BFF',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Edit Existing Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
