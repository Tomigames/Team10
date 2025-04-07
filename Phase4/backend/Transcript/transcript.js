const mysql = require('mysql2/promise');
const PDFDocument = require('pdfkit');
const fs = require('fs');

class Transcript {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  async connect() {
    return mysql.createConnection(this.dbConfig);
  }

  async getTranscript(userId) {
    const conn = await this.connect();
    const [transcripts] = await conn.execute(
      'SELECT * FROM Transcript WHERE UserID = ?',
      [userId]
    );

    if (!transcripts.length) return null;

    const transcript = transcripts[0];
    const [courses] = await conn.execute(
      'SELECT * FROM Courses WHERE TranscriptID = ? ORDER BY YearTaken, Term',
      [transcript.TranscriptID]
    );

    transcript.courses = courses;
    await conn.end();
    return transcript;
  }

  async createTranscript(userId, cumulativeGPA, standing, credits) {
    const conn = await this.connect();
    const [result] = await conn.execute(
      `INSERT INTO Transcript (UserID, CumulativeGPA, Standing, CreditsCompleted)
       VALUES (?, ?, ?, ?)`,
      [userId, cumulativeGPA, standing, credits]
    );
    await conn.end();
    return result.insertId;
  }

  async addCourse(transcriptId, course) {
    const conn = await this.connect();
    await conn.execute(
      `INSERT INTO Courses
       (TranscriptID, CourseCode, CourseTitle, Attempted, Earned, Grade, GradePoints, Professor, YearTaken, Term)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transcriptId,
        course.code,
        course.title,
        course.attempted,
        course.earned,
        course.grade,
        course.gradePoints,
        course.professor,
        course.year,
        course.term
      ]
    );
    await conn.end();
  }

  async generatePDF(userId, year = null, outputPath = 'transcript.pdf') {
    const transcript = await this.getTranscript(userId);
    if (!transcript) throw new Error('Transcript not found');

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(20).text('Unofficial Transcript', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Student ID: ${userId}`);
    doc.text(`Standing: ${transcript.Standing}`);
    doc.text(`Cumulative GPA: ${transcript.CumulativeGPA}`);
    doc.text(`Credits Completed: ${transcript.CreditsCompleted}`);
    doc.moveDown();

    let filteredCourses = transcript.courses;
    if (year) {
      filteredCourses = transcript.courses.filter(course => course.YearTaken === year);
      doc.text(`Year: ${year}`);
    } else {
      doc.text(`Full Transcript`);
    }
    doc.moveDown();

    for (const course of filteredCourses) {
      doc.text(
        `${course.Term} ${course.YearTaken} - ${course.CourseCode}: ${course.CourseTitle} | ` +
        `Grade: ${course.Grade}, Attempted: ${course.Attempted}, Earned: ${course.Earned}, ` +
        `Points: ${course.GradePoints}, Instructor: ${course.Professor}`
      );
    }

    doc.end();
  }
}

module.exports = Transcript;
