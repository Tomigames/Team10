// src/App.js
import React, { useState, useEffect, createContext, useContext, useCallback, useRef, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import WeightEditor from './components/WeightEditor';
import AssessmentList from './components/AssessmentList';
import { calculateSectionAverage, calculateOverallGrade, getGradeColor } from './utils/gradeCalculations';
import { jsPDF } from "jspdf";
import TranscriptDownloader from './components/TranscriptDownloader';

/* ------------ Context & ProtectedRoute ------------ */
export const UserContext = createContext(null);
const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(1); // Default to user ID 1
  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) setUserId(+stored);
    else {
      // Set default user ID to 1 and store in localStorage
      localStorage.setItem('userId', 1);
    }
  }, []);
  const updateUser = id => {
    localStorage.setItem('userId', id);
    setUserId(id);
  };
  return <UserContext.Provider value={{ userId, updateUser }}>{children}</UserContext.Provider>;
};
const ProtectedRoute = ({ children }) => {
  const { userId } = useContext(UserContext);
  return userId ? children : <Navigate to="/login" />;
};

/* ------------ API Helper ------------ */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
});

/* ------------ Login Page ------------ */
function LoginPage() {
  const [u, setU] = useState(''), [p, setP] = useState(''), [err, setErr] = useState('');
  const { updateUser } = useContext(UserContext);
  const nav = useNavigate();
  const submit = e => {
    e.preventDefault();
    if (u === 'testuser' && p === 'password') {
      updateUser(1);
      nav('/home');
    } else {
      setErr('Invalid username or password');
    }
  };
  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: 400 }}>
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input value={u} onChange={e => setU(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" value={p} onChange={e => setP(e.target.value)} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ------------ Home Page ------------ */
function HomePage() {
  const nav = useNavigate();
  const { userId } = useContext(UserContext);
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
          'x-user-id': userId.toString() // Ensure userId is a string
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
      setError(`Failed to download transcript: ${err.message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to GradeView</h1>
      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary m-2" onClick={()=>nav('/courses')}>View Courses</button>
        <button 
          className="btn btn-success m-2" 
          onClick={handleDownloadTranscript}
          disabled={isLoading}
        >
          {isLoading ? 'Generating PDF...' : 'Download Transcript'}
        </button>
      </div>
      {error && (
        <div className="alert alert-danger mt-2">{error}</div>
      )}
    </div>
  );
}

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
        </div>
      </div>
      
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

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch assessments
      console.log('CourseItem: Fetching assessments', { 
        courseId: c.CourseID, 
        courseName: c.CourseName 
      });
      const assessmentsResponse = await api.get(`/api/courses/${c.CourseID}/assessments`, {
        headers: { 'x-user-id': userId }
      });
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
      const weightsResponse = await api.get(`/api/courses/${c.CourseID}/weights`, {
        headers: { 'x-user-id': userId }
      });
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
  }, [c.CourseID, userId]);

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
    const groups = {};
    assessments.forEach(assessment => {
      if (!groups[assessment.WeightID]) {
        // Find the corresponding weight from the weights array
        const weight = weights.find(w => w.id === assessment.WeightID);
        
        groups[assessment.WeightID] = {
          weightType: weight ? weight.assessmentType : assessment.AssessmentType,
          weightPercentage: weight ? weight.currentWeight : assessment.WeightPercentage,
          weightId: assessment.WeightID,
          courseId: c.CourseID,
          assessments: []
        };
      }
      groups[assessment.WeightID].assessments.push(assessment);
    });
    return Object.values(groups);
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

  // Get grade color
  const gradeColorClass = useMemo(() => {
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
        <div className={`grade ${gradeColorClass}`}>
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
            ) : groupedAssessments.length > 0 ? (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
function CourseList() {
  const [courses, setCourses] = useState([]);
  const [sem, setSem] = useState('All'), [yr,setYr]=useState('All');
  const [openSem, setOpenSem] = useState(false), [openYr,setOpenYr]=useState(false);
  const { userId } = useContext(UserContext);
  const nav = useNavigate();
  const fetch = () => {
    const qs = [];
    if (sem!=='All') qs.push(`semester=${sem}`);
    if (yr!=='All') qs.push(`year=${yr}`);
    if (userId) qs.push(`userId=${userId}`);
    
    console.log('Fetching course data...');
    
    api.get(`/${qs.length?`?${qs.join('&')}`:''}`)
       .then(r => {
         console.log('Course data fetched:', r.data.map(c => ({
           courseId: c.CourseID,
           courseName: c.CourseName,
           overallGrade: c.OverallGrade
         })));
         setCourses(r.data);
       });
  };
  useEffect(fetch, [sem,yr,userId]);
  
  // Add event listener for refreshCourseList event
  useEffect(() => {
    const handleRefreshCourseList = () => {
      console.log('refreshCourseList event received, refreshing course data');
      fetch();
    };
    
    window.addEventListener('refreshCourseList', handleRefreshCourseList);
    return () => window.removeEventListener('refreshCourseList', handleRefreshCourseList);
  }, []);
  
  const unique = (field, all) => ['All', ...Array.from(new Set(all.map(c=>c[field])))] ;
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
            {unique('Year',courses).map(y=><button key={y} className={y===yr?'active':''} onClick={()=>{setYr(y);setOpenYr(false);}}>{y}</button>)}
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

/* ------------ App & Routing ------------ */
export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CourseList/></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateCourse/></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditCourse/></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/home" />} /> {/* Changed redirect from /login to /home */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
