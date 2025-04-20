import React, { useState } from 'react';
import GpaGoalAlerts from './GpaGoalAlert';
import NotifTrigger from './NotifTriggers';
import NotifPage from './NotifPage';

function App() {
  const [page, setPage] = useState('home'); // 'home', 'gpa', 'triggers'

  return (
    <>
      {page === 'home' && <NotifPage goTo={setPage} />}
      {page === 'gpa' && <GpaGoalAlerts goBack={() => setPage('home')} />}
      {page === 'triggers' && <NotifTrigger goBack={() => setPage('home')} />}
    </>
  );
}

export default App;
