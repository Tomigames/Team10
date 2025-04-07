import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function GradeWeightsEditor() {
    const { courseId, term } = useParams();
    const navigate = useNavigate();

    const [weights, setWeights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getWeights(courseId)
            .then(data => {
                setWeights(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [courseId]);

    const total = weights.reduce((sum, w) => sum + Number(w.weight), 0);

    const onWeightChange = (idx, val) => {
        const copy = [...weights];
        copy[idx].weight = val;
        setWeights(copy);
    };

    const onSave = () => {
        api.updateWeights(courseId, weights)
            .then(() => alert('Saved!'))
            .catch(() => alert('Save failed'));
    };

    const onTermChange = newTerm => {
        navigate(`/courses/${courseId}/weights/${newTerm}`);
    };

    if (loading) return <div className="container">Loading…</div>;

    return (
        <div className="container">
            {/* Main Card */}
            <div className="card">
                <div className="header">
                    <select
                        className="term-select"
                        value={term}
                        onChange={e => onTermChange(e.target.value)}
                    >
                        <option value="Fall2024">Fall 2024</option>
                        <option value="Spring2025">Spring 2025</option>
                        {/* …other terms */}
                    </select>

                    <div className="course-info">
                        <div className="course-title">{courseId}</div>
                        <div className="course-subtitle">
                            {/* WIP: fetch course name/prof from API */}
                            Course Name | Professor Name
                        </div>
                    </div>

                    <button className="button-done" onClick={onSave}>
                        Done
                    </button>
                    <div className="pill-editing">EDITING GRADE WEIGHTS</div>
                    <div className="total">{total}%</div>
                </div>

                {weights.map((w, i) => (
                    <div key={i} className="row">
                        <div className="row-label">{w.category}</div>
                        <div className="arrow">v</div>
                        <div className="pill-weight">
                            <input
                                type="number"
                                value={w.weight}
                                onChange={e => onWeightChange(i, e.target.value)}
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

            {/* Static Placeholders */}
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
