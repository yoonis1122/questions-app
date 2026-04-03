import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
          <Navbar />
          <Toaster position="top-center" toastOptions={{
            style: {
              background: 'var(--toast-bg, #1e293b)',
              color: 'var(--toast-color, #fff)',
              border: '1px solid var(--toast-border, #334155)'
            }
          }} />
          <main className="flex-1 container mx-auto px-4 py-8 relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/quiz/:section" element={
                <>
                  <SignedIn><Quiz /></SignedIn>
                  <SignedOut>
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in-95 duration-500">
                      <div className="w-24 h-24 mb-6 text-slate-300 dark:text-slate-700">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      </div>
                      <h2 className="text-3xl font-extrabold mb-4 text-slate-800 dark:text-white">Sign in required</h2>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">You need an account to take the quiz. Please sign in or sign up above to continue your challenge.</p>
                    </div>
                  </SignedOut>
                </>
              } />
              <Route path="/result" element={<Result />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
