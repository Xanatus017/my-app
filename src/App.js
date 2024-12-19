import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timerId, setTimerId] = useState(null); 

  


  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      setTimerId(timer); // Save the timer ID
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) handleTimeout();
  }, [timeLeft, quizStarted]);

  const fetchQuestions = async () => {
    const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();
    const formattedQuestions = data.results.map((q) => {
      const allAnswers = [
        ...q.incorrect_answers.map(decodeHTML),
        decodeHTML(q.correct_answer),
      ];
      return {
        ...q,
        allAnswers: shuffleArray(allAnswers), // Shuffle the answers
        question: decodeHTML(q.question),
        correct_answer: decodeHTML(q.correct_answer),
      };
    });
    setQuestions(formattedQuestions);
  };


  // Utility function to shuffle an array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const decodeHTML = (html) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  };

  const startQuiz = () => {
    setTimeLeft(timePerQuestion); // Fix: Set timeLeft to the selected timePerQuestion
    setQuizStarted(true);
    fetchQuestions();
  };

  const handleAnswerSelect = (answer) => {
    if (!showCorrectAnswer) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!showCorrectAnswer) {
      setShowCorrectAnswer(true);
      if (selectedAnswer === questions[currentQuestionIndex]?.correct_answer) {
        setScore((prev) => prev + 1);
      }
      clearInterval(timerId); // Clear the timer when answer is submitted
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(timePerQuestion); // Fix: Reset timer dynamically
      setShowCorrectAnswer(false);
    } else {
      setQuizEnded(true);
      setQuizStarted(false);
    }
  };

  const handleTimeout = () => {
    if (!showCorrectAnswer) {
      setShowCorrectAnswer(true);
      clearInterval(timerId); // Clear the timer if time runs out
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
      return "You're Perfect! Excellent!";
    } else if (percentage >= 80) {
      return "Great Job! Keep it up!";
    } else if (percentage >= 50) {
      return "Good effort! You can do better!";
    } else if (percentage > 0) {
      return "Nice try! Keep practicing!";
    } else {
      return "Don't worry! Try again and improve!";
    }
  };




  const restartQuiz = () => {
    setNumQuestions(5);
    setCategory("");
    setDifficulty("");
    setTimePerQuestion(30); // Default time setting remains the same
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(timePerQuestion); // Fix: Use dynamic timePerQuestion value
    setQuizStarted(false);
    setQuizEnded(false);
    setShowCorrectAnswer(false);
    setTimerId(null); // Reset timer ID on restart
  };

  return (
    <div className="container">
      {!quizStarted && !quizEnded && (
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
              <option value="">Any category</option>
              <option value="9">General Knowledge</option>
              <option value="10">Books</option>
              <option value="11">Films</option>
              <option value="12">Music</option>
              <option value="14">Television</option>
              <option value="15">Video Games</option>
              <option value="16">Board Games</option>
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
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
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

      {quizStarted && !quizEnded && (
        <div className="quiz">
          <div className="timer">
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${(timeLeft / timePerQuestion) * 100}%` }}
              ></div>
              <span className="progress-text">{timeLeft}s</span>
            </div>
          </div>
          <div className="question-wrapper">
            <div className="number">
              Question {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div className="question">
              {questions[currentQuestionIndex]?.question}
            </div>
          </div>
          <div className="answer-wrapper">
            {questions[currentQuestionIndex]?.allAnswers.map((answer, idx) => (
              <div
                key={idx}
                className={`answer ${showCorrectAnswer
                  ? answer === questions[currentQuestionIndex]?.correct_answer
                    ? "correct"
                    : answer === selectedAnswer
                      ? "wrong"
                      : ""
                  : selectedAnswer === answer
                    ? "selected"
                    : ""
                  }`}
                onClick={() => handleAnswerSelect(answer)}
              >
                <span className="text">{answer}</span>
              </div>
            ))}
          </div>
          {showCorrectAnswer ? (
            <button className="btn next" onClick={handleNext}>
              Next Question
            </button>
          ) : (
            <button
              className="btn submit"
              disabled={!selectedAnswer}
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      )}

      {quizEnded && (
        <div className="end-screen">
          <h1 className="heading">Quiz App</h1>
          <div className="score">
            Your score: {score}/{questions.length}
          </div>
          <div className="message">{getScoreMessage()}</div>
          <button className="btn restart" onClick={restartQuiz}>
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
