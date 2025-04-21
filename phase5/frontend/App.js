import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

// Define API base URL
const API_URL = 'http://localhost:8081';

function App() {
  const [assessments, setAssessments] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editAssessmentData, setEditAssessmentData] = useState({
    assessmentId: '',
    assessmentName: '',
    assessmentType: '',
    individualGrade: ''
  });
  const [userId, setUserId] = useState(1); // Default user ID, replace with actual user authentication
  const [selectedCourseId, setSelectedCourseId] = useState(1); // Default course ID

  // Fetch assessments when component mounts
  useEffect(() => {
    fetchAssessments();
  }, [selectedCourseId]);

  // Function to fetch assessments from backend
  const fetchAssessments = async () => {
    try {
      const response = await axios.get(`${API_URL}/assessments/${selectedCourseId}/${userId}`);
      console.log("Raw response data:", response.data);

      // Transform backend assessment data to match frontend structure
      const transformedAssessments = response.data.map(assessment => {
        return {
          id: assessment.AssessmentID.toString(),
          title: assessment.AssessmentName || 'Section',
          type: assessment.AssessmentType || 'section',
          weight: assessment.WeightID || 0,
          average: parseFloat(assessment.IndividualGrade) || 0.0,
          showDetails: true,
          // Transform assignments data
          assignments: assessment.Assignments ? assessment.Assignments.map(assignment => ({
            id: assignment.AssignmentID.toString(),
            name: assignment.AssignmentName,
            grade: assignment.Grade ? assignment.Grade.toString() : ""
          })) : []
        };
      });

      console.log("Transformed assessments:", transformedAssessments);
      setAssessments(transformedAssessments);

    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const toggleDetails = (assessmentId) => {
    setAssessments(assessments.map(assessment => {
      if (assessment.id === assessmentId) {
        return { ...assessment, showDetails: !assessment.showDetails };
      }
      return assessment;
    }));
  };

  const handleEditPopup = (assessmentId) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    if (assessment) {
      setEditAssessmentData({
        assessmentId,
        assessmentName: assessment.title,
        assessmentType: assessment.type || 'section',
        individualGrade: assessment.average || 0.0
      });
      setShowEditPopup(true);
    }
  };

  const saveChanges = async () => {
    try {
      // Call API to update assessment
      await axios.put(`${API_URL}/assessment/${editAssessmentData.assessmentId}`, {
        name: editAssessmentData.assessmentName,
        type: editAssessmentData.assessmentType,
        weight: editAssessmentData.weight
      });

      // Update local state
      setAssessments(assessments.map(assessment => {
        if (assessment.id === editAssessmentData.assessmentId) {
          return {
            ...assessment,
            title: editAssessmentData.assessmentName,
            type: editAssessmentData.assessmentType,
            average: parseFloat(editAssessmentData.individualGrade) || 0.0 // Ensure it's a number
          };
        }
        return assessment;
      }));

      setShowEditPopup(false);
    } catch (error) {
      console.error('Error updating assessment:', error);
      alert('Failed to update assessment. Please try again.');
    }
  };

  const addAssessment = async () => {
    try {
      // Call API to add assessment
      const response = await axios.post(`${API_URL}/assessment`, {
        CourseID: selectedCourseId,
        UserID: userId,
        AssessmentName: 'New Section',
        AssessmentType: 'section',
        IndividualGrade: 0.0
      });

      // After adding assessment, fetch the updated list
      fetchAssessments();
    } catch (error) {
      console.error('Error adding assessment:', error);
      alert('Failed to add section. Please try again.');
    }
  };

  const deleteAssessment = async (assessmentId) => {
    try {
      // Call API to delete assessment
      await axios.delete(`${API_URL}/assessment/${assessmentId}`);

      // Update local state
      setAssessments(assessments.filter(assessment => assessment.id !== assessmentId));
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Failed to delete section. Please try again.');
    }
  };

  // Fixed addAssignment function to save to backend
  const addAssignment = async (assessmentId) => {
    try {
      const assignmentCount = assessments
        .find(a => a.id === assessmentId)?.assignments?.length || 0;
      
      const assignmentName = `Assignment ${assignmentCount + 1}`;
      
      // Save assignment to backend
      const response = await axios.post(`${API_URL}/assessment/${assessmentId}/assignment`, {
        name: assignmentName,
        grade: null
      });
      
      // Get the new assignment ID from response
      const newAssignmentId = response.data.assignmentId;
      
      // Update local state
      setAssessments(assessments.map(assessment => {
        if (assessment.id === assessmentId) {
          return {
            ...assessment,
            assignments: [
              ...(assessment.assignments || []),
              {
                id: newAssignmentId.toString(),
                name: assignmentName,
                grade: ""
              }
            ]
          };
        }
        return assessment;
      }));
      
      // After adding an assignment, recalculate grades
      setTimeout(() => updateGrades(), 0);
    } catch (error) {
      console.error('Error adding assignment:', error);
      alert('Failed to add assignment. Please try again.');
      
      // Refresh data from server
      fetchAssessments();
    }
  };

  // Fixed deleteAssignment function to delete from backend
  const deleteAssignment = async (assessmentId, assignmentId) => {
    try {
      // Delete assignment from backend
      await axios.delete(`${API_URL}/assignment/${assignmentId}`);
      
      // Update local state
      setAssessments(assessments.map(assessment => {
        if (assessment.id === assessmentId) {
          return {
            ...assessment,
            assignments: (assessment.assignments || []).filter(assignment => assignment.id !== assignmentId)
          };
        }
        return assessment;
      }));

      // After removing an assignment, recalculate the overall grade
      setTimeout(() => updateGrades(), 0);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment. Please try again.');
      
      // Refresh data from server
      fetchAssessments();
    }
  };

  // Fixed updateAssignmentGrade to save to backend
  const updateAssignmentGrade = async (assessmentId, assignmentId, grade) => {
    try {
      // Update assignment grade in backend
      await axios.put(`${API_URL}/assignment/${assignmentId}`, {
        grade: grade,
        name: assessments
          .find(a => a.id === assessmentId)
          ?.assignments
          ?.find(a => a.id === assignmentId)?.name || "Assignment"
      });
      
      // Update local state
      setAssessments(assessments.map(assessment => {
        if (assessment.id === assessmentId) {
          return {
            ...assessment,
            assignments: (assessment.assignments || []).map(assignment => {
              if (assignment.id === assignmentId) {
                return { ...assignment, grade };
              }
              return assignment;
            })
          };
        }
        return assessment;
      }));

      // After updating a grade, recalculate all averages
      setTimeout(() => updateGrades(), 0);
    } catch (error) {
      console.error('Error updating assignment grade:', error);
      alert('Failed to update assignment grade. Please try again.');
    }
  };

  const updateGrades = () => {
    setAssessments(prevAssessments => prevAssessments.map(assessment => {
      // Calculate assessment averages
      const validGrades = (assessment.assignments || [])
        .map(a => parseFloat(a.grade))
        .filter(g => !isNaN(g));

      const average = validGrades.length > 0
        ? validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length
        : 0;

      // Update assessment grade in database
      if (assessment.average !== average) {
        updateAssessmentGradeInDb(assessment.id, average);
      }

      return { ...assessment, average };
    }));
  };

  // Update assessment grade in the database
  const updateAssessmentGradeInDb = async (assessmentId, grade) => {
    try {
      await axios.put(`${API_URL}/assessment/${assessmentId}/grade`, { grade });
    } catch (error) {
      console.error('Error updating assessment grade in database:', error);
    }
  };

  // Fixed updateAssignmentName to save to backend
  const updateAssignmentName = async (assessmentId, assignmentId, newName) => {
    try {
      // Get the current grade
      const currentGrade = assessments
        .find(a => a.id === assessmentId)
        ?.assignments
        ?.find(a => a.id === assignmentId)?.grade || "";
      
      // Update assignment in backend
      await axios.put(`${API_URL}/assignment/${assignmentId}`, {
        name: newName,
        grade: currentGrade
      });
      
      // Update local state
      setAssessments(assessments.map(assessment => {
        if (assessment.id === assessmentId) {
          return {
            ...assessment,
            assignments: (assessment.assignments || []).map(assignment => {
              if (assignment.id === assignmentId) {
                return { ...assignment, name: newName };
              }
              return assignment;
            })
          };
        }
        return assessment;
      }));
    } catch (error) {
      console.error('Error updating assignment name:', error);
      alert('Failed to update assignment name. Please try again.');
    }
  };

  const updateAssessmentTitle = async (assessmentId, newTitle) => {
    try {
      // Call API to update assessment name
      await axios.put(`${API_URL}/assessment/${assessmentId}/name`, {
        name: newTitle
      });

      // Update local state
      setAssessments(assessments.map(assessment => {
        if (assessment.id === assessmentId) {
          return { ...assessment, title: newTitle };
        }
        return assessment;
      }));
    } catch (error) {
      console.error('Error updating assessment title:', error);
      alert('Failed to update section title. Please try again.');
    }
  };

  const getGradeColor = (value) => {
    if (value >= 85) return 'green';
    if (value >= 70) return 'yellow';
    if (value > 0) return 'red';
    return 'gray';
  };

  // Helper function to safely format numbers
  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  return (
    <div>
      <div className="header">
        <h1>Assessment Manager</h1>
        <button className="add-assessment-btn main-btn" onClick={addAssessment}>+ Add New Assessment</button>
      </div>

      {/* Assessment List */}
      <div id="assessments">
        {assessments.map(assessment => (
          <div className="assessment" key={assessment.id} id={assessment.id}>
            <div className="assessment-header">
              <div>
                <span
                  className="assessment-title"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateAssessmentTitle(assessment.id, e.target.innerText)}
                >
                  {assessment.title}
                </span>
              </div>
              <div>
                <span
                  className={`grade-bubble ${getGradeColor(assessment.average)}`}
                  id={`${assessment.id}-grade`}
                >
                  {formatNumber(assessment.average)}
                </span>
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPopup(assessment.id);
                  }}
                >
                  ...
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAssessment(assessment.id);
                  }}
                >
                  Delete Section
                </button>
              </div>
            </div>

            <div className="dropdown" onClick={() => toggleDetails(assessment.id)}>
              {assessment.showDetails ? "^" : "v"}
            </div>

            <div className={`details ${assessment.showDetails ? "show" : ""}`}>
              <div className="assignments">
                {assessment.assignments && assessment.assignments.length > 0 ? (
                  assessment.assignments.map(assignment => (
                    <div className="item" key={assignment.id} id={assignment.id}>
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => updateAssignmentName(
                          assessment.id,
                          assignment.id,
                          e.target.innerText
                        )}
                      >
                        {assignment.name}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Grade"
                        value={assignment.grade}
                        onChange={(e) => updateAssignmentGrade(
                          assessment.id,
                          assignment.id,
                          e.target.value
                        )}
                      />
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAssignment(assessment.id, assignment.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-assignments">No assignments yet</div>
                )}
              </div>

              <div style={{ margin: '5px 0', fontWeight: 'bold' }}>
                Average: <span id={`${assessment.id}-average`}>{formatNumber(assessment.average)}</span>
              </div>

              <button
                className="add-assignment-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addAssignment(assessment.id);
                }}
              >
                + Assignment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Popup */}
      {showEditPopup && (
        <div id="editPopup" style={{ display: 'block' }}>
          <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => setShowEditPopup(false)}>✖</span>
          <div id="editFields">
            <label>
              Assessment Name:<br/>
              <input
                type="text"
                id="newAssessmentName"
                value={editAssessmentData.assessmentName}
                onChange={(e) => setEditAssessmentData({...editAssessmentData, assessmentName: e.target.value})}
              />
            </label><br/>
            <label>
              Assessment Type:<br/>
              <select
                id="newAssessmentType"
                value={editAssessmentData.assessmentType}
                onChange={(e) => setEditAssessmentData({...editAssessmentData, assessmentType: e.target.value})}
              >
                <option value="section">Section</option>
                <option value="exam">Exam</option>
                <option value="quiz">Quiz</option>
                <option value="homework">Homework</option>
                <option value="project">Project</option>
              </select>
            </label><br/>
          </div>
          <button onClick={saveChanges}>Save</button>
          <button onClick={() => setShowEditPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
