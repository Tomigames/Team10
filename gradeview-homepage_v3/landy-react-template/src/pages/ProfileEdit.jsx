import React, { useState } from 'react';
import axios from 'axios';

const ProfileEdit = () => {
  const [emailInput, setEmailInput] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleEmailLoad = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/users/user?email=${emailInput}`);
      setFormData(res.data);
      setProfileLoaded(true);
      setMessage({ text: 'Profile loaded!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'User not found or error loading profile.', type: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMsg = '';

    if ((name === 'first_name' || name === 'last_name') && value && !/^[A-Za-z]+$/.test(value)) {
      errorMsg = 'Only letters allowed';
    }
    if (name === 'phone' && value && !/^[0-9]+$/.test(value)) {
      errorMsg = 'Only numbers allowed';
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some(err => err)) {
      setMessage({ text: 'Please fix form errors', type: 'error' });
      return;
    }

    try {
      const response = await axios.put('http://localhost:5050/api/users/update', formData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error updating profile', type: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Edit Profile</h1>

      {/* Message Banner */}
      {message.text && (
        <div style={{
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          background: message.type === 'success' ? '#dff0d8' : '#f2dede',
          color: message.type === 'success' ? '#3c763d' : '#a94442'
        }}>
          {message.text}
        </div>
      )}

      {/* Step 1: Email Input */}
      {!profileLoaded && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          <button
            onClick={handleEmailLoad}
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Load Profile
          </button>
        </div>
      )}

      {/* Step 2: Editable Form */}
      {profileLoaded && (
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div style={{ marginBottom: '15px' }}>
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.first_name && <div style={{ color: 'red' }}>{errors.first_name}</div>}
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: '15px' }}>
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.last_name && <div style={{ color: 'red' }}>{errors.last_name}</div>}
          </div>

          {/* Email (read-only) */}
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}  // Allowing email to be editable
            required
            style={{ width: '100%', padding: '8px' }}
          />

          </div>

          {/* Phone */}
          <div style={{ marginBottom: '15px' }}>
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
          </div>

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
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileEdit;
