import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.getCourses().then(setCourses);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Your Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            <Link to={`/courses/${c.id}/weights/Spring2025`}>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
