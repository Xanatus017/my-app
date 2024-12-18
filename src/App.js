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

const fetchQuestions = async () => {
  const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(url);
  const data = await response.json();
  const formattedQuestions = data.results.map((q) => ({
    ...q,
    allAnswers: [...q.incorrect_answers, q.correct_answer]
  }));
  setQuestions(formattedQuestions);
};

const startQuiz = () => {
  setQuizStarted(true);
  fetchQuestions();
};

return (
  <div className="container">
    {!quizStarted && (
      <div className="start-screen">
        <h1 className="heading">Quiz App</h1>
        <div className="settings">
          <label htmlFor="num-questions">Number of Questions:</label>
          <select
            id="num-questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          >
            {[5, 10, 15, 20, 30, 40, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <label htmlFor="category">Select Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="17">Science and Nature</option>
              <option value="18">Computers</option>
              <option value="19">Mathematics</option>
              <option value="20">Mythology</option>
              <option value="21">Sports</option>
              <option value="22">Geography</option>
              <option value="23">History</option>
              <option value="24">Politics</option>
              <option value="25">Art</option>
              <option value="28">Vehicles</option>
            </select>
            <label htmlFor="difficulty">Select Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <label htmlFor="time">Select Time per Question:</label>
            <select
              id="time"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(e.target.value)}
            >
              {[10, 15, 20, 25, 30, 60].map((time) => (
                <option key={time} value={time}>
                  {time} seconds
                </option>
              ))}
            </select>
          </div>
          <button className="btn start" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
 )}
 </div>
);




export default App;
