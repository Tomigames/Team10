// EditCourse.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import api from '../api';

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({ CourseName: '', Instructor: '', Semester: '', Year: '', CreditHours: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    api.get(`/course/${id}`)
      .then(res => {
        setCourse(res.data);
      })
      .catch(err => {
        console.error("Error fetching course:", err);
        setError(err.message || 'Failed to fetch course details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/course/${id}`, {
      UserID: userId,
      CourseName: course.CourseName,
      Instructor: course.Instructor,
      Semester: course.Semester,
      Year: course.Year,
      CreditHours: course.CreditHours,
    })
      .then(() => {
        navigate('/courses');
      })
      .catch(err => console.error('Error updating course:', err));
  };

  if (loading) {
    return <div className="container mt-5">Loading course details...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="CourseName" className="form-label">Course Name</label>
          <input type="text" className="form-control" id="CourseName" name="CourseName" value={course.CourseName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Instructor" className="form-label">Instructor</label>
          <input type="text" className="form-control" id="Instructor" name="Instructor" value={course.Instructor} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Semester" className="form-label">Semester</label>
          <input type="text" className="form-control" id="Semester" name="Semester" value={course.Semester} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Year" className="form-label">Year</label>
          <input type="text" className="form-control" id="Year" name="Year" value={course.Year} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="CreditHours" className="form-label">Credit Hours</label>
          <input type="number" className="form-control" id="CreditHours" name="CreditHours" value={course.CreditHours} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button onClick={() => navigate('/courses')} className="btn btn-secondary ms-2">Cancel</button>
      </form>
    </div>
  );
}

export default EditCourse;