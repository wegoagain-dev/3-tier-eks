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
      <div className="flex flex-col justify-center items-center min-h-screen bg-obsidian">
        <div className="font-mono text-cyan text-sm mb-4 animate-pulse">INITIALIZING DATA STREAMS...</div>
        <div className="w-64 h-1 bg-charcoal rounded overflow-hidden">
          <div className="h-full bg-cyan w-1/2 animate-[shimmer_2s_infinite_linear]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="bg-red-900/10 border border-red-500/50 p-8 rounded backdrop-blur-sm max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <h2 className="font-mono text-red-500 text-xl font-bold mb-2">CRITICAL ERROR</h2>
          <p className="font-mono text-red-400 text-sm mb-4">CONNECTION TERMINATED UNEXPECTEDLY</p>
          <div className="bg-black/50 p-4 rounded font-mono text-xs text-red-300">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden pt-24 pb-12">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 border border-cyan/30 rounded-full bg-cyan/5 backdrop-blur-sm">
            <span className="font-mono text-xs text-cyan tracking-widest uppercase">Select Training Module</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-white mb-6 tracking-tight">
            DEVOPS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-600 text-glow">MASTERY</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Access the mainframe. Test your knowledge. Upgrade your neural network.
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <div 
              key={topic.id} 
              className="group relative bg-charcoal/50 border border-slate hover:border-cyan/50 rounded-lg p-6 transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Index Number */}
              <div className="font-mono text-xs text-gray-600 mb-4 group-hover:text-cyan transition-colors">
                MOD_{String(index + 1).padStart(2, '0')}
              </div>

              <h2 className="font-sans text-2xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">
                {topic.title}
              </h2>
              
              <p className="text-gray-400 text-sm mb-8 leading-relaxed h-12 overflow-hidden">
                {topic.description}
              </p>

              <Link
                to={`/quiz/${topic.id}`}
                className="inline-flex items-center justify-between w-full px-4 py-3 bg-slate/50 hover:bg-cyan/10 border border-slate hover:border-cyan/30 rounded text-sm font-mono text-gray-300 hover:text-cyan transition-all duration-300"
              >
                <span>INITIATE_QUIZ</span>
                <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">-></span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
