// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to the GradeView App!</h1>
        <p className="lead">Navigate to your courses to manage your grades.</p>
        <hr className="my-4" />
        <p className="lead">
          <Link to="/courses" className="btn btn-primary btn-lg">View Courses</Link>
        </p>
      </div>
    </div>
  );
}

export default HomePage;