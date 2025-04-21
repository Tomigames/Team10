import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { api } from '../App';

const AssessmentEditor = ({ 
  courseId, 
  weightId, 
  assessment = null, 
  onSave, 
  onCancel 
}) => {
  const { userId } = useContext(UserContext);
  const [assessmentName, setAssessmentName] = useState(assessment?.AssessmentName || '');
  const [individualGrade, setIndividualGrade] = useState(assessment?.IndividualGrade || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!assessmentName.trim()) {
        setError('Assessment name is required');
        setLoading(false);
        return;
      }

      const grade = individualGrade ? parseFloat(individualGrade) : null;
      if (grade !== null && (isNaN(grade) || grade < 0 || grade > 100)) {
        setError('Grade must be a number between 0 and 100');
        setLoading(false);
        return;
      }

      // Convert weightId to number
      const numericWeightId = parseInt(weightId, 10);
      if (isNaN(numericWeightId)) {
        setError('Invalid weight selected');
        setLoading(false);
        return;
      }

      let response;
      if (assessment) {
        // Update existing assessment
        console.log('Updating assessment:', {
          assessmentId: assessment.AssessmentID,
          courseId,
          weightId: numericWeightId,
          assessmentName: assessmentName.trim(),
          oldGrade: assessment.IndividualGrade,
          newGrade: grade
        });
        
        response = await api.put(`/api/assessments/${assessment.AssessmentID}`, {
          courseId,
          weightId: numericWeightId,
          assessmentName: assessmentName.trim(),
          individualGrade: grade
        }, {
          headers: { 'x-user-id': userId }
        });
      } else {
        // Add new assessment
        console.log('Adding new assessment:', {
          courseId,
          weightId: numericWeightId,
          assessmentName: assessmentName.trim(),
          grade: grade
        });
        
        response = await api.post(`/api/courses/${courseId}/assessments`, {
          weightId: numericWeightId,
          assessmentName: assessmentName.trim(),
          individualGrade: grade
        }, {
          headers: { 'x-user-id': userId }
        });
      }

      if (response.data.success) {
        console.log('Assessment saved successfully:', {
          courseId,
          weightId: numericWeightId,
          assessmentName: assessmentName.trim(),
          grade: grade,
          responseGrade: response.data.grade
        });
        
        setLoading(false);
        if (onSave) onSave();
      } else {
        throw new Error('Server returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.details || 
        err.message || 
        'Failed to save assessment'
      );
      setLoading(false);
    }
  };

  return (
    <div className="assessment-editor">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="assessmentName">Assessment Name</label>
          <input
            type="text"
            id="assessmentName"
            className="form-control"
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            placeholder="Enter assessment name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="individualGrade">Grade (%)</label>
          <input
            type="number"
            id="individualGrade"
            className="form-control"
            value={individualGrade}
            onChange={(e) => setIndividualGrade(e.target.value)}
            placeholder="Enter grade (0-100)"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Saving...' : assessment ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentEditor; 