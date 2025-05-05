import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

const WeightEditor = ({ courseId, weightId, assessmentType, weightPercentage, onSave, onCancel, onWeightUpdate }) => {
  const { userId } = useContext(UserContext);
  const [weight, setWeight] = useState(weightPercentage);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update local weight state when prop changes
  useEffect(() => {
    console.log('WeightEditor: weightPercentage prop changed', { 
      weightId, 
      assessmentType, 
      weightPercentage 
    });
    setWeight(weightPercentage);
  }, [weightPercentage, weightId, assessmentType]);

  const handleSave = async () => {
    if (weight < 0 || weight > 100) {
      setError('Weight must be between 0 and 100');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const numericWeightId = parseInt(weightId, 10);
      console.log('Updating weight:', { 
        courseId, 
        weightId: numericWeightId, 
        assessmentType,
        oldWeight: weightPercentage,
        newWeight: parseFloat(weight),
        change: parseFloat(weight) - weightPercentage
      });
      
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/weights`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          updates: [{
            id: numericWeightId,
            assessmentType: assessmentType,
            newWeight: parseFloat(weight)
          }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update weight');
      }

      const data = await response.json();
      console.log('Weight updated successfully:', {
        courseId,
        weightId: numericWeightId,
        assessmentType,
        oldWeight: weightPercentage,
        newWeight: parseFloat(weight),
        change: parseFloat(weight) - weightPercentage,
        responseGrade: data.grade
      });
      
      // Call onWeightUpdate to update parent component with the new weight
      onWeightUpdate(parseFloat(weight));
      
      // Trigger a refresh of the course data without collapsing the course
      const event = new CustomEvent('refreshCourse', { 
        detail: { 
          courseId,
          preserveOpenState: true // Add a flag to preserve the open state
        } 
      });
      window.dispatchEvent(event);
      
      // Also trigger a refresh of the course list to update the overall grade
      const courseListEvent = new CustomEvent('refreshCourseList');
      window.dispatchEvent(courseListEvent);
      
      // Don't call onSave to keep the editor open
      // This allows the user to see the updated weight and continue editing if needed
    } catch (err) {
      console.error('Error updating weight:', err);
      setError(err.message || 'Failed to update weight');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="weight-editor">
      <div className="weight-editor-header">
        <h4>Edit {assessmentType} Weight</h4>
        <div className="weight-editor-actions">
          <button 
            className="save-button" 
            onClick={handleSave} 
            disabled={loading || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            className="cancel-button" 
            onClick={onCancel}
            disabled={loading || saving}
          >
            Cancel
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="weight-input-container">
        <label htmlFor="weight-input">Weight Percentage:</label>
        <input
          id="weight-input"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="weight-input"
          disabled={loading || saving}
        />
        <span className="weight-percent">%</span>
      </div>
    </div>
  );
};

export default WeightEditor; 