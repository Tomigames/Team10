function toggleDetails(el) {
    const details = el.nextElementSibling || el.querySelector('.details');
    if (details) details.classList.toggle('show');
  }
  function showPopup() {
    document.getElementById('popup').style.display = 'block';
  }

  function hidePopup() {
    document.getElementById('popup').style.display = 'none';
  }

  function showEditPopup(courseId) {
    const course = document.getElementById(courseId);
    const courseNumber = course.querySelector(`#${courseId}-number`).innerText;
    const courseName = course.querySelector(`#${courseId}-name`).innerText;
    const professorName = course.querySelector(`#${courseId}-prof`).innerText;

    document.getElementById('editPopup').style.display = 'block';
    document.getElementById('editFields').innerHTML = `
      <label>Course Number:<br><input type="text" id="newCourseNumber" value="${courseNumber}"></label><br>
      <label>Course Name:<br><input type="text" id="newCourseName" value="${courseName}"></label><br>
      <label>Professor Name:<br><input type="text" id="newProfessorName" value="${professorName}"></label>
    `;

    document.getElementById('editPopup').setAttribute('data-course-id', courseId);
  }
  function hideEditPopup() {
    document.getElementById('editPopup').style.display = 'none';
  }

  function saveChanges() {
    const courseId = document.getElementById('editPopup').getAttribute('data-course-id');
    const newCourseNumber = document.getElementById('newCourseNumber').value;
    const newCourseName = document.getElementById('newCourseName').value;
    const newProfessorName = document.getElementById('newProfessorName').value;

    document.getElementById(`${courseId}-number`).innerText = newCourseNumber;
    document.getElementById(`${courseId}-name`).innerText = newCourseName;
    document.getElementById(`${courseId}-prof`).innerText = newProfessorName;

    hideEditPopup();
  }

  //creating assignmnets and editing assignmnets
  function addAssessment(courseId) {
    const course = document.getElementById(courseId);
    const assessmentSection = course.querySelector('.details');

    const assessmentCount = assessmentSection.querySelectorAll('.assessment').length + 1;
    const newAssessmentId = `${courseId}-assessment${assessmentCount}`;

    const newAssessmentHTML = `
      <div class="assessment" id="${newAssessmentId}">
        <div class="section-title" contenteditable="true" class="editable">
          Project ${assessmentCount}
        </div>
        <div class="assignments">
          <div class="item">
            <span contenteditable="true" class="editable">Assignment 1</span>
            <input type="text" placeholder="Grade" id="${newAssessmentId}-assignment1-grade">
            <button class="delete-btn" onclick="deleteAssignment('${newAssessmentId}-assignment1')">Delete</button>
          </div>
          <div class="item">
            <span contenteditable="true" class="editable">Assignment 2</span>
            <input type="text" placeholder="Grade" id="${newAssessmentId}-assignment2-grade">
            <button class="delete-btn" onclick="deleteAssignment('${newAssessmentId}-assignment2')">Delete</button>
          </div>
        </div>
        <button class="add-assignment-btn" onclick="addAssignment('${newAssessmentId}')">Add new Assesment</button>
      </div>
    `;

    assessmentSection.insertAdjacentHTML('beforeend', newAssessmentHTML);
  }

  function addAssignment(assessmentId) {
    const assessment = document.getElementById(assessmentId);
    const assignmentsContainer = assessment.querySelector('.assignments');

    const assignmentCount = assignmentsContainer.querySelectorAll('.item').length + 1;
    const newAssignmentId = `${assessmentId}-assignment${assignmentCount}`;

    const newAssignmentHTML = `
      <div class="item" id="${newAssignmentId}">
        <span contenteditable="true" class="editable">Assignment ${assignmentCount}</span>
        <input type="text" placeholder="Grade" id="${newAssignmentId}-grade">
        <button class="delete-btn" onclick="deleteAssignment('${newAssignmentId}')">Delete</button>
      </div>
    `;

    assignmentsContainer.insertAdjacentHTML('beforeend', newAssignmentHTML);
  }

  function deleteAssignment(assignmentId) {
    const assignment = document.getElementById(assignmentId);
    assignment.remove();
  }

  function deleteAssessment(assessmentId) {
    const assessment = document.getElementById(assessmentId);
    assessment.remove();
  }

  

  function updateGrade(course, section) {
    const inputs = document.querySelectorAll(`.assignment-input[data-course="${course}"][data-section="${section}"]`);
    let total = 0;
    let count = 0;

    inputs.forEach(input => {
      const value = parseFloat(input.value);
      if (!isNaN(value)) {
        total += value;
        count++;
      }
    });

    const average = total / count;

    // Update the average for each section
    document.getElementById(`${course}-${section}-average`).textContent = average.toFixed(1);

    // Recalculate the overall course grade based on averages of sections
    recalculateOverallGrade(course);
  }

  function recalculateOverallGrade(course) {
    const homeworkAverage = parseFloat(document.getElementById(`${course}-homework-average`).textContent);
    const quizzesAverage = parseFloat(document.getElementById(`${course}-quizzes-average`).textContent);
    const projectsAverage = parseFloat(document.getElementById(`${course}-projects-average`).textContent);

    const overallGrade = (homeworkAverage + quizzesAverage + projectsAverage) / 3;
    document.getElementById(`${course}-grade`).textContent = overallGrade.toFixed(1);
  }


  function downloadTranscript() {
    const selection = document.getElementById("yearSelect").value;
    let fileName;

    switch (selection) {
      case 'all':
        fileName = 'Transcript_All.pdf';
        break;
      case 'fall2023':
        fileName = 'Transcript_Fall_2024.pdf';
        break;
      case 'spring2023':
        fileName = 'Transcript_Spring_2024.pdf';
        break;
      case 'summer2023':
        fileName = 'Transcript_Summer_2024.pdf';
        break;
      case 'fall2024':
        fileName = 'Transcript_Fall_2024.pdf';
        break;
      case 'spring2024':
        fileName = 'Transcript_Spring_2024.pdf';
        break;
      case 'summer2025':
        fileName = 'Transcript_Summer_2024.pdf';
        break;
      case 'fall2025':
        fileName = 'Transcript_Fall_2025.pdf';
        break;
      case 'spring2025':
        fileName = 'Transcript_Spring_2025.pdf';
        break;
      case 'summer2025':
        fileName = 'Transcript_Summer_2025.pdf';
        break;
    }
    alert(`Downloading: ${fileName}`);
    // Simulate download
    const link = document.createElement("a");
    link.href = `/downloads/${fileName}`; // Replace with your actual server path
    link.download = fileName;
    link.click();
  }
    function addCourse() {
    const courseContainer = document.getElementById('courses');
    const courseCount = courseContainer.querySelectorAll('.course').length + 1;
    const newCourseId = `course${courseCount}`;

    const newCourseHTML = `
      <div class="course" id="${newCourseId}">
        <div class="course-header">
          <div>
            <div id="${newCourseId}-number" contenteditable="true" class="editable">New Course</div>
            <small id="${newCourseId}-name" contenteditable="true" class="editable">New Course Name</small>
          </div>
          <div class="grade-bubble gray" id="${newCourseId}-grade">N/A</div>
        </div>
        <div class="dropdown" onclick="toggleDetails(this)">v</div>
        <div class="details">
          <button class="add-assessment-btn" onclick="addAssessment('${newCourseId}')">Add Assesment Type</button>
        </div>
        
        <button class="edit-btn" onclick="showEditPopup('${newCourseId}')">...</button>
        <button class="delete-btn" onclick="deleteCourse('${newCourseId}')">Delete</button>
      </div>
    `;

    courseContainer.insertAdjacentHTML('beforeend', newCourseHTML);
  }


  function deleteCourse(courseId) {
    const courseElement = document.getElementById(courseId);
    courseElement.remove();
  }
  let courseCounter = 1;

function addCourse() {
const courseId = `course${courseCounter++}`;
const newCourse = document.createElement('div');
newCourse.className = 'course';
newCourse.id = courseId;

newCourse.innerHTML = `
  <div class="course-header">
    <div>
      <span id="${courseId}-number">CS101</span> - 
      <span id="${courseId}-name">Intro to Programming</span>
    </div>
    <div>
      <span class="grade-bubble green" id="${courseId}-grade">0.0</span>
      <button class="add-assessment-btn" onclick="addAssessment('${courseId}')">+ Section</button>
      <button class="delete-btn" onclick="deleteCourse('${courseId}')">Delete Course</button>
    </div>
  </div>
  <div class="details show"></div>
`;

document.getElementById('courses').appendChild(newCourse);
}

function deleteCourse(courseId) {
const course = document.getElementById(courseId);
if (course) course.remove();
}

function addAssessment(courseId) {
const course = document.getElementById(courseId);
const assessmentSection = course.querySelector('.details');
const count = assessmentSection.querySelectorAll('.assessment').length + 1;
const assessmentId = `${courseId}-assessment${count}`;

const assessmentHTML = `
  <div class="assessment section" id="${assessmentId}">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="section-title" contenteditable="true">Section ${count}</div>
      <button class="delete-btn" onclick="deleteAssessment('${courseId}', '${assessmentId}')">Delete Section</button>
    </div>
    <div class="assignments"></div>
    <div style="margin: 5px 0; font-weight: bold;">Average: <span id="${assessmentId}-average">0.0</span></div>
    <button class="add-assignment-btn" onclick="addAssignment('${courseId}', '${assessmentId}')">+ Assignment</button>
  </div>
`;
assessmentSection.insertAdjacentHTML('beforeend', assessmentHTML);
recalculateOverallGrade(courseId);
}

function deleteAssessment(courseId, assessmentId) {
const assessment = document.getElementById(assessmentId);
if (assessment) assessment.remove();
recalculateOverallGrade(courseId);
}

function addAssignment(courseId, assessmentId) {
const assignmentsContainer = document.getElementById(assessmentId).querySelector('.assignments');
const assignmentCount = assignmentsContainer.querySelectorAll('.item').length + 1;
const assignmentId = `${assessmentId}-assignment${assignmentCount}`;

const assignmentHTML = `
  <div class="item" id="${assignmentId}">
    <span contenteditable="true">Assignment ${assignmentCount}</span>
    <input type="number" min="0" max="100" placeholder="Grade" oninput="updateGrades('${courseId}')">
    <button class="delete-btn" onclick="deleteAssignment('${courseId}', '${assignmentId}')">Delete</button>
  </div>
`;

assignmentsContainer.insertAdjacentHTML('beforeend', assignmentHTML);
}

function deleteAssignment(courseId, assignmentId) {
const assignment = document.getElementById(assignmentId);
if (assignment) assignment.remove();
updateGrades(courseId);
}

function updateGrades(courseId) {
const course = document.getElementById(courseId);
const assessments = course.querySelectorAll('.assessment');
let totalSum = 0;
let totalCount = 0;

assessments.forEach(assessment => {
  const inputs = assessment.querySelectorAll('input[type="number"]');
  let sum = 0, count = 0;

  inputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
      sum += val;
      count++;
    }
  });

  const avg = count > 0 ? (sum / count) : 0;
  const averageElement = assessment.querySelector(`#${assessment.id}-average`);
  if (averageElement) averageElement.textContent = avg.toFixed(1);

  totalSum += sum;
  totalCount += count;
});

const overall = totalCount > 0 ? (totalSum / totalCount) : 0;
const gradeBubble = course.querySelector('.grade-bubble');
gradeBubble.textContent = overall.toFixed(1);
updateGradeColor(gradeBubble, overall);
}

function updateGradeColor(el, value) {
el.classList.remove('green', 'yellow', 'red', 'gray');
if (value >= 85) el.classList.add('green');
else if (value >= 70) el.classList.add('yellow');
else if (value > 0) el.classList.add('red');
else el.classList.add('gray');
}