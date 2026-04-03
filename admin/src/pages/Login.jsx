import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'secret-demo-token');
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password (use admin@gmail.com / admin123)');
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
