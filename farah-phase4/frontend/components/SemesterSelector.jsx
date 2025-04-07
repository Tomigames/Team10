// Farah Khalil Ahamed Munavary (ffk220001)
// Use Cases: Show current semester and past semester views

import React, {useState, useEffect } from 'react';
import axios from 'axios'

// gets semesters from DB
const SemesterSelection = () => {
    const [semesters, setSemester] = useState([]);  // store semesters
    const [courses, setCourse] = useState([]);      // store courses based on semester
    const [selectedSemester, setCurrentSemester] = useState('');    // store semester to view

    useEffect(() => {
        axios.get('/api/semesters')
            .then(result => {
                const semesterData = result.data.map(row => ({
                    SemYear: `${row.Semester} ${row.Year}`,
                    Semester: row.Semester,
                    Year: row.Year
                }));

                setSemester(semesterData);
            })
            .catch(error => {
                console.error('Error fetching semesters:', error);
            });
    }, []);

    // update to courses from the selected semester
    const changeCourses = (event) => {
        const selectedSemester = event.target.value;
        setCurrentSemester(selectedSemester);

        const [semester, year] = selected.split(' ');

        axios.get('/api/courses', { params: { semester, year } })
            .then(result => {
                setCourse(result.data); // Update courses data
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    };

  return (
    <div>SemesterSelection</div>
  )
}

export default SemesterSelection