CREATE DATABASE IF NOT EXISTS assessments_db;

USE assessments_db;

CREATE TABLE IF NOT EXISTS assessments (
    AssessmentID INT AUTO_INCREMENT PRIMARY KEY,
    CourseID INT NOT NULL,
    UserID INT NOT NULL,
    AssessmentName VARCHAR(255) NOT NULL,
    WeightID INT NOT NULL,
    AssessmentType ENUM('quiz', 'assignment', 'exam', 'project', 'other') NOT NULL,
    IndividualGrade DECIMAL(5,2)
);
