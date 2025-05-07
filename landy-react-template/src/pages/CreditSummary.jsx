// src/components/CreditSummary.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

const CreditSummary = () => {
  const { userId } = useContext(UserContext);
  const [credits, setCredits] = useState({ completed: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreditData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5050/api/users/${userId}/credits`, {
          headers: { 'x-user-id': userId }
        });
        setCredits(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching credit data:', err);
        setError('Failed to load credit information');
      } finally {
        setLoading(false);
      }
    };

    fetchCreditData();
  }, [userId]);

  if (loading) return null;
  if (error) return null;

  return (
    <>
      <p style={{ marginBottom: '12px' }}>
        <strong>Credits Completed:</strong> {credits.completed}
      </p>
      <p style={{ marginBottom: '12px' }}>
        <strong>Credits Remaining:</strong> {credits.remaining}
      </p>
    </>
  );
};

export default CreditSummary;
