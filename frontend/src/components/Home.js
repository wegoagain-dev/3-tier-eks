import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

function Home() {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/topics`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm" role="alert">
          <p className="font-bold">Connection Error</p>
          <p>Could not reach the learning database: {error}</p>
          <p className="text-sm mt-2">Ensure the backend service is operational.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
          Master <span className="text-blue-600">DevOps</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Select a domain below to test your knowledge and sharpen your skills with our interactive quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {topics.map(topic => (
          <div key={topic.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-8 flex-grow flex flex-col">
              <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                {topic.title}
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed flex-grow">
                {topic.description}
              </p>
              <Link
                to={`/quiz/${topic.id}`}
                className="block w-full text-center bg-gray-50 text-blue-600 font-semibold py-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
              >
                Start Quiz &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;