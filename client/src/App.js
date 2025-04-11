/* Kunju Menon - sxm220267 */
/* to display both my use cases, i have used tabs to noggle between user profile creation and grade calculation*/
import React, { useState } from 'react';
import ProfileForm from './components/ProfileForm';
import CourseGrades from './components/CourseGrades';

function App() {
  const [activeTab, setActiveTab] = useState('profile'); // Default to 'profile' tab

  return (
    <div className="App">
      {/* tab navigation */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        {/* user profile */}
        <button
          style={{
            padding: '10px 20px',
            background: activeTab === 'profile' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'profile' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
            marginRight: '5px',
          }}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        {/* grade calculation + what - if calculator */}
        <button
          style={{
            padding: '10px 20px',
            background: activeTab === 'grades' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'grades' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('grades')}
        >
          Course Grades
        </button>
      </div>

      {/* tab content */}
      <div>
        {activeTab === 'profile' && <ProfileForm />}
        {activeTab === 'grades' && <CourseGrades userId={1} courseId={1} />}
      </div>
    </div>
  );
}

export default App;