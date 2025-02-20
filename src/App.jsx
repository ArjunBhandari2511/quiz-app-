import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Quiz from "./components/Quiz";
import Scoreboard from "./components/Scoreboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Link to="/" className="text-xl font-semibold hover:text-gray-300">
              Quiz
            </Link>
            <Link to="/scoreboard" className="text-xl font-semibold hover:text-gray-300">
              Scoreboard
            </Link>
          </div>
        </nav>
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;