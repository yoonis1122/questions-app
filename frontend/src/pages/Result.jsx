import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const hasSaved = useRef(false);

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">No results found</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 rounded-lg">Go Home</button>
      </div>
    );
  }

  const { score, total, section } = state;
  const percentage = Math.round((score.correct / total) * 100) || 0;

  useEffect(() => {
    if (state && user && !hasSaved.current) {
      hasSaved.current = true;
      const saveResult = async () => {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/results`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              playerName: user.fullName || user.firstName || 'Anonymous',
              playerImage: user.imageUrl || '',
              section,
              score: score.correct,
              total
            })
          });
        } catch (error) {
          console.error('Failed to save result:', error);
        }
      };
      saveResult();
    }
  }, [state, user, section, score, total]);

  return (
    <div className="flex items-center justify-center min-h-[85vh] py-10 px-4">
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur border border-slate-800 p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 fade-in duration-500">
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
          <Target className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Quiz Completed!</h2>
        <p className="text-slate-400 mb-8 text-center text-lg">You finished the <span className="capitalize text-indigo-400 font-semibold">{section}</span> section.</p>

        <div className="w-full bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-medium">Final Score</span>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {percentage}%
            </span>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-300">Correct Answers</span>
              </div>
              <span className="text-emerald-400 font-bold text-xl">{score.correct}</span>
            </div>
            
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span className="text-slate-300">Wrong Answers</span>
              </div>
              <span className="text-rose-400 font-bold text-xl">{score.wrong}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => navigate(`/quiz/${section}`)}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Quiz
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
