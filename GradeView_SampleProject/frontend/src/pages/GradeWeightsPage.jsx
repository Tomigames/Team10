import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import GradeWeightsEditor from '../components/GradeWeightsEditor';

export default function GradeWeightsPage() {
  const { courseId, term } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.getCourse(courseId).then(setCourse);
  }, [courseId]);

  if (!course) return <div>Loading course info…</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>
        {course.name} — {term}
      </h2>
      <GradeWeightsEditor courseId={courseId} term={term} />
    </div>
  );
}
