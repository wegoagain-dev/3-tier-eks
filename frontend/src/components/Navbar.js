import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-cyan border-b-2 border-cyan' 
      : 'text-gray-400 hover:text-cyan hover:border-b-2 hover:border-cyan/50 transition-all duration-300';
  };

  return (
    <nav className="fixed w-full top-0 z-50 glass-panel border-b border-slate/50">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo Area */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-cyan/10 border border-cyan rounded transform group-hover:scale-110 transition-transform duration-300">
            <span className="font-mono font-bold text-cyan text-xs">DL</span>
            <div className="absolute inset-0 bg-cyan blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-white text-lg tracking-widest uppercase">
              DevOps<span className="text-cyan">.SYS</span>
            </span>
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
              v1.0.4 // STABLE
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-8 font-mono text-xs tracking-widest uppercase">
            <Link to="/" className={`py-1 ${isActive('/')}`}>
              [01] Modules
            </Link>
            <Link to="/manage-questions" className={`py-1 ${isActive('/manage-questions')}`}>
              [02] Sys_Admin
            </Link>
          </div>
          
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 border-l border-slate pl-6">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-mono text-[10px] text-green-500 uppercase">System Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
