// CreateCourse.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext'; // Import UserContext


function CreateCourse() {
  const [courseName, setCourseName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const navigate = useNavigate();
  const { userId } = useContext(UserContext); // Access the userId

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5050/course', {
      UserId: userId, // Send the userId from the context
      CourseName: courseName,
      Instructor: instructor,
      Semester: semester,
      Year: year,
      CreditHours: creditHours,
    })
      .then(() => {
        navigate('/courses');
      })
      .catch(err => console.error('Error creating course:', err));
  };

  return (
    <div className="container mt-5">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (your form inputs for course details) */}
        <div className="mb-3">
          <label htmlFor="courseName" className="form-label" style={{ color: 'black' }}>Course Name</label>
          <input type="text" className="form-control" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="instructor" className="form-label" style={{ color: 'black' }}>Instructor</label>
          <input type="text" className="form-control" id="instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="semester" className="form-label" style={{ color: 'black' }}>Semester</label>
          <input type="text" className="form-control" id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="year" className="form-label" style={{ color: 'black' }}>Year</label>
          <input type="text" className="form-control" id="year" value={year} onChange={(e) => setYear(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="creditHours" className="form-label" style={{ color: 'black' }}>Credit Hours</label>
          <input type="number" className="form-control" id="creditHours" value={creditHours} onChange={(e) => setCreditHours(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Course</button>
        <button onClick={() => navigate('/courses')} className="btn btn-secondary ms-2">Cancel</button>
      </form>
    </div>
  );
}

export default CreateCourse;
