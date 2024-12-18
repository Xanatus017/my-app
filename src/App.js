import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [questions, setQuestions] = useState([]);
}

export default App;
