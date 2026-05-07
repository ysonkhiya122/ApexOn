import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import './error.scss';

export const NotFound: React.FC = () => {
  return (
    <div className="f1-error-view flex flex-col items-center justify-center min-h-[70vh] px-4 text-center text-slate-100">
      <div className="error-icon-wrapper p-4 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
        <ShieldAlert className="text-red-500 animate-bounce" size={48} />
      </div>
      <h2 className="text-4xl font-extrabold text-red-500 uppercase tracking-tight">BOX, BOX! 404</h2>
      <p className="mt-2 text-slate-400 max-w-sm">You've taken a wrong turn into the Pit lane. This route does not exist.</p>
      
      <Link to="/" className="mt-8">
        <button className="error-button h-10 px-5 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer">
          Back to Track
        </button>
      </Link>
    </div>
  );
};
