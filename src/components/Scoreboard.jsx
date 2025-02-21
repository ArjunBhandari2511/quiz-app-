import { useState, useEffect } from "react";
import { getQuizHistory } from "../db/indexedDB";

const Scoreboard = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getQuizHistory();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Quiz History</h2>
      {history.length === 0 ? (
        <p className="text-lg text-gray-500">No quiz attempts yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((attempt, index) => (
            <li key={attempt.id || index} className="p-4 border-b">
              <div className="flex justify-between">
                <span className="font-semibold">Attempt {index + 1}</span>
                <span className="text-gray-500">
                  {new Date(attempt.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-medium">Score:</span>{" "}
                {attempt.score + 1} / {attempt.total}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Scoreboard;
