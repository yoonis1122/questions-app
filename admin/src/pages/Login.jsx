import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        localStorage.setItem('adminToken', 'secret-demo-token');
        toast.success('Logged in successfully');
        navigate('/dashboard');
        return;
      }
      
      // Fallback local admin check
      if (email === 'admin@gmail.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'secret-demo-token');
        toast.success('Logged in successfully (Fallback)');
        navigate('/dashboard');
        return;
      }
      
      toast.error('Invalid email or password');
    } catch (err) {
      toast.error('Login failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-indigo-600 shadow-inner">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-800 tracking-tight">Admin Area</h2>
        <p className="text-slate-500 text-center mb-8">Sign in to manage quiz questions</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800"
              placeholder="admin@gmail.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Master Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800"
              placeholder="Enter password..."
              required 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:hover:translate-y-0"
          >
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
