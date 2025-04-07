// Brendon Nguyen, bqn230000 - React - Report Generation Component
import React, { useState } from "react";
import axios from "axios";

function ReportDownload() {
  const [report, setReport] = useState(null);

  const handleDownload = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/user-report");
      setReport(res.data.report);
    } catch (err) {
      console.error("Failed to fetch report:", err);
    }
  };

  return (
    <div>
      <h2>Download Report</h2>
      <button onClick={handleDownload}>Generate Report</button>
      {report && (
        <div>
          <p><strong>GPA Goal:</strong> {report.goal}</p>
          <p><strong>Preference:</strong> {report.preference}</p>
        </div>
      )}
    </div>
  );
}

export default ReportDownload;
