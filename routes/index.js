import express, { query } from "express";
const router = express.Router();
import { sql } from "../db.js";

router.get("/", function (req, res) {
    res.render("index", { locals: { title: "Welcome!" } });
});


// Get all faculty
router.get("/faculty", async (req, res, next) => {
    try {
        const faculty = await sql`SELECT * FROM faculty`;
        res.status(200).json(faculty);
    } catch (err) {
        next(err);
    }
});

router.get("/years", async (req, res) => {
    try {
        const years = await sql`SELECT DISTINCT(year) FROM recap ORDER BY Year;`;
        console.log(years)
        res.status(200).json(years);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/semesters", async (req, res) => {
    try {
        const semesters = await sql`SELECT DISTINCT(Semester) FROM recap ORDER BY Semester;`;
        console.log(semesters)
        res.status(200).json(semesters);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get(`/batch/:year/:semester`, async (req, res) => {
    try {
        const { year, semester } = req.params;
        const batches = await sql`SELECT DISTINCT(Class) FROM recap WHERE Year = ${year} AND Semester = ${semester} ORDER BY Class;`;
        res.status(200).json(batches);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get(`/batch/:year/:semester/:batch`, async (req, res) => {
    try {
        const { year, semester, batch } = req.params;
        const recaps = await sql`SELECT r.*, c.title FROM recap r, course c WHERE r.cid = c.cid AND Year = ${year} AND Semester = ${semester} AND Class = ${batch};`;
        res.status(200).json(recaps);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get(`/recap/:rid`, async (req, res) => {
    try {
        const { rid } = req.params;
        const query = await sql`SELECT DISTINCT(s.regno), t.name, (
                        SELECT ROUND(SUM(gpa * cr) / SUM(cr)::DECIMAL, 2) AS CGPA
                        FROM (
                            SELECT m.regno, m.marks, m.rid,ROUND(marks) as rmarks, r.Semester, r.Year, r.Class,r.fid, c.cid, c.code, c.title, c.theory, c.lab, g.grade, g.gpa, c.theory + c.lab as cr
                            FROM cmarks m, grade g, recap r, course c
                            WHERE 1=1 AND m.rid = r.rid AND r.cid = c.cid AND regno = s.regno AND hid = 246 AND g.gpa <> 0
                            AND ROUND(marks) BETWEEN g.start AND g.end) A
                        ) CGPA
                    FROM cmarks s, student t
                    WHERE rid = ${rid}
                    AND s.regno = t.regno`
        res.status(200).json(query);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// SELECT *,  ROUND((CAST(total AS FLOAT) * 100 / CAST(x AS FLOAT))::NUMERIC , 2) Per
/*
SELECT *,  ROUND((CAST(total AS FLOAT) * 100 / CAST(x AS FLOAT))::NUMERIC , 2) Per
FROM (
	SELECT * , (
		SELECT SUM(total)
		FROM (
			SELECT g.grade, COUNT(g.grade) total 
			FROM cmarks m, grade g
			WHERE rid = A.rid
			AND hid = 246
			AND ROUND(marks) BETWEEN g.start AND g.end
			GROUP BY g.grade
		) B
	) x
	FROM (
	SELECT rid, g.grade, COUNT(g.grade) total 
	FROM cmarks m, grade g
	WHERE m.rid = 2000
	AND hid = 246
	AND ROUND(marks) BETWEEN g.start AND g.end
	GROUP BY m.rid, g.grade
	) A
) C
*/


// router.get("/api/department/:dept_name", (req, res) => {
//     try {
//         connection.then(async (db) => {
//             const result = await db.request().input("deptName", sql.VarChar, req.params.dept_name).query(`SELECT * FROM department WHERE dept_name = @deptName;`);
//             console.log(result.rows);
//             res.status(200).json(result.rows);
//         });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// router.get("/api/courses/:id", (req, res) => {
//     try {
//         connection.then(async (db) => {
//             const result = await db
//                 .request()
//                 .input("Id", sql.VarChar, req.params.id)
//                 .query(
//                     `SELECT * FROM course WHERE course_id = @Id; 
//                     SELECT DISTINCT(dept_name) FROM department`
//                 );
//             console.log(result.rowss);
//             res.status(200).json(result.rowss);
//         });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// router.post("/api/courses/save", async (req, res) => {
//     console.log(req.body);
//     try {
//         connection.then(async (db) => {
//             const result = await db
//                 .request()
//                 .input(`course_id`, sql.VarChar, req.body.course_id)
//                 .input(`title`, sql.VarChar, req.body.title)
//                 .input(`dept_name`, sql.VarChar, req.body.dept_name)
//                 .input(`credits`, sql.Numeric, req.body.credits).query(`UPDATE course SET title = @title, dept_name = @dept_name, credits = @credits WHERE course_id = @course_id;
//                     SELECT * FROM course`);
//             console.log(result);
//             if (result.rowsAffected[0] === 1) {
//                 res.status(200).json(result.rows);
//             }
//         });

//         // const request = new sql.Request()
//         // request.query('update myAwesomeTable set awesomness = 100', (err, result) => {
//         //     console.log(result.rowsAffected)
//         // })
//     } catch (error) {
//         console.log(error.message);
//     }
// });

// router.get("/col", (req, res) => {
//     try {
//         connection.then(async (db) => {
//             const result = await db.query(`SELECT * FROM course;`);
//             console.log(result.rows.columns.course_id.type); // true
//             console.log(result.rows.columns.course_id.type === sql); // true
//             res.status(200).json(result.rows.columns);
//         });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

export default router;

// const pool = await poolPromise
// const result = await pool
//     .input('input_parameter', sql.Int, req.query.input_parameter)
//     .query('select * from mytable where id = @input_parameter')

// res.json(result.rows)
