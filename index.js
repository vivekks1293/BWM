const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Your MySQL password
    database: 'bwm_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT id, username, first_name, last_name, email FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length > 0) {
            const user = results[0]; // Get the first matching user
            res.json({
                success: true,
                message: 'Login successful!',
                user: {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                },
            });
        } else {
            res.json({
                success: false,
                message: 'Invalid username or password',
            });
        }
    });
});

app.post('/terms', (req, res) => {
    const { userId, Term_Name, Term_Duration } = req.body;

    const query = `INSERT INTO term (userId, Term_Name, Term_Duration) VALUES (?, ?, ?)`;

    db.query(query, [userId, Term_Name, Term_Duration], (err, results) => {
        if (err) {
            console.error('Error inserting term:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Term added successfully!', termId: results.insertId });
    });
});

app.get('/terms/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `SELECT * FROM term WHERE userId = ?`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching terms:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, terms: results });
    });
});
app.put('/terms', (req, res) => {
    const { termID, Term_Name, Term_Duration } = req.body;

    const query = `UPDATE term SET Term_Name = ?, Term_Duration = ? WHERE termID = ?`;

    db.query(query, [Term_Name, Term_Duration, termID], (err, results) => {
        if (err) {
            console.error('Error updating term:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Term updated successfully!' });
    });
});

// Fetch subjects for a specific term
app.get('/subjects/:termId', (req, res) => {
    const termId = req.params.termId;

    const query = `SELECT * FROM subject WHERE termId = ?`;

    db.query(query, [termId], (err, results) => {
        if (err) {
            console.error('Error fetching subjects:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, subjects: results });
    });
});

// Add a new subject
app.post('/subjects', (req, res) => {
    const { subject_Name, termId, subject_Faculty, subject_Description } = req.body;

    const query = `INSERT INTO subject (subject_Name, termId, subject_Faculty, subject_Description) VALUES (?, ?, ?, ?)`;

    db.query(query, [subject_Name, termId, subject_Faculty, subject_Description], (err, results) => {
        if (err) {
            console.error('Error adding subject:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Subject added successfully!', subjectId: results.insertId });
    });
});

// Update a subject
app.put('/subjects', (req, res) => {
    const { subjectId, subject_Name, subject_Faculty, subject_Description } = req.body;

    const query = `UPDATE subject SET subject_Name = ?, subject_Faculty = ?, subject_Description = ? WHERE subjectId = ?`;

    db.query(query, [subject_Name, subject_Faculty, subject_Description, subjectId], (err, results) => {
        if (err) {
            console.error('Error updating subject:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Subject updated successfully!' });
    });
});

app.get('/timetables/:termId', (req, res) => {
    const termId = req.params.termId;

    const query = `SELECT * FROM TimeTable WHERE termId = ?`;

    db.query(query, [termId], (err, results) => {
        if (err) {
            console.error('Error fetching timetables:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, timetables: results });
    });
});

app.post('/timetables', (req, res) => {
    const { time_table_Name, termId, no_of_day_per_week, no_of_class_per_day } = req.body;

    const query = `
        INSERT INTO TimeTable (time_table_Name, termId, no_of_day_per_week, no_of_class_per_day)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [time_table_Name, termId, no_of_day_per_week, no_of_class_per_day], (err, results) => {
        if (err) {
            console.error('Error adding timetable:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Timetable added successfully!', time_table_id: results.insertId });
    });
});

app.put('/timetables', (req, res) => {
    const { time_table_id, time_table_Name, no_of_day_per_week, no_of_class_per_day } = req.body;

    const query = `
        UPDATE TimeTable
        SET time_table_Name = ?, no_of_day_per_week = ?, no_of_class_per_day = ?
        WHERE time_table_id = ?
    `;

    db.query(query, [time_table_Name, no_of_day_per_week, no_of_class_per_day, time_table_id], (err, results) => {
        if (err) {
            console.error('Error updating timetable:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Timetable updated successfully!' });
    });
});

app.put('/timetables/select', (req, res) => {
    const { time_table_id, termId } = req.body;

    // Set all timetables for the term to not selected
    const query1 = `UPDATE TimeTable SET is_selected = FALSE WHERE termId = ?`;

    db.query(query1, [termId], (err) => {
        if (err) {
            console.error('Error resetting is_selected:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        // Set the selected timetable to true
        const query2 = `UPDATE TimeTable SET is_selected = TRUE WHERE time_table_id = ?`;

        db.query(query2, [time_table_id], (err) => {
            if (err) {
                console.error('Error updating is_selected:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            res.json({ success: true, message: 'Timetable selection updated!' });
        });
    });
});

app.get('/timetables/details/:id', (req, res) => {
    const timetableId = req.params.id;

    const query = `
        SELECT time_table_Name, no_of_day_per_week, no_of_class_per_day, Time_Table_Data 
        FROM TimeTable
        WHERE time_table_id = ?
    `;

    db.query(query, [timetableId], (err, results) => {
        if (err) {
            console.error('Error fetching timetable details:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Timetable not found' });
        }

        res.json({ success: true, timetable: results[0] });
    });
});

app.put('/timetables/update-data', (req, res) => {
    const { time_table_id, time_table_data } = req.body;

    const query = `
        UPDATE TimeTable
        SET Time_Table_Data = ?
        WHERE time_table_id = ?
    `;

    db.query(query, [time_table_data, time_table_id], (err, results) => {
        if (err) {
            console.error('Error updating timetable data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Timetable data updated successfully!' });
    });
});

app.get('/timetables/active/:termId', (req, res) => {
    const termId = req.params.termId;

    const query = `
        SELECT time_table_id, time_table_Name, Time_Table_Data, no_of_day_per_week, no_of_class_per_day
        FROM TimeTable
        WHERE Is_Selected = TRUE AND termId = ?
        LIMIT 1
    `;

    db.query(query, [termId], (err, results) => {
        if (err) {
            console.error('Error fetching active timetable:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No active timetable found for this term.' });
        }

        res.json({ success: true, timetable: results[0] });
    });
});

app.get('/mark-attendance/:termId', (req, res) => {
    const termId = req.params.termId;

    const query = `
        SELECT 
            TT.time_table_id,
            TT.time_table_Name,
            TT.no_of_day_per_week,
            TT.no_of_class_per_day,
            MA.AttendenceId,
            MA.Date,
            MA.Comment,
            MA.Data
        FROM TimeTable TT
        LEFT JOIN Mark_Attendance MA ON TT.time_table_id = MA.TimeTableId
        WHERE TT.Is_Selected = TRUE AND TT.termId = ?
    `;

    db.query(query, [termId], (err, results) => {
        if (err) {
            console.error('Error fetching active timetable and attendance details:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No active timetable or attendance records found.' });
        }

        const timetable = {
            time_table_id: results[0].time_table_id,
            time_table_Name: results[0].time_table_Name,
            no_of_day_per_week: results[0].no_of_day_per_week,
            no_of_class_per_day: results[0].no_of_class_per_day,
            attendanceRecords: results[0].AttendenceId
                ? results.map((row) => ({
                      AttendenceId: row.AttendenceId,
                      Date: row.Date,
                      Comment: row.Comment,
                      Data: row.Data,
                  }))
                : [],
        };

        res.json({ success: true, timetable });
    });
});

// app.post('/mark-attendance', (req, res) => {
//     const { termId, date, timeTableId } = req.body;

//     const query = `
//         INSERT INTO Mark_Attendance (TermId, Date, TimeTableId, Comment)
//         VALUES (?, ?, ?, NULL)
//     `;

//     db.query(query, [termId, date, timeTableId], (err, results) => {
//         if (err) {
//             console.error('Error adding attendance record:', err);
//             return res.status(500).json({ success: false, message: 'Server error' });
//         }

//         res.json({ success: true, message: 'Attendance record added successfully!' });
//     });
// });
app.post('/mark-attendance', (req, res) => {
    const { termId, date, timeTableId } = req.body;

    // Query to get Time_Table_Data from the TimeTable table
    const getTimeTableQuery = `
        SELECT Time_Table_Data
        FROM TimeTable
        WHERE time_table_id = ?
    `;

    db.query(getTimeTableQuery, [timeTableId], (err, timetableResults) => {
        if (err) {
            console.error('Error fetching timetable data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (timetableResults.length === 0) {
            return res.status(404).json({ success: false, message: 'Timetable not found.' });
        }

        // Parse the Time_Table_Data
        let timeTableData;
        try {
            timeTableData = JSON.parse(timetableResults[0].Time_Table_Data) || [];
        } catch (parseError) {
            console.error('Error parsing timetable data:', parseError);
            return res.status(500).json({ success: false, message: 'Error parsing timetable data.' });
        }

        // Add Comments and IsPresent properties
        const attendanceData = timeTableData.map((row) =>
            row.map((cell) => ({
                ...cell,
                Comments: null,
                IsPresent: null,
            }))
        );

        // Insert data into Mark_Attendance table
        const insertQuery = `
            INSERT INTO Mark_Attendance (TermId, Date, TimeTableId, Data, Comment)
            VALUES (?, ?, ?, ?, NULL)
        `;

        db.query(
            insertQuery,
            [termId, date, timeTableId, JSON.stringify(attendanceData)],
            (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('Error adding attendance record:', insertErr);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                res.json({ success: true, message: 'Attendance record added successfully!' });
            }
        );
    });
});


app.delete('/mark-attendance/:attendenceId', (req, res) => {
    const attendenceId = req.params.attendenceId;

    const query = `
        DELETE FROM Mark_Attendance 
        WHERE AttendenceId = ?
    `;

    db.query(query, [attendenceId], (err, results) => {
        if (err) {
            console.error('Error deleting attendance record:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found.' });
        }

        res.json({ success: true, message: 'Attendance record deleted successfully!' });
    });
});

app.put('/mark-attendance/:attendenceId', (req, res) => {
    const attendenceId = req.params.attendenceId;
    const { date } = req.body;

    const query = `
        UPDATE Mark_Attendance
        SET Date = ?
        WHERE AttendenceId = ?
    `;

    db.query(query, [date, attendenceId], (err, results) => {
        if (err) {
            console.error('Error updating attendance record:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found.' });
        }

        res.json({ success: true, message: 'Attendance record updated successfully!' });
    });
});

app.get('/mark-attendance/details/:attendenceId', (req, res) => {
    const attendenceId = req.params.attendenceId;

    const query = `
        SELECT 
            AttendenceId,
            TermId,
            Date,
            TimeTableId,
            Data,
            Comment
        FROM Mark_Attendance
        WHERE AttendenceId = ?
    `;

    db.query(query, [attendenceId], (err, results) => {
        if (err) {
            console.error('Error fetching attendance details:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found.' });
        }

        res.json({ success: true, attendance: results[0] });
    });
});

app.get('/timetables/datedetails/:timetableId', (req, res) => {
    const timetableId = req.params.timetableId;

    const query = `
        SELECT 
            time_table_Name,
            Time_Table_Data,
            no_of_day_per_week,
            no_of_class_per_day
        FROM TimeTable
        WHERE time_table_id = ?
    `;

    db.query(query, [timetableId], (err, results) => {
        if (err) {
            console.error('Error fetching timetable details:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Timetable not found.' });
        }

        res.json({ success: true, timetable: results[0] });
    });
});

app.put('/mark-attendance/update-data/:attendenceId', (req, res) => {
    const attendenceId = req.params.attendenceId;
    const { timetableGrid } = req.body; // Expect timetableGrid as a string in the request body

    // Check if timetableGrid is provided
    if (!timetableGrid || typeof timetableGrid !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid or missing timetableGrid data.' });
    }

    // Update the Data column for the given attendenceId
    const updateQuery = `
        UPDATE Mark_Attendance
        SET Data = ?
        WHERE AttendenceId = ?
    `;

    db.query(updateQuery, [timetableGrid, attendenceId], (err, results) => {
        if (err) {
            console.error('Error updating attendance data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found.' });
        }

        res.json({ success: true, message: 'Attendance record updated successfully!' });
    });
});

app.get('/mark-attendance/by-timetable/:timetableId', (req, res) => {
    const timetableId = req.params.timetableId;

    const query = `
        SELECT 
            AttendenceId,
            TermId,
            Date,
            TimeTableId,
            Data,
            Comment
        FROM Mark_Attendance
        WHERE TimeTableId = ?
    `;

    db.query(query, [timetableId], (err, results) => {
        if (err) {
            console.error('Error fetching attendance records:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, attendanceRecords: results });
    });
});





// testuser, jane_doe / password123
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
