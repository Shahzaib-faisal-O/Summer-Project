import express from "express";

const app = express();

const PORT = 2000;


import indexRouter from './routes/Routes.js'


app.use(express.json()); //json middleWare 


app.use('/api', indexRouter); // api is coming from this routes starting from /api

app.get("/", (req, res) => { //home  route
    try {
        res.status(200).json({ message: 'hello world ' })
    } catch (error) {

    }
})

app.get('/final', (req, res) => {
    try {
        res.status(200).json({ message: "hello from final " });
    } catch (error) {
        console.log(error);

    }

})
app.listen(PORT, console.log(`Server is listening on http://localhost:${PORT}`));

