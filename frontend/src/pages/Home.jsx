import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Utensils, Star, Activity, Compass, Lightbulb, Zap, Rocket } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sections`)
      .then(res => res.json())
      .then(data => {
        setSections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load sections', err);
        setLoading(false);
      });
  }, []);

  // Predefined gradients for dynamic themes
  const colorThemes = [
    { from: 'from-indigo-500', to: 'to-purple-500', rings: 'focus:ring-indigo-500', text: 'text-indigo-500', darkText: 'dark:text-indigo-400', groupHover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-300' },
    { from: 'from-pink-500', to: 'to-rose-500', rings: 'focus:ring-pink-500', text: 'text-pink-500', darkText: 'dark:text-pink-400', groupHover: 'group-hover:text-pink-600 dark:group-hover:text-pink-300' },
    { from: 'from-emerald-500', to: 'to-teal-500', rings: 'focus:ring-emerald-500', text: 'text-emerald-500', darkText: 'dark:text-emerald-400', groupHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-300' },
    { from: 'from-amber-500', to: 'to-orange-500', rings: 'focus:ring-amber-500', text: 'text-amber-500', darkText: 'dark:text-amber-400', groupHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-300' },
    { from: 'from-blue-500', to: 'to-cyan-500', rings: 'focus:ring-blue-500', text: 'text-blue-500', darkText: 'dark:text-blue-400', groupHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-300' },
    { from: 'from-fuchsia-500', to: 'to-violet-500', rings: 'focus:ring-fuchsia-500', text: 'text-fuchsia-500', darkText: 'dark:text-fuchsia-400', groupHover: 'group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-300' },
  ];

  // Specific generic icons list to rotate through
  const icons = [BookOpen, Trophy, Utensils, Star, Activity, Compass, Lightbulb, Zap, Rocket];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] animate-in fade-in zoom-in duration-700 relative">
      <div 
        className="absolute inset-[-4rem] -z-20 opacity-40 dark:opacity-10 bg-cover bg-center pointer-events-none transition-opacity duration-500"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-[-4rem] -z-10 bg-white/40 dark:bg-slate-950/80 backdrop-blur-[4px] pointer-events-none transition-colors duration-500"></div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6 text-center tracking-tight drop-shadow-sm">
        MasterMind
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-16 text-center max-w-2xl font-medium transition-colors">
        Test your knowledge across different domains. Choose a category below to begin your challenge.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl z-10 px-4">
          {sections.map((section, index) => {
            const theme = colorThemes[index % colorThemes.length];
            
            const getSectionImage = (name, i) => {
              const images = {
                history: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000&auto=format&fit=crop',
                sports: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop',
                foods: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
                science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop',
                geography: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop',
                art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000&auto=format&fit=crop',
              };
              const fallbacks = [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1000&auto=format&fit=crop'
              ];
              return images[name] || fallbacks[i % fallbacks.length];
            };

            return (
              <button
                key={section._id}
                onClick={() => navigate(`/quiz/${section.name}`)}
                className={`group relative flex flex-col outline-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-${theme.from.split('-')[1]}-500/50 rounded-3xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 focus:ring-2 ${theme.rings} focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 overflow-hidden text-left`}
              >
                <div className="w-full h-48 sm:h-56 overflow-hidden relative border-b border-slate-100 dark:border-slate-800">
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme.from}/20 to-black/20 z-10 pointer-events-none group-hover:opacity-75 transition-opacity duration-500`}></div>
                  <img 
                    src={getSectionImage(section.name, index)} 
                    alt={section.label} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-xs font-bold px-4 py-2 rounded-full text-slate-800 dark:text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.15)] group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:scale-105 border border-white/20 dark:border-slate-700/50">
                      Click the Quiz
                    </span>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8 w-full flex-1 flex flex-col">
                  <h2 className={`text-2xl lg:text-3xl font-bold mb-3 text-slate-800 dark:text-slate-100 ${theme.groupHover} transition-colors capitalize`}>
                    {section.label}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base leading-relaxed line-clamp-3">
                    {section.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
