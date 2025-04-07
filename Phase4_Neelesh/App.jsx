import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GradeWeightsEditor from './components/GradeWeightsEditor';
import CreditTracker from './components/CreditTracker';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#f2f2f2', minHeight: '100vh', padding: 20 }}>
        {/* Define routes */}
        <Routes>
          {/* Redirect the root URL to a default course/term */}
          <Route
            path="/"
            element={<Navigate to="/courses/1/weights/Fall2024" replace />}
          />

          {/* Main page: show the credit tracker + grade‑weights editor */}
          <Route
            path="/courses/:courseId/weights/:term"
            element={
              <>
                {/* Top: Student Credit Tracker */}
                <CreditTracker
                  name="Jane Doe"          // WIP: replace with real data
                  netId="jdoe123"          // WIP: replace with real data
                  completed={75}           // WIP: replace with real data
                  inProgress={15}          // WIP: replace with real data
                  remaining={30}           // WIP: replace with real data
                  onEdit={() => {
                    // TODO: open your "edit credits" UI or navigate
                    console.log('Edit credits clicked');
                  }}
                />

                {/* Below: Grade Weights Editor */}
                <GradeWeightsEditor />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
