Class: 3354.002 </br>
Professor: Srimathi Srinivasan

<h1>Team Details:</h1>
Team #10 </br>
Team Name:  GradeView </br></br>
<b>Team names:</b>

- Kunju Menon

- Amulya Prasad Rayabhagi

- Farah Khalil Ahamed

- Aashish Kambala

- Tomas Ariasi

- Neelesh Iyer

- Rizvy Rahman-Danish

- Brendon Nguyen

<h1>Statement of Work:</h1>  </br>
<b>Introduction & Background Information:</b> 
We are a group of Computer Science students at the University of Texas at Dallas looking to create a convenient way to navigate classes by assisting you in tracking your grades. As college students, we often find it difficult to track our grades through eLearning, and this app is the perfect way to view our grades, GPA and students' academic standing across multiple semesters.  
</br></br>
Many students realize their final weighted grades at the midpoint or at the end of the semester and realize that they are failing a class that they assumed they were doing well. This is not only inconvenient for students but instructors as well because they have to scramble to accommodate the students’ requests at the last minute. This app minimizes the toll students and professors would take to manage the grades by automatically calculating and notifying the students of a lower grade. Hence, creating a better way to track your grades and your time.  
</br></br>
<b>Objectives:</b>

- Provide students with an easy-to-use app to monitor their weighted grades in real time  

- Provide automatic GPA calculations  

- Send notifications to alert students if their grades fall below a certain grade threshold  

- Minimize stress for students by reducing last-minute grade calculations  

- Allow students to always know where their grades stand and seek help if needed early on  

- Allows grade changes from professors to occur in timely manner 

<b>Purpose:</b>
GradeView is an app aimed to help students evaluate their academic performance by providing a user-friendly way to track grades in eLearning throughout the semester as well as calculate cumulative GPAs. Many students often struggle to calculate their final weighted grades due to the hassle of finding the weights of each assignment in the course information or in the syllabus. As a result, this can cause unnecessary stress as students are often unable to take action to fix their grades or seek extra help until it is too late. Our app seeks to change this. By notifying students of grade drops immediately, GradeView allows students to dynamically monitor their grades and take action to seek help if necessary. Ultimately, this project provides a more efficient learning experience by facilitating the process of calculating and viewing grades. It offers a sense of relief and control over academics for both students and professors. 
</br></br>
<b>Targeted users: </b>
Our website will target students that are taking multiple courses. More specifically, GradeView aims to meet the needs of college students. These college students will want a way to quickly calculate and track their grades without having to go through the hassle of finding the weights of each assignment for individual courses. Additionally, the app will indirectly target professors as the amount of grade confusion they will have to deal with will decrease drastically as a result of the warning system.  
</br>
<b>Scope and Tasks:</b>
- User Authentication/Log in 

- Blackboard API integration for grades of the courses 

- Classifying weights of categories within specific courses 

- Change color of class title to indicate academic standing in course 

- Calculating final grade 

- Notifying user when grade is below 70
</br>
  <b>Future Work:</b> </br>

- Integration with blackboard
  
- What-If Grade Calculator 

- Dark Mode & UI Customization 

- Custom Notifications & Reminders 

- Data Export & Reporting 

- AI-Powered Performance Insights
</br>
<b>Potential risks: </b> </br></br>

- Limited Server Capacity
- Data Security
</br>
<b>Milestones/Due Date: </b>
</br>
  
Milestones -------------------------------------------------------------------------------------------  Due Dates  </br>
Phase 1: Statement of work ------------------------------------------------------------------------- 02/16/2025 </br>
Phase 2: Create a prototype of our system --------------------------------------------------------- 03/2/2025 </br>
Phase 3: Creating the architecture of our system--------------------------------------------------- 03/16/2025 </br>
Phase 4: Final integration of our work--------------------------------------------------------------- 04/06/2025 </br>
Phase 5: App prototype & final presentation preperation------------------------------------------ 04/20/2025 </br>
Phase 6: Project Presentation Demo ---------------------------------------------------------------- 04/26/2025 </br>




<h1>This is the setup to run our program.</h1>

## Technologies Used

* **Frontend:** React.js
* **Backend:** Node.js
* **Database:** MySQL

## Getting Started

Follow the instructions below to set up and run both the frontend and backend of the application.

### Frontend Setup

1.  **Navigate to the Frontend Directory:**
    Open your terminal or command prompt and navigate to the directory containing the frontend code.

    ```bash
    cd landy-react-template
    ```

2.  **Install Dependencies:**
    Install the necessary npm packages by running:

    ```bash
    npm install
    ```

3.  **Run the Frontend Development Server:**
    Start the React development server with the command:

    ```bash
    npm start
    ```

    This will usually open the application in your web browser at `http://localhost:3000`.

### Backend Setup

1.  **Ensure MySQL is Running:**
    Make sure your MySQL database server is running in the background before proceeding.

2.  **Execute Stored Procedures:**
    Navigate to the `routines` directory (or wherever your SQL routine files are located). Using a MySQL client like MySQL Workbench, connect to your database and execute the SQL scripts in these files. This step is essential to ensure the backend can utilize the required stored procedures.

3.  **Navigate to the Backend Directory (or Root):**
    Open a new terminal or command prompt and navigate to the root directory of your project or the specific backend directory if your project is structured that way.

    ```bash
    cd backend  # If your backend code is in a 'backend' folder
    # or
    cd ..       # If your backend code is in the project root
    ```

4.  **Run the Backend Server:**
    Start the Node.js backend server using the command:

    ```bash
    node app.js
    ```

    Replace `server.js` with the actual name of your main backend server file if it's different. The backend server will typically run on a specific port (e.g., `http://localhost:5000`), which will be defined in your backend code.

Once both the frontend and backend are running, you should be able to access the full application through your web browser at the address provided by the frontend development server (usually `http://localhost:3000`). Ensure that your backend API endpoints are correctly configured in your frontend to communicate with the Node.js server.





