import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPasswordButton() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example API call (uncomment and modify):
      // await axios.post('/api/auth/reset-password', { email });
      
      setMessage('Password reset link sent to your email!');
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className="edit-button" // Reuses your existing button style
        onClick={() => setShowModal(true)}
      >
        Forgot Password?
      </button>

      {/* Modal Backdrop */}
      {showModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Modal Content */}
          <div className="weight-editor" style={{ 
            width: '400px',
            maxWidth: '90%'
          }}>
            <div className="weight-editor-header">
              <h4>Reset Password</h4>
              <button 
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                ×
              </button>
            </div>

            <div className="assessment-editor">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email"
                />
              </div>

              {message && (
                <div className={`error-message ${message.includes('sent') ? 'grade green' : 'grade red'}`}
                  style={{ padding: '10px', margin: '10px 0' }}
                >
                  {message}
                </div>
              )}

              <div className="form-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="save-button"
                  onClick={handleReset}
                  disabled={!email || isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPasswordButton;
