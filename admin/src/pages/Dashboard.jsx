import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, LayoutDashboard, BookOpen, Sun, Moon, Trash2, FolderPlus, Settings, Edit, Users, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  
  const [activeTab, setActiveTab] = useState('');
  const [sectionMode, setSectionMode] = useState('list'); // 'list', 'create', 'edit'
  const [editingId, setEditingId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    text: '',
    image: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const [newSectionData, setNewSectionData] = useState({
    label: '',
    description: ''
  });

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (activeTab && activeTab !== 'manage-sections' && activeTab !== 'results') {
      fetchQuestions(activeTab);
      setSectionMode('list');
    } else if (activeTab === 'results') {
      fetchResults();
    }
  }, [activeTab]);

  const fetchSections = async () => {
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sections`);
      const data = await res.json();
      setSections(data);
      if (data.length > 0 && !activeTab) {
        setActiveTab(data[0].name);
      }
    } catch (err) {
      toast.error('Failed to load sections');
    }
  };

  const fetchQuestions = async (sectionName) => {
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions?section=${sectionName}`);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      toast.error('Failed to load questions');
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/results`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      toast.error('Failed to load results');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!formData.text && !formData.image) {
      return toast.error('A question requires text or an image URL');
    }
    if (formData.options.some(opt => !opt.trim())) {
      return toast.error('All 4 options must be filled');
    }
    if (!formData.correctAnswer.trim()) {
      return toast.error('Please specify the correct answer');
    }
    if (!formData.options.includes(formData.correctAnswer.trim())) {
      return toast.error('Correct answer must exactly match one of the options');
    }

    setLoading(true);
    try {
      const payload = {
        section: activeTab,
        ...formData,
        options: formData.options.map(opt => opt.trim()),
        correctAnswer: formData.correctAnswer.trim()
      };

      if (!payload.image) payload.image = undefined;
      if (!payload.text) payload.text = undefined;

      if (sectionMode === 'edit' && editingId) {
        const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update question');
        toast.success('Question updated successfully!');
      } else {
        const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create question');
        toast.success('Question added successfully!');
      }
      
      setFormData({
        text: '',
        image: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
      setSectionMode('list');
      setEditingId(null);
      fetchQuestions(activeTab);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (q) => {
    setFormData({
      text: q.text || '',
      image: q.image || '',
      options: q.options || ['', '', '', ''],
      correctAnswer: q.correctAnswer || ''
    });
    setEditingId(q._id);
    setSectionMode('edit');
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete question');
      toast.success('Question deleted successfully!');
      fetchQuestions(activeTab);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSectionData.label.trim() || !newSectionData.description.trim()) {
      return toast.error('Please fill all section fields');
    }
    setLoading(true);
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSectionData)
      });
      if (!res.ok) throw new Error('Failed to create section');
      toast.success('Section created successfully!');
      setNewSectionData({ label: '', description: '' });
      fetchSections();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id, name, event) => {
    event.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete the "${name}" section and ALL its questions?`)) return;
    
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete section');
      toast.success('Section deleted successfully!');
      
      if (activeTab === name) {
        setActiveTab('manage-sections');
      }
      fetchSections();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/results/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete result');
      toast.success('Result deleted successfully!');
      fetchResults();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300 w-full relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-2xl z-20 shrink-0">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Area</h1>
        </div>
        
        <div className="px-4 py-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Categories
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {sections.map(section => {
            const isActive = activeTab === section.name;
            return (
              <button
                key={section._id}
                onClick={() => {
                  setActiveTab(section.name);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 outline-none ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className={`w-5 h-5 ${isActive ? 'text-indigo-200' : ''}`} />
                <span className="font-medium text-left truncate">{section.label}</span>
              </button>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setActiveTab('results')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 outline-none ${
                activeTab === 'results'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-amber-400'
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'results' ? 'text-amber-200' : ''}`} />
              <span className="font-medium text-left truncate">Player Results</span>
            </button>

            <button
              onClick={() => setActiveTab('manage-sections')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 outline-none ${
                activeTab === 'manage-sections'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-emerald-400'
              }`}
            >
              <Settings className={`w-5 h-5 ${activeTab === 'manage-sections' ? 'text-emerald-200' : ''}`} />
              <span className="font-medium text-left truncate">Manage Sections</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
          <h2 className="text-xl font-bold tracking-tight">
            {activeTab === 'manage-sections' ? 'Manage Section Categories' : 
             activeTab === 'results' ? 'Player Results & Leaderboard' : (
              <span className="capitalize">{activeTab} Section</span>
            )}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors outline-none"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm outline-none"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === 'manage-sections' ? (
            <div className="max-w-4xl mx-auto space-y-8 fade-in zoom-in-95 duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Create New Section</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add a new category for your quizzes</p>
                  </div>
                  <FolderPlus className="w-8 h-8 text-emerald-500 dark:text-emerald-400 opacity-80" />
                </div>
                <form onSubmit={handleCreateSection} className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Section Label (e.g., 'Science') <span className="text-rose-500">*</span></label>
                    <input 
                      type="text"
                      value={newSectionData.label}
                      onChange={(e) => setNewSectionData({...newSectionData, label: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      placeholder="Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description <span className="text-rose-500">*</span></label>
                    <textarea 
                      value={newSectionData.description}
                      onChange={(e) => setNewSectionData({...newSectionData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      placeholder="Questions regarding natural sciences..."
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20 outline-none"
                    >
                      {loading ? 'Creating...' : 'Create Section'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold">Existing Sections</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sections.map(sec => (
                      <div key={sec._id} className="relative group bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl flex justify-between items-center transition-all hover:border-slate-300 dark:hover:border-slate-600">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{sec.label}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{sec.description}</p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSection(sec._id, sec.name, e)}
                          className="p-3 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors shadow-sm ml-4 shrink-0"
                          title="Delete Section"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {sections.length === 0 && (
                      <p className="text-slate-500 col-span-2 text-center py-4">No sections available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'results' ? (
            <div className="max-w-5xl mx-auto space-y-6 fade-in zoom-in-95 duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Leaderboard & Results</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View scores of players who completed quizzes</p>
                  </div>
                  <Users className="w-8 h-8 text-amber-500 dark:text-amber-400 opacity-80" />
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-sm uppercase text-slate-500 dark:text-slate-400">
                        <th className="p-4 font-semibold">Player Name</th>
                        <th className="p-4 font-semibold">Section</th>
                        <th className="p-4 font-semibold">Score</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {results.length > 0 ? results.map((result) => (
                        <tr key={result._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {result.playerImage ? (
                                <img src={result.playerImage} alt={result.playerName} className="w-8 h-8 rounded-full object-cover object-top shrink-0 box-content border-2 border-slate-200 dark:border-slate-700" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold uppercase shrink-0 border-2 border-indigo-200 dark:border-indigo-800">
                                  {result.playerName.charAt(0)}
                                </div>
                              )}
                              <span className="font-medium whitespace-nowrap">{result.playerName}</span>
                            </div>
                          </td>
                          <td className="p-4 capitalize">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
                              {result.section}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.score}</span> / {result.total}
                            <span className="ml-2 text-xs text-slate-500">
                              ({Math.round((result.score / result.total) * 100) || 0}%)
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 whitespace-nowrap">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteResult(result._id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors inline-block"
                              title="Delete Result"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No player results found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto flex flex-col gap-6 fade-in zoom-in-95 duration-500" key={activeTab}>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="capitalize">{activeTab}</span> Questions
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {sections.find(t => t.name === activeTab)?.description || 'Manage questions for this section.'}
                  </p>
                </div>
                {sectionMode === 'list' && (
                  <button 
                    onClick={() => {
                      setFormData({ text: '', image: '', options: ['', '', '', ''], correctAnswer: '' });
                      setEditingId(null);
                      setSectionMode('create');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 outline-none whitespace-nowrap"
                  >
                    <PlusCircle className="w-5 h-5" />
                    New Question
                  </button>
                )}
              </div>

              {sectionMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {questions.length > 0 ? questions.map((q, idx) => (
                    <div key={q._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-shadow flex flex-col group relative overflow-hidden">
                      {/* Top Action Bar hidden until hover */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-1 rounded-xl shadow-sm">
                        <button onClick={() => handleEditQuestion(q)} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteQuestion(q._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>

                      <div className="mb-4">
                        <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">Q{idx + 1}</span>
                      </div>

                      {q.image && (
                        <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {q.image.startsWith('http') ? (
                            <img src={q.image} alt="Question" className="w-full h-full object-contain p-2" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                      )}
                      
                      {q.text && (
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-4 line-clamp-3 leading-relaxed flex-1">
                          {q.text}
                        </p>
                      )}

                      <div className="mt-auto space-y-2">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`px-3 py-2 rounded-lg text-xs border ${opt === q.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 font-semibold' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400'} truncate`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                      <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-lg">No questions found in this section.</p>
                      <button 
                        onClick={() => setSectionMode('create')}
                        className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" /> Create your first question
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-right-8 duration-300">
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSectionMode('list')} className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h3 className="text-lg font-bold">
                        {sectionMode === 'edit' ? 'Edit Question' : 'Create New Question'}
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitQuestion} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column: Text / Image */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Question Text</label>
                          <textarea 
                            value={formData.text}
                            onChange={(e) => setFormData({...formData, text: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[120px] resize-y"
                            placeholder="Enter the question..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Image URL (Optional)</label>
                          <input 
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        {formData.image && (
                          <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100 dark:bg-slate-800/50">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-contain object-top" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>

                      {/* Right Column: Options / Answer */}
                      <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner h-fit">
                        <h4 className="font-semibold text-lg border-b border-slate-200 dark:border-slate-700 pb-2">Options & Answer</h4>
                        
                        <div className="space-y-4">
                          {formData.options.map((opt, i) => (
                            <div key={i}>
                              <input 
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm shadow-sm"
                                placeholder={`Option ${i + 1}`}
                                required
                              />
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-700">
                          <label className="block text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">Correct Answer <span className="text-rose-500">*</span></label>
                          <input 
                            type="text"
                            value={formData.correctAnswer}
                            onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-emerald-900 dark:text-emerald-100 font-bold placeholder-emerald-300 dark:placeholder-emerald-700 shadow-sm"
                            placeholder="Must exactly match one option above"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                      <button 
                        type="button"
                        onClick={() => setSectionMode('list')}
                        className="py-3 px-6 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center outline-none"
                      >
                        {loading ? 'Saving...' : (sectionMode === 'edit' ? 'Update Question' : 'Save Question')}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
