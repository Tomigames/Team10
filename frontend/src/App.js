import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';


function App() {
  const [selectedSemester, setCurrentSemester] = useState('Select Semester'); // current semester
  const [semesters, setSemester] = useState([]);  // store semesters from DB
  const [courses, setCourse] = useState([]);      // store courses based on semester


  useEffect(() => {
    // GET request for semester from server
    axios.get('http://localhost:5050/api/semesters')
      .then(result => {
        const semesterData = result.data.map(row => ({
          SemYear: `${row.Semester} ${row.Year}`,
          Semester: row.Semester,
          Year: row.Year
        }));

        setSemester(semesterData);

        // defaults to Spring 2025
        const defaultSem = semesterData.find(
        sem => sem.Semester === 'Spring' && sem.Year === 2025
        );

        if (defaultSem) {
          const defaultLabel = `${defaultSem.Semester} ${defaultSem.Year}`;
          setCurrentSemester(defaultLabel);

          axios.get('http://localhost:5050/api/courses', {
            params: {
              semester: defaultSem.Semester,
              year: defaultSem.Year
            }
          })
          .then(res => setCourse(res.data))
          .catch(err => console.error('Error fetching default courses:', err));
        }
      })
      .catch(error => {
        console.error('Error fetching semesters:', error);
      });
  }, []);

  // changes courses based on the chosen semester
  const changeCourses = (semester, year) => {
    const semYear = `${semester} ${year}`;
    setCurrentSemester(semYear);
  
    axios.get('http://localhost:5050/api/courses', {
      params: { semester, year }
    })
      .then(result => {
        setCourse(result.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  };


  return ( 
  <div>
    <div className="semester">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedSemester}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {semesters.map((sem) => (
            <Dropdown.Item onClick={() => changeCourses(sem.Semester, sem.Year)}>
              {sem.Semester} {sem.Year}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>

    <div className="course-list">
      {courses.length > 0 ? (
        courses.map(course => (
          <div className="course-card" key={course.CourseID}>
            <div className="course-left">
              <div className="course-name">{course.CourseName}</div>
              <div className="course-instructor">{course.Instructor}</div>
            </div>

            <div className="course-grade">
              <span className={`grade-badge ${getGradeColor(course.OverallGrade)}`}>
                {course.OverallGrade}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  </div>
 );
}

function getGradeColor(grade) {
  if (grade >= 90) return 'green';
  if (grade >= 70) return 'yellow';
  if (grade >= 0) return 'red';
  return 'lightgray'
}



export default App;