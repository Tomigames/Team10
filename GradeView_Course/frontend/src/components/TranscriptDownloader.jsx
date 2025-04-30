// src/components/TranscriptDownloader.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../App';

const TranscriptDownloader = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDownloadTranscript = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting to download transcript for user:", userId);
      
      // Request the PDF from the backend
      const response = await api.get(`/api/users/${userId}/generate-transcript`, {
        headers: { 
          'x-user-id': userId.toString() // Ensure userId is sent as a string
        },
        responseType: 'blob' // Important: This tells axios to handle the response as a binary blob
      });
      
      // Check if we got a valid response
      if (!response.data || response.data.size === 0) {
        throw new Error("Received empty PDF data");
      }
      
      // Create a URL for the blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transcript_user_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading transcript:', err);
      
      // Improved error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${err.response.status} - ${err.response.data.error || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <button
        onClick={handleDownloadTranscript}
        disabled={isLoading}
        className="btn btn-success"
      >
        {isLoading ? 'Generating PDF...' : 'Download Transcript'}
      </button>
      
      {error && (
        <div className="alert alert-danger mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default TranscriptDownloader;