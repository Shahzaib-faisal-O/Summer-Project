import express  from "express";
const app = express();
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js'
import { neon } from "@neondatabase/serverless";
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const sql = neon(`postgresql://asimdb_owner:zOwegpGBFZ20@ep-icy-frost-a553kwhr-pooler.us-east-2.aws.neon.tech/asimdb?sslmode=require`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api', indexRouter);

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

// // Get all faculty
// app.get("/api/faculty", async (req, res, next) => {
//     try {
//         const faculty = await sql`SELECT * FROM faculty`;
//         res.status(200).json(faculty);
//     } catch (err) {
//         next(err);
//     }
// });

app.listen(4500, console.log(`Server is listening on http://localhost:4500`));

/*
import express  from "express";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js'
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 4500

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .get("/", (req, res)=> res.sendFile(path.join(__dirname, 'index.html')))
    .use('/api', indexRouter)
    .listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));







*/