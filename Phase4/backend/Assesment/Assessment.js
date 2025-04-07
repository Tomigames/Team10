const mysql = require('mysql2/promise');

class Assessment {
    constructor(config) {
        this.config = config;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await mysql.createConnection(this.config);
        }
    }

    async createAssessment(data) {
        await this.connect();
        const {
            CourseID, UserID, AssessmentName, WeightID, AssessmentType, IndividualGrade
        } = data;
        const [result] = await this.connection.execute(
            `INSERT INTO assessments (CourseID, UserID, AssessmentName, WeightID, AssessmentType, IndividualGrade)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [CourseID, UserID, AssessmentName, WeightID, AssessmentType, IndividualGrade]
        );
        return result.insertId;
    }

    async getIndividualGrade(assessmentID) {
        await this.connect();
        const [rows] = await this.connection.execute(
            `SELECT IndividualGrade FROM assessments WHERE AssessmentID = ?`,
            [assessmentID]
        );
        return rows[0]?.IndividualGrade || null;
    }

    async setIndividualGrade(assessmentID, grade) {
        await this.connect();
        await this.connection.execute(
            `UPDATE assessments SET IndividualGrade = ? WHERE AssessmentID = ?`,
            [grade, assessmentID]
        );
    }

    async getAssessmentName(assessmentID) {
        await this.connect();
        const [rows] = await this.connection.execute(
            `SELECT AssessmentName FROM assessments WHERE AssessmentID = ?`,
            [assessmentID]
        );
        return rows[0]?.AssessmentName || null;
    }

    async setAssessmentName(assessmentID, name) {
        await this.connect();
        await this.connection.execute(
            `UPDATE assessments SET AssessmentName = ? WHERE AssessmentID = ?`,
            [name, assessmentID]
        );
    }

    async getAssessmentType(assessmentID) {
        await this.connect();
        const [rows] = await this.connection.execute(
            `SELECT AssessmentType FROM assessments WHERE AssessmentID = ?`,
            [assessmentID]
        );
        return rows[0]?.AssessmentType || null;
    }

    async setAssessmentType(assessmentID, type) {
        await this.connect();
        await this.connection.execute(
            `UPDATE assessments SET AssessmentType = ? WHERE AssessmentID = ?`,
            [type, assessmentID]
        );
    }

    async getAssessmentList(userID, courseID) {
        await this.connect();
        const [rows] = await this.connection.execute(
            `SELECT AssessmentName, IndividualGrade FROM assessments WHERE UserID = ? AND CourseID = ?`,
            [userID, courseID]
        );
        return rows;
    }
}

module.exports = Assessment;
