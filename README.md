CLone the repo and run npm i
Then in the mySQL server create a new bwm_db
Then execute the following sql queries
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email varchar(400) not null
);

INSERT INTO users (username, password, email) VALUES ('testuser', 'password123', 'testuser@gmail.com');

select * from users;

ALTER TABLE users
ADD COLUMN first_name VARCHAR(50),
ADD COLUMN last_name VARCHAR(50);

UPDATE users
SET first_name = 'Default', last_name = 'User'
WHERE id = 1; 


CREATE TABLE term (
    termID INT AUTO_INCREMENT PRIMARY KEY,      -- Auto-incrementing term ID
    userId INT NOT NULL,                        -- Foreign key referencing users table
    Term_Name VARCHAR(100) NOT NULL,            -- Name of the term
    Term_Duration DATE DEFAULT NULL,            -- Optional term duration (can be NULL)
    FOREIGN KEY (userId) REFERENCES users(id)   -- Set up the foreign key
        ON DELETE CASCADE                       -- Cascade delete terms if user is deleted
        ON UPDATE CASCADE                       -- Cascade updates to userId
);

select * from term
select * from subject
select * from TimeTable


CREATE TABLE subject (
    subjectId INT AUTO_INCREMENT PRIMARY KEY,     -- Auto-incrementing subject ID
    subject_Name VARCHAR(100) NOT NULL,           -- Subject name (mandatory)
    termId INT NOT NULL,                          -- Foreign key referencing term table
    subject_Faculty VARCHAR(100) DEFAULT NULL,    -- Faculty name (optional)
    subject_Description TEXT DEFAULT NULL,        -- Subject description (optional)
    FOREIGN KEY (termId) REFERENCES term(termID)  -- Foreign key constraint
        ON DELETE CASCADE                         -- Cascade delete if term is deleted
        ON UPDATE CASCADE                         -- Cascade updates to termId
);

INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('jane_doe', 'password123', 'Jane', 'Doe', 'jane.doe@example.com');

CREATE TABLE TimeTable (
    time_table_id INT AUTO_INCREMENT PRIMARY KEY,     -- Auto-incrementing ID
    time_table_Name VARCHAR(100) NOT NULL,           -- Name of the timetable (mandatory)
    termId INT NOT NULL,                             -- Foreign key referencing term table
    Is_Selected BOOLEAN DEFAULT FALSE,              -- Boolean to mark as selected (default: false)
    Time_Table_Data TEXT DEFAULT NULL,              -- Optional JSON or text data for the timetable
    FOREIGN KEY (termId) REFERENCES term(termID)     -- Foreign key constraint
        ON DELETE CASCADE                            -- Cascade delete if term is deleted
        ON UPDATE CASCADE                            -- Cascade updates to termId
);

ALTER TABLE TimeTable
ADD COLUMN no_of_day_per_week INT DEFAULT 0 AFTER Time_Table_Data, -- Number of days per week (default: 0)
ADD COLUMN no_of_class_per_day INT DEFAULT 0 AFTER no_of_day_per_week; -- Number of classes per day (default: 0)

CREATE TABLE Mark_Attendance (
    AttendenceId INT AUTO_INCREMENT PRIMARY KEY, -- Auto-increment primary key
    TermId INT NOT NULL,                        -- Foreign key from Term table
    Date DATE NOT NULL,                         -- Date of attendance (not null)
    TimeTableId INT NOT NULL,                    -- Foreign key from TimeTable table
    Data TEXT DEFAULT NULL,                     -- Attendance data (can be null)
    Comment TEXT DEFAULT NULL,                  -- Additional comments (can be null)
    CONSTRAINT FK_TermId FOREIGN KEY (TermId) REFERENCES Term(TermId) ON DELETE CASCADE
);
select * from Mark_Attendance


Finally update the index.js with your credential of SQL
