const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Using promise version for async/await

const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Database configuration
const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    root: 3000,
    password: "Hharshavarthan24",
    database: "gradeview"
};

// Create a pool instead of a single connection for better handling of multiple requests
const pool = mysql.createPool(dbConfig);

// Assessment class implementation
class Assessment {
    constructor(pool) {
        this.pool = pool;
    }

    async createAssessment({ CourseID, UserID, AssessmentName, WeightID, AssessmentType, IndividualGrade }) {
        try {
            const [result] = await this.pool.execute(
                "INSERT INTO assessment (CourseID, UserID, AssessmentName, WeightID, AssessmentType, IndividualGrade) VALUES (?, ?, ?, ?, ?, ?)",
                [CourseID, UserID, AssessmentName, WeightID || null, AssessmentType || null, IndividualGrade || null]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error creating assessment:", error);
            throw error;
        }
    }

    async getAssessmentList(UserID, CourseID) {
        try {
            // Get all assessments for the user and course
            const [assessments] = await this.pool.execute(
                "SELECT * FROM assessment WHERE UserID = ? AND CourseID = ?",
                [UserID, CourseID]
            );
            
            // For each assessment, get its assignments
            for (let assessment of assessments) {
                const [assignments] = await this.pool.execute(
                    "SELECT * FROM assignment WHERE AssessmentID = ?",
                    [assessment.AssessmentID]
                );
                assessment.Assignments = assignments;
            }
            
            return assessments;
        } catch (error) {
            console.error("Error fetching assessments with assignments:", error);
            throw error;
        }
    }

    async getAssignments(assessmentId) {
        try {
            const [rows] = await this.pool.execute(
                "SELECT * FROM assignment WHERE AssessmentID = ?",
                [assessmentId]
            );
            return rows;
        } catch (error) {
            console.error("Error fetching assignments:", error);
            throw error;
        }
    }

    async createAssignment(assessmentId, assignmentName, grade) {
        try {
            const [result] = await this.pool.execute(
                "INSERT INTO assignment (AssessmentID, AssignmentName, Grade) VALUES (?, ?, ?)",
                [assessmentId, assignmentName, grade]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error creating assignment:", error);
            throw error;
        }
    }

    async updateAssignment(assignmentId, assignmentName, grade) {
        try {
            await this.pool.execute(
                "UPDATE assignment SET AssignmentName = ?, Grade = ? WHERE AssignmentID = ?",
                [assignmentName, grade, assignmentId]
            );
            return true;
        } catch (error) {
            console.error("Error updating assignment:", error);
            throw error;
        }
    }

    async deleteAssignment(assignmentId) {
        try {
            await this.pool.execute(
                "DELETE FROM assignment WHERE AssignmentID = ?",
                [assignmentId]
            );
            return true;
        } catch (error) {
            console.error("Error deleting assignment:", error);
            throw error;
        }
    }

    async setIndividualGrade(AssessmentID, grade) {
        try {
            await this.pool.execute(
                "UPDATE assessment SET IndividualGrade = ? WHERE AssessmentID = ?",
                [grade, AssessmentID]
            );
            return true;
        } catch (error) {
            console.error("Error updating grade:", error);
            throw error;
        }
    }

    async setAssessmentName(AssessmentID, name) {
        try {
            await this.pool.execute(
                "UPDATE assessment SET AssessmentName = ? WHERE AssessmentID = ?",
                [name, AssessmentID]
            );
            return true;
        } catch (error) {
            console.error("Error updating assessment name:", error);
            throw error;
        }
    }

    async setAssessmentType(AssessmentID, type) {
        try {
            await this.pool.execute(
                "UPDATE assessment SET AssessmentType = ? WHERE AssessmentID = ?",
                [type, AssessmentID]
            );
            return true;
        } catch (error) {
            console.error("Error updating assessment type:", error);
            throw error;
        }
    }

    async deleteAssessment(AssessmentID) {
        try {
            await this.pool.execute(
                "DELETE FROM assessment WHERE AssessmentID = ?",
                [AssessmentID]
            );
            return true;
        } catch (error) {
            console.error("Error deleting assessment:", error);
            throw error;
        }
    }
}

// Initialize Assessment class
const assessmentManager = new Assessment(pool);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to database");
        connection.release();
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

testConnection();

// Get a specific assignment by ID
app.get("/assignment/:assignmentId", async (req, res) => {
    try {
        const assignmentId = parseInt(req.params.assignmentId);
        const [rows] = await pool.execute(
            "SELECT * FROM assignment WHERE AssignmentID = ?",
            [assignmentId]
        );
        if (rows.length === 1) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Assignment not found" });
        }
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ error: "Failed to fetch assignment" });
    }
});


// Root route to test the API
app.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM assessment");
        return res.json(rows);
    } catch (err) {
        console.error("SQL Error:", err);
        return res.status(500).json("Error");
    }
});

// Assessment routes

// Create a new assessment
app.post("/assessment", async (req, res) => {
    try {
        const { CourseID, UserID, AssessmentName, WeightID, AssessmentType, IndividualGrade } = req.body;
        
        // Validate required fields
        if (!CourseID || !UserID || !AssessmentName) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const assessmentId = await assessmentManager.createAssessment({
            CourseID,
            UserID,
            AssessmentName,
            WeightID,
            AssessmentType,
            IndividualGrade
        });
        
        res.status(201).json({
            message: "Assessment created successfully",
            assessmentId
        });
    } catch (error) {
        console.error("Error creating assessment:", error);
        res.status(500).json({ error: "Failed to create assessment" });
    }
});

// Add these routes to your server.js file

// Get all assignments for an assessment
app.get("/assessment/:id/assignments", async (req, res) => {
    try {
        const assessmentId = parseInt(req.params.id);
        const assignments = await assessmentManager.getAssignments(assessmentId);
        res.json(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});

// Create a new assignment
app.post("/assessment/:id/assignment", async (req, res) => {
    try {
        const assessmentId = parseInt(req.params.id);
        const { name, grade } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: "Assignment name is required" });
        }
        
        const assignmentId = await assessmentManager.createAssignment(assessmentId, name, grade || null);
        res.status(201).json({
            message: "Assignment created successfully",
            assignmentId
        });
    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ error: "Failed to create assignment" });
    }
});

// Update an assignment
app.put("/assignment/:id", async (req, res) => {
    try {
        const assignmentId = parseInt(req.params.id);
        const { name, grade } = req.body;
        
        await assessmentManager.updateAssignment(assignmentId, name, grade);
        res.json({ message: "Assignment updated successfully" });
    } catch (error) {
        console.error("Error updating assignment:", error);
        res.status(500).json({ error: "Failed to update assignment" });
    }
});

// Delete an assignment
app.delete("/assignment/:id", async (req, res) => {
    try {
        const assignmentId = parseInt(req.params.id);
        await assessmentManager.deleteAssignment(assignmentId);
        res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        res.status(500).json({ error: "Failed to delete assignment" });
    }
});


// Get all assessments for a course
app.get("/assessments/:courseId/:userId", async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = parseInt(req.params.userId);
        
        const assessments = await assessmentManager.getAssessmentList(userId, courseId);
        res.json(assessments);
    } catch (error) {
        console.error("Error fetching assessments:", error);
        res.status(500).json({ error: "Failed to fetch assessments" });
    }
});

// Update assessment grade
app.put("/assessment/:id/grade", async (req, res) => {
    try {
        const assessmentId = parseInt(req.params.id);
        const { grade } = req.body;
        
        if (grade === undefined) {
            return res.status(400).json({ error: "Grade is required" });
        }
        
        await assessmentManager.setIndividualGrade(assessmentId, grade);
        res.json({ message: "Grade updated successfully" });
    } catch (error) {
        console.error("Error updating grade:", error);
        res.status(500).json({ error: "Failed to update grade" });
    }
});

// Update assessment name
app.put("/assessment/:id/name", async (req, res) => {
    try {
        const assessmentId = parseInt(req.params.id);
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        
        await assessmentManager.setAssessmentName(assessmentId, name);
        res.json({ message: "Assessment name updated successfully" });
    } catch (error) {
        console.error("Error updating assessment name:", error);
        res.status(500).json({ error: "Failed to update assessment name" });
    }
});

// Update assessment type
app.put("/assessment/:id/type", async (req, res) => {
    try {
        const assessmentId = parseInt(req.params.id);
        const { type } = req.body;
        
        if (!type) {
            return res.status(400).json({ error: "Type is required" });
        }
        
        await assessmentManager.setAssessmentType(assessmentId, type);
        res.json({ message: "Assessment type updated successfully" });
    } catch (error) {
        console.error("Error updating assessment type:", error);
        res.status(500).json({ error: "Failed to update assessment type" });
    }
});

// Update assessment details (for frontend editing)
app.put("/assessment/:id", async (req, res) => {
    try {
        const assessmentId = parseInt(req.params.id);
        const { name, type, weight } = req.body;
        
        // Update assessment
        await pool.query(
            "UPDATE assessment SET AssessmentName = COALESCE(?, AssessmentName), AssessmentType = COALESCE(?, AssessmentType), WeightID = COALESCE(?, WeightID) WHERE AssessmentID = ?",
            [name, type, weight, assessmentId]
        );
        
        return res.json({ message: "Assessment updated successfully" });
    } catch (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ error: "Error updating assessment" });
    }
});

// Delete an assessment
app.delete("/assessment/:id", async (req, res) => {
    try {
        const assessmentId = parseInt(req.params.id);
        
        await assessmentManager.deleteAssessment(assessmentId);
        
        res.json({ message: "Assessment deleted successfully" });
    } catch (error) {
        console.error("Error deleting assessment:", error);
        res.status(500).json({ error: "Failed to delete assessment" });
    }
});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});