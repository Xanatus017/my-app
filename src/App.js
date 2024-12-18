import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
}

useEffect(() => {
  if (quizStarted && timeLeft > 0) {
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }
  if (timeLeft === 0) handleNext();
}, [timeLeft, quizStarted]);


const startQuiz = () => {
  setQuizStarted(true);
  fetchQuestions();
};


export default App;
