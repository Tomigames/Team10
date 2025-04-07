-- Create database
CREATE DATABASE IF NOT EXISTS college_transcripts;
USE college_transcripts;

-- Table: Transcript
CREATE TABLE IF NOT EXISTS Transcript (
    TranscriptID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    CumulativeGPA DECIMAL(4, 3),
    Standing VARCHAR(50),
    CreditsCompleted DECIMAL(5, 2)
);

-- Table: Courses
CREATE TABLE IF NOT EXISTS Courses (
    CourseID INT AUTO_INCREMENT PRIMARY KEY,
    TranscriptID INT NOT NULL,
    CourseCode VARCHAR(20),
    CourseTitle VARCHAR(100),
    Attempted DECIMAL(4, 2),
    Earned DECIMAL(4, 2),
    Grade VARCHAR(5),
    GradePoints DECIMAL(5, 3),
    Professor VARCHAR(100),
    YearTaken YEAR,
    Term VARCHAR(20),
    FOREIGN KEY (TranscriptID) REFERENCES Transcript(TranscriptID)
);
