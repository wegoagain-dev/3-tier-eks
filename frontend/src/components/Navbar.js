import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-white transition-colors';
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold transform group-hover:rotate-12 transition-transform">
              DL
            </div>
            <span className="text-white text-xl font-bold tracking-wide">DevOps Platform</span>
          </Link>
          <div className="space-x-8">
            <Link to="/" className={`${isActive('/')} text-sm uppercase tracking-wider`}>
              Topics
            </Link>
            <Link to="/manage-questions" className={`${isActive('/manage-questions')} text-sm uppercase tracking-wider`}>
              Manager Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;