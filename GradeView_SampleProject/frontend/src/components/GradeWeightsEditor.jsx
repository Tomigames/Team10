import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import '../App.css';

export default function GradeWeightsEditor() {
  const { courseId, term } = useParams();
  const [weights, setWeights]   = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading]   = useState(true);
  const userId = /* INTEGRATION POINT: get from auth context */ 1;

  // In GradeWeightsEditor.jsx, inside your useEffect:
useEffect(() => {
  setLoading(true);
  api.getWeights(courseId, userId)
    .then(data => {
      console.log("💾 weights from API:", data);
      setWeights(data);
    })
    .finally(() => setLoading(false));
}, [courseId, userId]);


  const total = weights.reduce((sum, w) => sum + Number(w.currentWeight), 0);
  const toggle = () => setExpanded(e => !e);

  const onChange = (idx, val) => {
    const copy = [...weights];
    copy[idx].currentWeight = val;
    setWeights(copy);
  };

  const onDone = () => {
    const updates = weights.map(w => ({
      id:             w.id,
      assessmentType: w.AssessmentType,
      newWeight:      Number(w.currentWeight)
    }));
    api.updateWeights(courseId, userId, updates)
      .then(() => alert('Weights saved!'))
      .catch(() => alert('Save failed'));
  };

  if (loading) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <select className="term-select" value={term}>
            <option>Spring 2025</option>
            {/* …other terms… */}
          </select>

          <div className="course-info">
            <div className="course-title">{courseId}</div>
            <div className="course-subtitle">
              Software Engineering | Srimathi Srinivasan
            </div>
          </div>

          <button className="button-done" onClick={onDone}>Done</button>
          <div className="pill-editing">EDITING GRADE WEIGHTS</div>
          <div className="total">{total}%</div>
        </div>

        <div className="row" onClick={toggle}>
          <div className="row-label">
            {expanded ? '˄' : '˅'}
          </div>
        </div>

        {expanded && weights.map((w, i) => (
          <div key={w.id} className="row">
            <div className="row-label">{w.assessment_type}</div>
            <div className="arrow">v</div>
            <div className="pill-weight">
              <input
                type="number"
                value={w.currentWeight}
                onChange={e => onChange(i, e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'center'
                }}
              />%
            </div>
          </div>
        ))}
      </div>

      {/* Static placeholders */}
      <div className="placeholder-course">
        <div className="placeholder-text">
          <div>Course Number.Section</div>
          <div className="placeholder-sub">course name | professor</div>
        </div>
        <div className="arrow">v</div>
        <div className="placeholder-pill yellow"></div>
      </div>
      <div className="placeholder-course">
        <div className="placeholder-text">
          <div>Course Number.Section</div>
          <div className="placeholder-sub">course name | professor</div>
        </div>
        <div className="arrow">v</div>
        <div className="placeholder-pill red"></div>
      </div>
      <div className="placeholder-course">
        <div className="placeholder-text">
          <div>Course Number.Section</div>
          <div className="placeholder-sub">course name | professor</div>
        </div>
        <div className="arrow">v</div>
        <div className="placeholder-pill gray"></div>
      </div>
    </div>
  );
}
