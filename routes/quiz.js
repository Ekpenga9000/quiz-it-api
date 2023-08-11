const express = require('express');
const router = express.Router(); 
const fs = require('fs');
const { v4: uuid } = require('uuid');

const questionFilePath = "./data/questions.json";

const getQuestions = () => {
    return JSON.parse(fs.readFileSync(questionFilePath));
}

const saveQuestion = (questionsList) => {
    return fs.writeFileSync(questionFilePath, JSON.stringify(questionsList));
}

// Develop an algorithm that'll take length of the array

const generateRandomIndex = (num) => {
    return Math.floor(Math.random() * num);
}

const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--){
        const rand = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }

    return arr;
}


router
    .route("/")
    .get((req, res) => {
        const questionList = getQuestions();
        const question = questionList[generateRandomIndex(questionList.length)];
        question.options = shuffleArray(question.options);

        console.log(questionList.length);
        res.status(200).json(question);
    })
    .post((req, res) => {
        const { id, option } = req.body
        
        if (!option || !id) {
           return res.status(400).json({error:"Please provide an anwser."})
        }

        const questionList = getQuestions();
        const question = questionList.find(question => question.id === id);

        if (!question) {
            return res.status(404).json({ error: "No question with id found" });
        } 
        
        if (option !== question.correct_answer) {
          return res.status(200).json({message:"Wrong Answer"})
        }
        
        return res.status(200).json({ message: "Correct! Answer" }); 
    
    })

//posting a new question.
router
    .route("/question")
    .post((req, res) => {
        const { question, answerFalse1, answerFalse2, answerFalse3, answerTrue } = req.body;
        //check that all the data is not empty
        if (!question || !answerFalse1 || !answerFalse2 || !answerFalse3 || !answerTrue) {
            return res.status(400).json({ error: "All fields must be completed" });
        }
        //create a new question object and assign it an id
        const questionList = getQuestions();
        const newQuestion = {
            id: uuid(),
            options: [answerFalse1, answerFalse2, answerFalse3, answerTrue], 
            correct_answer:answerTrue
        }

        questionList.push(newQuestion);
        saveQuestion(questionList);
        res.status(201).json(newQuestion);
    })


module.exports = router;