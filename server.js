const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const quizRoute = require("./routes/quiz");
const port = process.env.PORT; 

app.use(cors);
app.use(express.json());

app.use("/quiz", quizRoute);

app.listen(port, () => {
    console.log("We are firing on all cyclinders!!! 🚀");
})