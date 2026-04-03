import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function Quiz() {
  const { section } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions?section=${section}`)
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setQuestions(shuffled);
        setLoading(false);
      })
      .catch(err => {
        toast.error('Failed to load questions');
        setLoading(false);
      });
  }, [section]);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);

    const question = questions[currentIndex];
    const isCorrect = option === question.correctAnswer;

    if (isCorrect) {
      toast.success('Correct!');
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      toast.error('Wrong answer');
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    setTimeout(() => {
      const newWrongScore = isCorrect ? score.wrong : score.wrong + 1;
      const finalScore = isCorrect 
        ? { correct: score.correct + 1, wrong: score.wrong }
        : { correct: score.correct, wrong: score.wrong + 1 };

      if (newWrongScore >= 5) {
        toast.error('Try another time best sorry! ...', { duration: 3000, style: { background: '#fff1f2', color: '#be123c', border: '1px solid #fda4af' } });
        navigate('/');
        return;
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        navigate('/result', { state: { score: finalScore, total: questions.length, section } });
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-300">No questions found for {section}</h2>
        <p className="text-slate-500 mb-8 max-w-md">Admin needs to add some questions to this category before you can start playing.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all font-medium">
          Return Home
        </button>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-[80vh] py-8">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 capitalize flex items-center gap-2">
          🧩 {section} Quiz
        </h2>
        <span className="px-4 py-1.5 bg-indigo-50 dark:bg-slate-800 rounded-full text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500" key={currentIndex}>
        {question.image && (
          <div className="w-full  mb-8 flex items-center justify-center">
            <img src={question.image} alt="Question" className="w-120 h-95 drop-shadow-lg rounded-xl " />
          </div>
        )}
        
        <h3 className="text-2xl md:text-3xl font-semibold mb-10 leading-relaxed text-slate-800 dark:text-slate-100 px-4 text-center">
          {question.text || "What is shown in this image?"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
          {question.options.map((option, index) => {
            let buttonClass = "p-5 rounded-2xl border transition-all duration-300 text-left text-lg font-medium outline-none flex items-center justify-between group ";
            let icon = null;
            
            if (!isAnswered) {
              buttonClass += "bg-slate-800/60 border-slate-700/50 hover:border-indigo-500 hover:bg-slate-800/90 text-slate-300 hover:text-white hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]";
            } else {
              buttonClass += "cursor-default ";
              if (option === question.correctAnswer) {
                buttonClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.15)]";
                icon = <span className="text-emerald-400 text-xl animate-in zoom-in">✓</span>;
              } else if (option === selectedAnswer) {
                buttonClass += "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.15)] animate-shake";
                icon = <span className="text-rose-400 text-xl animate-in zoom-in">✕</span>;
              } else {
                buttonClass += "bg-slate-900/50 border-slate-800/50 text-slate-500 opacity-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
