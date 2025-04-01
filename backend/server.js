const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express()

app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kansas@2309",
    database: "gradeview"
})

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to database");
});

app.get("/", (req,res) => {
    const sql = "SELECT * FROM course";
    db.query(sql, (err, data) => {
        if(err) {
            console.error("SQL Error, err");
            return res.json("Error");  
        } 
        return res.json(data)
    })
})


app.listen(8081, ()=> {
    console.log("listening")
})
