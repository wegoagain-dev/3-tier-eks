import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quiz from './components/Quiz';
import QuestionManager from './components/QuestionManager';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-obsidian text-gray-300 font-sans selection:bg-cyan selection:text-black">
        <Navbar />
        <main className="relative z-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:topic" element={<Quiz />} />
            <Route path="/manage-questions" element={<QuestionManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
