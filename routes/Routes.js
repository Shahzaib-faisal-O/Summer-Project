import express, { query } from "express";

const router = express.Router();

import { sql } from "../utils/db.js"; //importing neon sever less driver from neon


//!main query
router.route('/final').get(async (req, res) => {
    try {
        const finalQuery = await sql``; //*query
        res.status(200).json(finalQuery);
    } catch (error) {
        res.status(400).json({ message: "Final Query not Working " });
    }
})






router.get("/", function (req, res) { //home function
    try {
        res.status(201).send('Hello from the Api calling')
    } catch (error) {

    }
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
        let batches = await sql`SELECT DISTINCT(Class) FROM recap WHERE Year = ${year} AND Semester = ${semester} ORDER BY Class;`;
        batches = batches.sort((a, b) => a.class.length - b.class.length)
        console.log(batches)
        res.status(200).json(batches);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get(`/batch/:year/:semester/:batch`, async (req, res) => {
    try {
        const { year, semester, batch } = req.params;
        const recaps = await sql`SELECT r.*, c.title FROM recap r, course c WHERE r.cid = c.cid AND Year = ${year} AND Semester = ${semester} AND Class = ${batch};`;
        console.log(recaps)
        res.status(200).json(recaps);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get(`/recap/:rid`, async (req, res) => {
    try {
        const { rid } = req.params;
        const query = await sql`SELECT *,  CAST(total AS FLOAT) * 100 / CAST(SUM AS FLOAT) Per
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
                                    ) SUM
                                    FROM (
                                    SELECT rid, g.grade, COUNT(g.grade) total 
                                    FROM cmarks m, grade g
                                    WHERE m.rid = ${rid}
                                    AND hid = 246
                                    AND ROUND(marks) BETWEEN g.start AND g.end
                                    GROUP BY m.rid, g.grade
                                    ) A
                                ) C`;
        console.log(query)
        res.status(200).json(query);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


export default router;

