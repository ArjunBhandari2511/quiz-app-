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
  const [timer, setTimer] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [bonusMode, setBonusMode] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const regularQuestions = quizData.filter(q => !q.bonus);
  const bonusQuestions = quizData.filter(q => q.bonus);
  const totalQuestions = bonusMode ? quizData.length : regularQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setInputAnswer("");
    setScore(0);
    setShowScore(false);
    setAnswerStatus(null);
    setTimer(30);
    setBonusMode(false);
    setQuizCompleted(false);
  }, [quizCompleted]);

  useEffect(() => {
    if (showScore || isAnswered) return;
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      nextQuestion();
    }
  }, [timer, isAnswered, showScore]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = (bonusMode ? quizData : regularQuestions)[currentQuestion].answer === answer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore(score + 1);
    setIsAnswered(true);
    setTimeout(() => nextQuestion(), 100);
  };

  const handleIntegerSubmit = () => {
    const isCorrect = parseInt(inputAnswer) === (bonusMode ? quizData : regularQuestions)[currentQuestion].answer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore(score + 1);
    setIsAnswered(true);
    setInputAnswer(""); // Clear input immediately
    setTimeout(() => nextQuestion(), 100);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setTimer(30);
      setIsAnswered(false);
    } else if (!bonusMode && bonusQuestions.length > 0) {
      setShowScore(false);
    } else {
      setShowScore(true);
      saveQuizAttempt(score, bonusMode ? 20 : 10);
    }
  };

  const handleBonusMode = () => {
    setBonusMode(true);
    setCurrentQuestion(bonusQuestions.length);
    setShowScore(false);
  };

  const restartQuiz = () => {
    setQuizCompleted(true);
  };

  if (showScore) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed</h2>
        <p className="text-xl">Your Score: {score}/{bonusMode ? 20 : 10}</p>
        <button onClick={restartQuiz} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Reattempt Quiz
        </button>
      </div>
    );
  }

  const question = (bonusMode ? quizData : regularQuestions)[currentQuestion];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: "width 0.5s ease-in-out" }}></div>
        </div>
        <div className="text-sm text-gray-500 text-right">{Math.round(progress)}%</div>
      </div>
      <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
      <div className="mb-4 text-xl font-semibold text-red-600">Time Left: {timer}s</div>

      {question.options && (
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button key={index} className={`w-full p-3 text-left rounded-lg border-2 ${selectedAnswer === option ? (answerStatus === "correct" ? "bg-green-500 text-white" : "bg-red-500 text-white") : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => handleAnswerClick(option)} disabled={selectedAnswer !== null}>
              {option}
            </button>
          ))}
        </div>
      )}

      {!question.options && (
        <div className="mt-4">
          <input type="number" value={inputAnswer} onChange={(e) => setInputAnswer(e.target.value)} className="w-full p-3 border-2 rounded-lg mb-4" disabled={answerStatus !== null} />
          <button onClick={handleIntegerSubmit} disabled={inputAnswer === "" || answerStatus !== null} className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            Submit
          </button>
          {answerStatus === "correct" && <p className="text-green-500 mt-2">✔ Correct</p>}
          {answerStatus === "incorrect" && <p className="text-red-500 mt-2">✖ Incorrect</p>}
        </div>
      )}

      {!bonusMode && currentQuestion + 1 === regularQuestions.length && bonusQuestions.length > 0 && (
        <div className="mt-4">
          <button onClick={() => setShowScore(true)} className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Submit Quiz
          </button>
          <button onClick={handleBonusMode} className="w-full mt-2 p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            Enter Bonus Mode
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
