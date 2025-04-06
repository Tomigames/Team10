CREATE TABLE Transcript (
    TranscriptID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    CumulativeGPA DECIMAL(4, 3),
    Standing VARCHAR(50),
    CreditsCompleted DECIMAL(5, 2)
);

CREATE TABLE Courses (
    CourseID INT AUTO_INCREMENT PRIMARY KEY,
    TranscriptID INT,
    CourseCode VARCHAR(20),
    CourseTitle VARCHAR(100),
    Attempted DECIMAL(4, 2),
    Earned DECIMAL(4, 2),
    Grade VARCHAR(5),
    GradePoints DECIMAL(5, 3),
    Professor VARCHAR(100),
    YearTaken YEAR,
    Term VARCHAR(20), -- e.g., "Fall", "Spring"
    FOREIGN KEY (TranscriptID) REFERENCES Transcript(TranscriptID)
);
