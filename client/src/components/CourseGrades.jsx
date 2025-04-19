import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseGrades = ({ userId, courseId }) => {
  // state to store course grade data
  
  const [gradeError, setGradeError] = useState('');
  const [courseData, setCourseData] = useState({
    details: null,
    assessments: [],
    weights: {},
    typeAverages: {},
    cumulativeGrade: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // what if calculator states - updated to support multiple entries
  const [whatIfEntries, setWhatIfEntries] = useState([]);
  const [currentWhatIf, setCurrentWhatIf] = useState({
    type: '',
    grade: '',
  });
  const [whatIfResults, setWhatIfResults] = useState({});

  // this function will calculate the projected cumulative grade based on hypothetical entry
  const calculateWhatIf = (typeToCalculate = null) => { 
    const results = {};
    
    // Calculate for each what-if scenario
    whatIfEntries.forEach(entry => {
      let newCumulative = 0;
      
      // weights are handled based on assessment type
      Object.values(courseData.weights).forEach(group => {
        let avg = 0;

        let grades = [...group.grades];

        // add all hypothetical grades of this type
        whatIfEntries
          .filter(e => e.type === group.type)
          .forEach(e => grades.push(Number(e.grade)));

        // calculate average for assessment type
        if (grades.length > 0) {
          avg = grades.reduce((sum, g) => sum + g, 0) / grades.length;
        }

        // add weighted average to find new cumulative
        newCumulative += avg * (group.percentage / 100);
      });

      results[entry.id] = newCumulative.toFixed(2);
    });

    // Also calculate for current form values if specified
    if (typeToCalculate && currentWhatIf.grade !== "") {
      let newCumulative = 0;
      
      Object.values(courseData.weights).forEach(group => {
        let avg = 0;
        let grades = [...group.grades];

        // add all hypothetical grades including current form
        whatIfEntries
          .filter(e => e.type === group.type)
          .forEach(e => grades.push(Number(e.grade)));
        
        if (group.type === typeToCalculate) {
          grades.push(Number(currentWhatIf.grade));
        }

        if (grades.length > 0) {
          avg = grades.reduce((sum, g) => sum + g, 0) / grades.length;
        }

        newCumulative += avg * (group.percentage / 100);
      });

      setWhatIfResults({
        ...results,
        preview: newCumulative.toFixed(2)
      });
    } else {
      setWhatIfResults(results);
    }
  };

  // Validate and set numerical grade input
  const handleGradeChange = (e) => {
    const value = e.target.value;
    // Only allow numbers, empty string, or single decimal point
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setCurrentWhatIf({...currentWhatIf, grade: value});
      setGradeError('');
    } else {
      setGradeError('Please enter a numerical value!');
    }
  };

  // Add new what-if scenario
  const addWhatIfEntry = () => {
    if (currentWhatIf.type && currentWhatIf.grade) {
      const newEntry = {
        id: Date.now(),
        type: currentWhatIf.type,
        grade: currentWhatIf.grade
      };
      setWhatIfEntries([...whatIfEntries, newEntry]);
      setCurrentWhatIf({ type: '', grade: '' });
    }
  };

  // Remove what-if scenario
  const removeWhatIfEntry = (id) => {
    setWhatIfEntries(whatIfEntries.filter(entry => entry.id !== id));
  };

  // this is used to calculate average before hypothetical input - we can also use this logic in the actual calculation side when we get there
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
       
        // fetch course details and assessments
        const [courseRes, assessmentsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${courseId}?userId=${userId}`),
          axios.get(`http://localhost:5000/api/courses/${courseId}/assessments?userId=${userId}`)
        ]);

        // verify valid data
        if (!courseRes.data || !assessmentsRes.data?.length) {
          throw new Error('No course data found');
        }

        // calculate weighted average properly
        const weightGroups = assessmentsRes.data.reduce((groups, assessment) => {
          if (!groups[assessment.WeightID]) {
            groups[assessment.WeightID] = {
              type: assessment.AssessmentType,
              percentage: Number(assessment.WeightPercentage),
              grades: []
            };
          }
          // ensure grade is treated as a number, not string
          const grade = Number(assessment.IndividualGrade);
          if (!isNaN(grade)) {
            groups[assessment.WeightID].grades.push(grade);
          }
          return groups;
        }, {});

        // calculate type averages
        const typeAverages = assessmentsRes.data.reduce((averages, assessment) => {
          const grade = Number(assessment.IndividualGrade);
          if (!isNaN(grade)) {
            if (!averages[assessment.AssessmentType]) {
              averages[assessment.AssessmentType] = { total: 0, count: 0 };
            }
            averages[assessment.AssessmentType].total += grade;
            averages[assessment.AssessmentType].count++;
          }
          return averages;
        }, {});

        // calculate final grade
        // the way cumulative grade is calculated is the following - it calculates the average for each assessment type
        // then it multiples the average by the weight
        // then it adds all weighted averages together
        // i have tested this with sample input and the logic is correct
        let cumulativeGrade = 0;
        Object.values(weightGroups).forEach(group => {
          if (group.grades.length > 0) {
            const categoryAvg = group.grades.reduce((sum, grade) => sum + grade, 0) / group.grades.length;
            cumulativeGrade += categoryAvg * (group.percentage / 100);
          }
        });

        // update state
        setCourseData({
          details: courseRes.data,
          assessments: assessmentsRes.data,
          weights: weightGroups,
          typeAverages: Object.fromEntries(
            Object.entries(typeAverages).map(([type, {total, count}]) =>
              [type, (total / count).toFixed(2)]
            )
          ),
          cumulativeGrade: cumulativeGrade.toFixed(2)
        });

      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, courseId]);

  useEffect(() => {
    calculateWhatIf(currentWhatIf.type);
  }, [whatIfEntries, currentWhatIf.type, currentWhatIf.grade, courseData]);

  // loading UIs
  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading grades...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  if (!courseData.details) return <div>No course data available</div>;

  // main component being rendered
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      {/* Course Header */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h2>{courseData.details.CourseName}</h2>
        <p>Instructor: {courseData.details.Instructor}</p>
        <p>Semester: {courseData.details.Semester} {courseData.details.Year}</p>
        <div style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          <strong>Cumulative Grade: {courseData.cumulativeGrade}%</strong>
        </div>
      </div>

      {/* Assessments Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Assessment</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Type</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Weight</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {/* list of assessments and their grades */}
          {courseData.assessments.map((assessment, index) => (
            <tr
              key={assessment.AssessmentID}
              style={{
                borderBottom: '1px solid #ddd',
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
              }}
            >
              <td style={{ padding: '12px' }}>{assessment.AssessmentName}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{assessment.AssessmentType}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{assessment.WeightPercentage}%</td>
              <td style={{
                padding: '12px',
                textAlign: 'center',
                color: assessment.IndividualGrade >= 90 ? '#4CAF50' :
                       assessment.IndividualGrade >= 80 ? '#FFC107' : '#F44336'
              }}>
                {assessment.IndividualGrade}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Weight Breakdown */}
      <div style={{
        backgroundColor: '#e9f7ef',
        padding: '15px',
        borderRadius: '5px'
      }}>
        {/* Displays grade average for each assessment type */}
        <h3>Grade Composition</h3>
        {Object.entries(courseData.weights).map(([weightId, weight]) => {
          const avg = weight.grades.length > 0
            ? (weight.grades.reduce((a, b) => a + b, 0) / weight.grades.length).toFixed(2)
            : 'N/A';
          return (
            <div key={weightId} style={{ marginBottom: '10px' }}>
              <strong>{weight.type}s:</strong> {avg}% (Weight: {weight.percentage}%)
              <div style={{
                height: '10px',
                backgroundColor: '#ddd',
                borderRadius: '5px',
                marginTop: '5px'
              }}>
                <div
                  style={{
                    width: `${weight.percentage}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50',
                    borderRadius: '5px'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* What-If Calculator */}
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px',
        marginBottom: '30px',
        border: '1px solid #ffeeba'
      }}>
        {/* Below the calculated average, I have placed the what-if calculator here */}
        <h3>What-If Grade Calculator</h3>
        
        {/* Current what-if input */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <label htmlFor="type">Assessment Type:</label>
          <select
            id="type"
            value={currentWhatIf.type}
            onChange={e => setCurrentWhatIf({...currentWhatIf, type: e.target.value})}
          >
            <option value="">--Select Type--</option>
            {Object.values(courseData.weights).map(group => (
              <option key={group.type} value={group.type}>
                {group.type}
              </option>
            ))}
          </select>

          <label htmlFor="grade">Hypothetical Grade:</label>
          <input
            id="grade"
            type="text"  // Changed to text to handle input more precisely
            value={currentWhatIf.grade}
            onChange={handleGradeChange}
            min="0"
            max="100"
            placeholder="Enter %"
            pattern="[0-9]*"  // HTML5 pattern for numbers only
            inputMode="numeric"  // Shows numeric keyboard on mobile
          />

          {/* Error message goes here */}
            {gradeError && (
              <span style={{ color: 'red', marginLeft: '10px', fontSize: '0.9em' }}>
                {gradeError}
              </span>
            )}
          
          <button
            onClick={addWhatIfEntry}
            style={{
              background: '#4CAF50',
              color: 'white',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
            disabled={!currentWhatIf.type || !currentWhatIf.grade || gradeError}
          >
            Add Scenario
          </button> 
        </div>
        
        {/* List of active what-if scenarios */}
        {whatIfEntries.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <h4>Active Scenarios:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {whatIfEntries.map(entry => (
                <li key={entry.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  marginBottom: '5px',
                  borderRadius: '4px'
                }}>
                  <span>{entry.type}: {entry.grade}%</span>
                  <button
                    onClick={() => removeWhatIfEntry(entry.id)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '2px 6px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* display projected cumulative */}
        {whatIfResults.preview && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#d1ecf1',
            borderRadius: '5px',
            color: '#0c5460'
          }}>
            <strong>Preview Projected Grade:</strong> {whatIfResults.preview}%
          </div>
        )}
        
        {whatIfEntries.length > 0 && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#d4edda',
            borderRadius: '5px',
            color: '#155724'
          }}>
            <strong>Combined Projected Grade:</strong> {whatIfResults[whatIfEntries[whatIfEntries.length-1]?.id] || '0'}%
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseGrades;