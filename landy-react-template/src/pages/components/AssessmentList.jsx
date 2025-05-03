import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import AssessmentEditor from './AssessmentEditor';
import { api } from '../Course';

const AssessmentList = ({ 
  courseId, 
  weightId, 
  assessmentType, 
  assessments = [], 
  onAssessmentChange 
}) => {
  const { userId } = useContext(UserContext);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [addingAssessment, setAddingAssessment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localAssessments, setLocalAssessments] = useState(assessments);
  const [refreshKey, setRefreshKey] = useState(0);

  // Update local assessments when props change
  useEffect(() => {
    setLocalAssessments(assessments);
  }, [assessments]);

  // Fetch assessments when refreshKey changes
  useEffect(() => {
    const fetchAssessments = async () => {
      if (!courseId || !weightId) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await api.get(`/api/courses/${courseId}/assessments`, {
          headers: { 'x-user-id': userId }
        });
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        // Filter assessments for this weight
        const filteredAssessments = response.data.filter(
          a => a.WeightID === parseInt(weightId, 10)
        );
        
        setLocalAssessments(filteredAssessments);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError(
          err.response?.data?.error || 
          err.response?.data?.details || 
          err.message || 
          'Failed to fetch assessments'
        );
        // Keep the previous assessments in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [courseId, weightId, userId, refreshKey]);

  const handleDelete = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Deleting assessment:', {
        assessmentId,
        courseId,
        weightId,
        assessmentType
      });
      
      const response = await api.delete(`/api/assessments/${assessmentId}`, {
        headers: { 'x-user-id': userId },
        params: { courseId } // Use params instead of data for DELETE request
      });

      if (!response.data.success) {
        throw new Error('Server returned unsuccessful response');
      }
      
      console.log('Assessment deleted successfully:', {
        assessmentId,
        courseId,
        weightId,
        assessmentType,
        responseGrade: response.data.grade
      });
      
      // Remove the deleted assessment from local state
      setLocalAssessments(prev => prev.filter(a => a.AssessmentID !== assessmentId));
      
      // Notify parent component
      if (onAssessmentChange) {
        onAssessmentChange();
      }
      
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error deleting assessment:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.details || 
        err.message || 
        'Failed to delete assessment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    console.log('Assessment saved, refreshing data:', {
      courseId,
      weightId,
      assessmentType
    });
    
    setEditingAssessment(null);
    setAddingAssessment(false);
    
    // Notify parent component
    if (onAssessmentChange) {
      onAssessmentChange();
    }
    
    // Trigger local refresh
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setEditingAssessment(null);
    setAddingAssessment(false);
    setError(''); // Clear any errors when canceling
  };

  return (
    <div className="assessment-list">
      <div className="assessment-header">
        <h4>{assessmentType} Assessments</h4>
        <button 
          className="btn btn-sm btn-primary" 
          onClick={() => {
            setError(''); // Clear any errors when adding
            setAddingAssessment(true);
          }}
          disabled={loading}
        >
          Add Assessment
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {addingAssessment && (
        <AssessmentEditor
          courseId={courseId}
          weightId={weightId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {editingAssessment && (
        <AssessmentEditor
          courseId={courseId}
          weightId={weightId}
          assessment={editingAssessment}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {!addingAssessment && !editingAssessment && (
        <div className="assessment-items">
          {loading ? (
            <p className="text-muted">Loading assessments...</p>
          ) : localAssessments.length === 0 ? (
            <p className="text-muted">No assessments added yet.</p>
          ) : (
            <ul className="list-group">
              {localAssessments.map((assessment) => (
                <li key={assessment.AssessmentID} className="list-group-item">
                  <div className="assessment-item">
                    <div className="assessment-details">
                      <span className="assessment-name">{assessment.AssessmentName}</span>
                      <span className="assessment-grade">
                        {assessment.IndividualGrade !== null 
                          ? `${assessment.IndividualGrade}%` 
                          : 'Not graded'}
                      </span>
                    </div>
                    <div className="assessment-actions">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setError(''); // Clear any errors when editing
                          setEditingAssessment(assessment);
                        }}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(assessment.AssessmentID)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentList; 