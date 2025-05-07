// src/components/TranscriptDownloader.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import axios from 'axios';

const TranscriptDownloader = () => {
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await axios.get(`http://localhost:5051/api/transcripts/${userId}`, {
          headers: { 'x-user-id': userId }
        });
        
        // Ensure CumulativeGPA is a number
        const data = response.data;
        const processedData = {
          ...data,
          CumulativeGPA: typeof data.CumulativeGPA === 'string' ? 
            parseFloat(data.CumulativeGPA) : 
            data.CumulativeGPA || 0,
          courses: (data.courses || []).map(course => ({
            ...course,
            grade: typeof course.grade === 'string' ? 
              parseFloat(course.grade) : 
              course.grade
          }))
        };
        
        setTranscript(processedData);
        setError(null);
      } catch (err) {
        console.error('Transcript fetch error:', err);
        setError(err.response?.data?.error || 'Failed to fetch transcript');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTranscript();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [userId]);

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text('Academic Transcript', 105, 15, { align: 'center' });
      
      // Add GPA and credits
      doc.setFontSize(12);
      const gpa = typeof transcript.CumulativeGPA === 'number' ? 
        transcript.CumulativeGPA.toFixed(2) : 
        '0.00';
      doc.text(`Cumulative GPA: ${gpa}`, 20, 30);
      doc.text(`Credits Completed: ${transcript.CreditsCompleted || 0}`, 20, 40);

      // Prepare course data for table
      const tableData = (transcript.courses || []).map(course => [
        course.courseName,
        course.semester,
        course.year.toString(),
        typeof course.grade === 'number' ? course.grade.toFixed(1) : 'N/A'
      ]);

      // Add courses table
      autoTable(doc, {
        startY: 50,
        head: [['Course', 'Semester', 'Year', 'Grade']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [255, 193, 7] },
        styles: { 
          fontSize: 10,
          cellPadding: 5,
          valign: 'middle'
        }
      });

      // Download PDF
      doc.save('academic-transcript.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF');
    }
  };

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center">Loading transcript data...</div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  if (!transcript) return (
    <div className="container mt-5">
      <div className="alert alert-info">No transcript data available</div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Academic Transcript</h2>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <h5>Cumulative GPA: {transcript.CumulativeGPA.toFixed(2)}</h5>
            </div>
            <div className="col-md-6">
              <h5>Credits Completed: {transcript.CreditsCompleted || 0}</h5>
            </div>
          </div>

          <div className="table-responsive mb-4">
            <table className="table table-striped">
              <thead className="thead-light">
                <tr>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Year</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {transcript.courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.courseName}</td>
                    <td>{course.semester}</td>
                    <td>{course.year}</td>
                    <td>{typeof course.grade === 'number' ? course.grade.toFixed(1) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center">
            <button 
              onClick={downloadPDF}
              className="btn btn-primary"
              style={{
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                color: 'black'
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDownloader;