--Query 1: Join cmarks and head Tables
--This query retrieves all columns from the cmarks and head tables where the HID matches.

SELECT * 
FROM cmarks 
INNER JOIN head 
ON cmarks.HID = head.HID;

--Query 2: Total Marks of All Students from HID = 246
--This query calculates the total marks of all students for a specific HID (246).

SELECT regno,marks AS total_marks
FROM cmarks 
INNER JOIN head 
ON cmarks.HID = head.HID
WHERE head.HID = 246;


--Query 4: List of All Students that Fail for HID = 246
--This query lists all students that failed (marks < 60) for a specific HID (246).

SELECT * 
FROM student 
INNER JOIN cmarks 
ON student.regno = cmarks.regno
WHERE cmarks.HID = 246
AND cmarks.marks < 60;

SELECT COUNT(*) AS number_of_students_that_fail 
FROM student 
INNER JOIN cmarks 
ON student.regno = cmarks.regno
WHERE cmarks.HID = 246
AND cmarks.marks < 60;


--Query 6: List of Students who Failed for HID = 246
--This query lists all students who failed (marks < 60) for a specific HID (246) and includes details from the recap table.
SELECT * 
FROM cmarks 
INNER JOIN recap 
ON cmarks.rid = recap.rid
WHERE cmarks.HID = 246
AND cmarks.marks < 60;

--Query 7: List of Students who Failed in a Specific Semester and Year
--This query lists all students who failed (marks < 60) for a specific HID (246) during a specific semester and year.
SELECT * 
FROM cmarks 
INNER JOIN recap 
ON cmarks.rid = recap.rid
WHERE cmarks.HID = 246
AND cmarks.marks < 60
AND recap.Semester = 'FALL'
AND recap.Year = 1952;

SELECT * 
FROM recap 
INNER JOIN course 
ON recap.CID = course.CID;


-- Query: Comprehensive view of student failures according to course
SELECT 
    COUNT(student.regno),
    --student.name,
    --cmarks.marks,
    --head.HID,
    --recap.Semester,
    --recap.Year,
    DISTINCT(course.CID)
	--DISTINCT(COURSE.TITLE)
FROM 
    student
INNER JOIN 
    cmarks ON student.regno = cmarks.regno
INNER JOIN 
    head ON cmarks.HID = head.HID
INNER JOIN 
    recap ON cmarks.rid = recap.rid
INNER JOIN 
    course ON recap.CID = course.CID
WHERE 
    cmarks.HID = 246
    AND cmarks.marks < 60;



	-- Query: Count of student failures according to course
SELECT
   -- RECAP.REGNO, STUDENT WISE 
   -- RECAP.CLASS, CLASS WISE 
   -- RECAP.YEAR, YEAR WISE 
    course.CID,
    course.TITLE,
    COUNT(student.regno) AS number_of_failures,
	--(number_of_failures/NUMBER OF STUDENT )* 100 AS 'FAILURE RATE'
	CONCAT((COUNT(student.regno)/COUNT (cmarks.HID) )* COUNT (cmarks.HID),'%') AS 'FAILURE RATE %' 
FROM 
    student
INNER JOIN 
    cmarks ON student.regno = cmarks.regno
INNER JOIN 
    head ON cmarks.HID = head.HID
INNER JOIN 
    recap ON cmarks.rid = recap.rid
INNER JOIN 
    course ON recap.CID = course.CID
WHERE 
    cmarks.HID = 246
    AND cmarks.marks < 60
	--AND RECAP.YEAR = 1952 IF YEAR WISE KAR NA HAY TOU 
	-- AND CLASS = KUCH BHI 
	-- ANB REGNO = 'KUCH BHI'
GROUP BY 
    course.CID, course.TITLE;



	----------------------------------------
	-- Query: Count of student failures and failure rate according to course
SELECT
    course.CID,
    course.TITLE,
    COUNT(student.regno) AS number_of_failures,
    CONCAT(ROUND((COUNT(student.regno) / 
                  (SELECT COUNT(*) 
                   FROM cmarks 
                   WHERE HID = 246)) * 100, 2), '%') AS 'FAILURE RATE %'
FROM 
    student
INNER JOIN 
    cmarks ON student.regno = cmarks.regno
INNER JOIN 
    head ON cmarks.HID = head.HID
INNER JOIN 
    recap ON cmarks.rid = recap.rid
INNER JOIN 
    course ON recap.CID = course.CID
WHERE 
    cmarks.HID = 246
    AND cmarks.marks < 60
GROUP BY 
    course.CID, course.TITLE;
