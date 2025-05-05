// course.jsx
import React, { useState, useEffect, createContext, useContext, useCallback, useRef, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import WeightEditor from './components/WeightEditor';
import AssessmentList from './components/AssessmentList';
import { calculateSectionAverage, calculateOverallGrade, getGradeColor } from './utils/gradeCalculations';
import { UserContext } from './UserContext'; 
import './App.css';

/* ------------ API Helper ------------ */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5050',
  headers: { 'Content-Type': 'application/json' }
});

// Add request interceptor to include userId in headers
api.interceptors.request.use(config => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

/* ------------ Course Listing & Details ------------ */
const AssessmentItem = ({ a }) => (
  <div className="assessment-item">
    <span>{a.AssessmentName}:</span>
    <span>{a.IndividualGrade!=null?`${a.IndividualGrade}%`:'N/A'}</span>
  </div>
);
const WeightSection = ({ courseId, weightId, weightPercentage, assessmentType, assessments = [], onWeightUpdate }) => {
  const { userId } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(weightPercentage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastRefreshTime = useRef(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Update currentWeight when weightPercentage prop changes
  useEffect(() => {
    console.log('WeightSection: weightPercentage prop changed', { 
      courseId, 
      weightId, 
      assessmentType, 
      weightPercentage 
    });
    setCurrentWeight(weightPercentage);
  }, [weightPercentage, courseId, weightId, assessmentType]);

  // Calculate section average
  const sectionAverage = useMemo(() => {
    const avg = calculateSectionAverage(assessments);
    // Ensure the result is a number
    return isNaN(avg) ? 0 : avg;
  }, [assessments]);

  const handleWeightUpdate = async (newWeight) => {
    setCurrentWeight(newWeight);
    onWeightUpdate(newWeight);
    
    // Trigger a refresh of the course data
    const now = Date.now();
    if (now - lastRefreshTime.current > 1000) {
      lastRefreshTime.current = now;
      const event = new CustomEvent('refreshCourse', { 
        detail: { courseId } 
      });
      window.dispatchEvent(event);
      
      // Also trigger a refresh of the course list to update the overall grade
      const courseListEvent = new CustomEvent('refreshCourseList');
      window.dispatchEvent(courseListEvent);
    }
  };

  const handleAssessmentChange = () => {
    // Only refresh if it's been more than 1 second since the last refresh
    const now = Date.now();
    if (now - lastRefreshTime.current > 1000) {
      lastRefreshTime.current = now;
      const event = new CustomEvent('refreshCourse', { 
        detail: { courseId } 
      });
      window.dispatchEvent(event);
      
      // Also trigger a refresh of the course list to update the overall grade
      const courseListEvent = new CustomEvent('refreshCourseList');
      window.dispatchEvent(courseListEvent);
    }
  };

  const handleSave = async () => {
    // Don't close the editor after saving
    // This allows the user to see the updated weight and continue editing if needed
  };

  const handleDeleteWeight = async () => {
    try {
      await api.delete(
        `/api/courses/${courseId}/weights`,
        { 
          data: { assessmentType },
          headers: { 'x-user-id': userId }
        }
      );
      
      // Trigger a refresh of the course data
      const event = new CustomEvent('refreshCourse', { 
        detail: { courseId } 
      });
      window.dispatchEvent(event);
      
      // Also trigger a refresh of the course list to update the overall grade
      const courseListEvent = new CustomEvent('refreshCourseList');
      window.dispatchEvent(courseListEvent);
    } catch (err) {
      console.error('Failed to delete weight', err);
      setError('Failed to delete weight');
    }
  };

  return (
    <div className="weight-section">
      <div className="weight-header" onClick={() => !editing && setEditing(true)}>
        <div className="weight-info">
          <span className="weight-type">{assessmentType}</span>
          <span className="weight-percentage">({currentWeight}%)</span>
          <span className="section-average">Average: {typeof sectionAverage === 'number' ? sectionAverage.toFixed(1) : '0.0'}%</span>
        </div>
        <div className="weight-actions">
          <button className="edit-weight-button" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button 
            className="delete-weight-button" 
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      
      {confirmDelete && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this assessment type and all its assessments?</p>
          <div className="confirmation-actions">
            <button onClick={handleDeleteWeight}>Yes, Delete</button>
            <button onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      {editing && (
        <WeightEditor
          courseId={courseId}
          weightId={weightId}
          assessmentType={assessmentType}
          weightPercentage={currentWeight}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          onWeightUpdate={handleWeightUpdate}
        />
      )}
      
      <AnimatePresence>
        {editing && (
          <motion.div 
            initial={{height:0,opacity:0}} 
            animate={{height:'auto',opacity:1}} 
            exit={{height:0,opacity:0}} 
            className="assessment-list"
          >
            <AssessmentList
              courseId={courseId}
              weightId={weightId}
              assessmentType={assessmentType}
              assessments={assessments}
              onAssessmentChange={handleAssessmentChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseItem = ({ c, onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userId } = useContext(UserContext);
  const fetchRef = useRef();
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  
  // ─── ADD WEIGHT STATE & HANDLERS ────────────────────────────────────────────
  const [addingWeight, setAddingWeight] = useState(false);
  const [newAssessmentType, setNewAssessmentType] = useState('');
  const [newWeightPercentage, setNewWeightPercentage] = useState('');

  const handleAddWeightSave = async () => {
    try {
      await api.post(
        `/api/courses/${c.CourseID}/weights`,
        { assessmentType: newAssessmentType, weightPercentage: newWeightPercentage },
        { headers: { 'x-user-id': userId } }
      );
      setAddingWeight(false);
      setNewAssessmentType('');
      setNewWeightPercentage('');
      fetchAssessments(); // re-load weights & assessments
      window.dispatchEvent(new CustomEvent('refreshCourseList'));
    } catch (err) {
      console.error('Failed to add weight', err);
      // you could set an error state here if desired
    }
  };

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch assessments
      console.log('CourseItem: Fetching assessments', { 
        courseId: c.CourseID, 
        courseName: c.CourseName 
      });
      const assessmentsResponse = await api.get(`/api/courses/${c.CourseID}/assessments`);
      console.log('CourseItem: Assessments fetched', { 
        courseId: c.CourseID, 
        courseName: c.CourseName,
        assessmentCount: assessmentsResponse.data.length
      });
      setAssessments(assessmentsResponse.data);
      
      // Fetch weights
      console.log('CourseItem: Fetching weights', { 
        courseId: c.CourseID, 
        courseName: c.CourseName 
      });
      const weightsResponse = await api.get(`/api/courses/${c.CourseID}/weights`);
      console.log('CourseItem: Weights fetched', { 
        courseId: c.CourseID, 
        courseName: c.CourseName,
        weightCount: weightsResponse.data.length,
        weights: weightsResponse.data
      });
      setWeights(weightsResponse.data);
      
      setError('');
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  }, [c.CourseID]);

  // Store the fetch function in a ref
  useEffect(() => {
    fetchRef.current = fetchAssessments;
  }, [fetchAssessments]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (!initialFetchDone) {
      console.log('CourseItem: Initial fetch', { 
        courseId: c.CourseID, 
        courseName: c.CourseName 
      });
      fetchAssessments();
      setInitialFetchDone(true);
    }
  }, [fetchAssessments, initialFetchDone, c.CourseID, c.CourseName]);

  // Add event listener for course refresh
  useEffect(() => {
    const handleRefresh = (event) => {
      if (event.detail.courseId === c.CourseID) {
        console.log('Course refresh event received:', {
          courseId: c.CourseID,
          preserveOpenState: event.detail.preserveOpenState
        });
        
        // Only fetch assessments if the course is open or if preserveOpenState is true
        if (open || event.detail.preserveOpenState) {
          fetchAssessments();
        }
      }
    };

    window.addEventListener('refreshCourse', handleRefresh);
    return () => window.removeEventListener('refreshCourse', handleRefresh);
  }, [c.CourseID, open]);

  // Group assessments by weight type
  const groupedAssessments = useMemo(() => {
    return weights.map(w => ({
      weightType:      w.assessmentType,
      weightPercentage: w.currentWeight,
      weightId:        w.id,
      courseId:        c.CourseID,
      assessments:     assessments.filter(a => a.WeightID === w.id)
    }));
  }, [assessments, weights, c.CourseID]);

  // Calculate overall grade
  const overallGrade = useMemo(() => {
    if (weights.length === 0 || assessments.length === 0) return c.OverallGrade || 0;
    
    // Map the weights to the expected format
    const mappedWeights = weights.map(w => ({
      WeightID: w.id,
      AssessmentType: w.assessmentType,
      WeightPercentage: w.currentWeight
    }));
    
    const courseData = {
      weights: mappedWeights,
      assessments
    };
    
    const calculatedGrade = calculateOverallGrade(courseData);
    // Ensure the result is a number
    const result = isNaN(calculatedGrade) ? 0 : calculatedGrade;
    
    // Log the grade change
    console.log(`Course ${c.CourseName} (ID: ${c.CourseID}) grade updated:`, {
      previousGrade: c.OverallGrade || 0,
      newGrade: result,
      weights: mappedWeights.map(w => ({ type: w.AssessmentType, percentage: w.WeightPercentage })),
      assessmentCount: assessments.length
    });
    
    return result;
  }, [weights, assessments, c.OverallGrade, c.CourseID, c.CourseName]);

  const gradeColor = useMemo(() => {
    return getGradeColor(overallGrade);
  }, [overallGrade]);

  return (
    <div className="course-item" data-course-id={c.CourseID}>
      <div className="course-header">
        <div className="course-details" onClick={() => setOpen(o => !o)}>
          <div className="course-name">{c.CourseName}</div>
          <div className="instructor">{c.Instructor}</div>
        </div>
        <div className="header-actions">
          <button className="edit-button" onClick={() => onEdit(c.CourseID)}>Edit</button>
          <button className="delete-button" onClick={() => onDelete(c.UserID, c.CourseID)}>Delete</button>
        </div>
        <div className={`grade ${gradeColor}`}>
          {typeof overallGrade === 'number' ? overallGrade.toFixed(1) : '0.0'}
        </div>
        {open ? <ChevronUp onClick={() => setOpen(false)} /> : <ChevronDown onClick={() => setOpen(true)} />}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{height:0,opacity:0}} 
            animate={{height:'auto',opacity:1}} 
            exit={{height:0,opacity:0}} 
            className="course-dropdown"
          >
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {/* Add Weight Form */}
                <div style={{ padding: '10px 20px' }}>
                  {addingWeight ? (
                    <div className="weight-editor">
                      <div className="weight-editor-header">
                        <h4>Add New Assessment Type</h4>
                      </div>
                      <div className="weight-input-container">
                        <label>Name:</label>
                        <input
                          type="text"
                          className="weight-input"
                          value={newAssessmentType}
                          onChange={e => setNewAssessmentType(e.target.value)}
                        />
                      </div>
                      <div className="weight-input-container">
                        <label>Weight %:</label>
                        <input
                          type="number"
                          className="weight-input"
                          value={newWeightPercentage}
                          onChange={e => setNewWeightPercentage(e.target.value)}
                        />
                        <span className="weight-percent">%</span>
                      </div>
                      <div className="weight-editor-actions">
                        <button className="save-button" onClick={handleAddWeightSave}>Save</button>
                        <button className="cancel-button" onClick={() => setAddingWeight(false)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="save-button"
                      onClick={() => setAddingWeight(true)}
                    >
                      Add Assessment Type
                    </button>
                  )}
                </div>
                
                {/* Weight Sections */}
                {groupedAssessments.length > 0 ? (
                  groupedAssessments.map((g, i) => (
                    <WeightSection 
                      key={i} 
                      courseId={g.courseId} 
                      weightId={g.weightId} 
                      weightPercentage={g.weightPercentage} 
                      assessmentType={g.weightType} 
                      assessments={g.assessments} 
                      onWeightUpdate={(newWeight) => {
                        // Dispatch a refresh event to update the course data
                        const event = new CustomEvent('refreshCourse', { 
                          detail: { courseId: g.courseId } 
                        });
                        window.dispatchEvent(event);
                      }}
                    />
                  ))
                ) : (
                  <div>No assessments.</div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function CourseList() {
  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sem, setSem] = useState('All'), [yr,setYr]=useState('All');
  const [openSem, setOpenSem] = useState(false), [openYr,setOpenYr]=useState(false);
  const { userId, isLoading } = useContext(UserContext);
  const nav = useNavigate();

  const fetch = () => {
    if (!userId || isLoading) return; // Don't fetch if userId is not available or still loading
    
    console.log('Fetching ALL course data...');
    
    api.get('/')
       .then(r => {
         console.log('All Course data fetched:', r.data);
         setAllCourses(r.data);
       })
       .catch(err => {
         console.error('Error fetching courses:', err);
       });
  };

  useEffect(fetch, [userId, isLoading]); // Add isLoading to dependencies

  // filters courses based on semesters
  useEffect(() => {
    if (!allCourses.length) return;
    let filtered = [...allCourses];
    if (sem !== 'All') filtered = filtered.filter(c => c.Semester === sem);
    if (yr !== 'All') filtered = filtered.filter(c => c.Year === yr);
    setCourses(filtered);
  }, [sem, yr, allCourses]);
  
  // Add event listener for refreshCourseList event
  useEffect(() => {
    const handleRefreshCourseList = () => {
      console.log('refreshCourseList event received, refreshing course data');
      fetch();
    };
    
    window.addEventListener('refreshCourseList', handleRefreshCourseList);
    return () => window.removeEventListener('refreshCourseList', handleRefreshCourseList);
  }, []);

  const unique = (field) => ['All', ...Array.from(new Set(allCourses.map(c => c[field])))];
  const uniqueYears = () => {
    const years = Array.from(new Set(allCourses.map(c => c.Year)));
    years.sort((a, b) => a - b); // Sorts years ascending (2023, 2024, 2025)
    return ['All', ...years];
  };

  return (
    <div className="course-container">
      <div className="header">
        <div className={`semester-dropdown ${openSem?'open':''}`}>
          <button className="semester-button" onClick={()=>setOpenSem(o=>!o)}>{sem} v</button>
          {openSem && <div className="dropdown-content">
            {unique('Semester',courses).map(s=><button key={s} className={s===sem?'active':''} onClick={()=>{setSem(s);setOpenSem(false);}}>{s}</button>)}
          </div>}
        </div>
        <div className={`semester-download ${openYr?'open':''}`}>
          <button className="download-button" onClick={()=>setOpenYr(o=>!o)}>{yr} v</button>
          {openYr && <div className="dropdown-content">
            {uniqueYears().map(y=><button key={y} className={y===yr?'active':''} onClick={()=>{setYr(y);setOpenYr(false);}}>{y}</button>)}
          </div>}
        </div>
        <button className="add-button" onClick={()=>nav('/create')}>Add Course</button>
      </div>
      <div className="course-list">
        {courses.map(c=>(
          <CourseItem key={c.CourseID} c={c} 
            onDelete={(u,id)=>api.delete(`/course/${id}`,{data:{UserID:userId}}).then(fetch)}
            onEdit={id=>nav(`/edit/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------ Create & Edit Pages ------------ */
function CreateCourse() {
  const [form, setForm] = useState({ CourseName:'',Instructor:'',Semester:'',Year:'',CreditHours:'' });
  const { userId } = useContext(UserContext);
  const nav = useNavigate();
  const change = e => setForm(f=>({ ...f, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    api.post('/course', { ...form, UserId: userId }).then(()=>nav('/courses'));
  };
  return (
    <div className="container mt-5">
      <h2>Create Course</h2>
      <form onSubmit={submit}>
        {['CourseName','Instructor','Semester','Year','CreditHours'].map(field=>(
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input 
              name={field} 
              type={field==='CreditHours'?'number':'text'} 
              className="form-control" 
              value={form[field]} 
              onChange={change} required 
            />
          </div>
        ))}
        <button className="btn btn-primary">Create</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={()=>nav('/courses')}>Cancel</button>
      </form>
    </div>
  );
}

function EditCourse() {
  const { id } = useParams();
  const { userId } = useContext(UserContext);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  useEffect(()=>{
    api.get(`/course/${id}?userId=${userId}`)
       .then(r=>setForm(r.data))
       .finally(()=>setLoading(false));
  },[id,userId]);
  const change = e => setForm(f=>({ ...f, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    api.put(`/course/${id}`, { ...form, UserID: userId }).then(()=>nav('/courses'));
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div className="container mt-5">
      <h2>Edit Course</h2>
      <form onSubmit={submit}>
        {['CourseName','Instructor','Semester','Year','CreditHours'].map(field=>(
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input 
              name={field} 
              type={field==='CreditHours'?'number':'text'} 
              className="form-control" 
              value={form[field]||''} 
              onChange={change} required 
            />
          </div>
        ))}
        <button className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={()=>nav('/courses')}>Cancel</button>
      </form>
    </div>
  );
}

export default CourseList;



