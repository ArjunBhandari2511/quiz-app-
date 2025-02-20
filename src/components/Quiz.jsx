import { useState, useEffect } from "react";
import quizData from "../assets/quiz.json";
import { saveQuizAttempt } from "../db/indexedDB";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [timer, setTimer] = useState(30); // Set initial timer to 30 seconds
  const [isAnswered, setIsAnswered] = useState(false); // Track if the user answered

  // Calculate progress percentage based on currentQuestion
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  // Reset all state when the component mounts (reloads or quiz starts fresh)
  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setInputAnswer("");
    setScore(0);
    setShowScore(false);
    setAnswerStatus(null);
    setTimer(30); // Reset timer to 30 seconds
  }, []); // This ensures it runs only once when the component loads or the quiz restarts

  useEffect(() => {
    // If quiz is completed or answered, stop the timer
    if (showScore || isAnswered) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval); // Clean up the interval when the component is unmounted or timer state changes
    } else {
      // If time runs out, automatically move to the next question
      nextQuestion();
    }
  }, [timer, isAnswered, showScore]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = quizData[currentQuestion].answer === answer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore(score + 1);
    setIsAnswered(true); // Mark the question as answered
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const handleIntegerSubmit = () => {
    const isCorrect = parseInt(inputAnswer) === quizData[currentQuestion].answer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore(score + 1);
    setIsAnswered(true); // Mark the question as answered

    setTimeout(() => {
      setInputAnswer(""); // Clears Input
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setTimer(30); // Reset timer for the next question
      setIsAnswered(false); // Reset answer status
    } else {
      setShowScore(true);
      saveQuizAttempt(score, quizData.length);
    }
  };

  if (showScore) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed</h2>
        <p className="text-xl">
          Your Score: {score}/{quizData.length}
        </p>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          {/* Progress bar with smooth sliding animation */}
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: `${progress}%`,
              transition: "width 0.5s ease-in-out", // Smooth transition
            }}
          ></div>
        </div>
        <div className="text-sm text-gray-500 text-right">{Math.round(progress)}%</div>
      </div>

      <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

      {/* Timer */}
      <div className="mb-4 text-xl font-semibold text-red-600">
        Time Left: {timer}s
      </div>

      {/* Multiple Choice Questions */}
      {question.options && (
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-3 text-left rounded-lg border-2 ${
                selectedAnswer === option
                  ? answerStatus === "correct"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleAnswerClick(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Integer-Based Questions */}
      {!question.options && (
        <div className="mt-4">
          <input
            type="number"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            className="w-full p-3 border-2 rounded-lg mb-4"
            disabled={answerStatus !== null}
          />
          <button
            onClick={handleIntegerSubmit}
            disabled={inputAnswer === "" || answerStatus !== null}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Submit
          </button>
          {answerStatus === "correct" && <p className="text-green-500 mt-2">✔ Correct</p>}
          {answerStatus === "incorrect" && <p className="text-red-500 mt-2">✖ Incorrect</p>}
        </div>
      )}
    </div>
  );
};

export default Quiz;
