import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [gpa, setGpa] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    const userId = localStorage.getItem('userId');
 
    if (!userId) {
      setError('User not logged in');
      return;
    }
 
    axios.get(`http://localhost:5050/api/users/profile/${userId}`)
      .then(res => {
        setProfile(res.data);
        console.log('Profile response:', res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load profile');
      });
 
 
    axios.get(`http://localhost:5050/api/transcripts/${userId}`)
      .then(res => {
      setGpa(res.data.CumulativeGPA);  
    })
    .catch(err => {
      console.error(err);
      setError('Failed to load GPA');
    });
 
}, []);
 
  const handleEdit = () => {
    navigate('/edit-profile');
  };
 
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>;
  if (!profile) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading profile...</div>;
 
  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Your Profile</h1>
 
      <p style={{ marginBottom: '12px' }}>
        <strong>First Name:</strong> {profile.FirstName}
      </p>
      <p style={{ marginBottom: '12px' }}>
        <strong>Last Name:</strong> {profile.LastName}
      </p>
      <p style={{ marginBottom: '12px' }}>
        <strong>Email:</strong> {profile.Email}
      </p>
      <p style={{ marginBottom: '25px' }}>
        <strong>Phone Number:</strong> {profile.PhoneNumber}
      </p>
      <p style={{ marginBottom: '25px' }}>
        <strong>GPA:</strong> {gpa !== null ? gpa : 'Loading GPA...'}
      </p>
 
 
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleEdit}
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};
 
export default UserProfile;