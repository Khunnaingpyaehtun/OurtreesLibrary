import React, { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { COLORS, USERS_STORAGE_KEY } from '../constants';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserType) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: UserType[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (isLogin) {
        // Login Logic
        // Special Admin Backdoor
        if (formData.username === 'admin' && formData.password === 'ourtrees123') {
           const adminUser: UserType = {
             id: 'admin',
             name: 'System Administrator',
             username: 'admin',
             password: '...',
             role: 'admin',
             joinedDate: new Date().toLocaleDateString(),
             readHistory: [],
             currentlyReading: []
           };
           onLoginSuccess(adminUser);
           return;
        }

        const user = users.find(u => u.username === formData.username && u.password === formData.password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Invalid username or password');
          setIsLoading(false);
        }
      } else {
        // Registration Logic
        if (users.some(u => u.username === formData.username)) {
          setError('Username already taken');
          setIsLoading(false);
          return;
        }

        const newUser: UserType = {
          id: Date.now().toString(),
          name: formData.name,
          username: formData.username,
          password: formData.password,
          role: 'user',
          joinedDate: new Date().toLocaleDateString(),
          readHistory: [],
          currentlyReading: []
        };

        users.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        onLoginSuccess(newUser);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-gradient-to-br from-[#DB8C29] to-[#b36d16] p-10 text-center text-white relative overflow-hidden">
          {/* CSS-only pattern for offline reliability */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-10 rotate-12 bg-white" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
              <User size={40} />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter">Our Trees</h2>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Digital Library System</p>
          </div>
        </div>

        <div className="p-10">
          <div className="flex gap-4 mb-8 bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isLogin ? 'bg-white text-slate-800 shadow-md' : 'text-slate-400'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${!isLogin ? 'bg-white text-slate-800 shadow-md' : 'text-slate-400'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                <input 
                  type="text"
                  required 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none focus:ring-2 focus:ring-[#DB8C29]/50 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Username</label>
              <input 
                type="text"
                required 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none focus:ring-2 focus:ring-[#DB8C29]/50 transition-all"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Password</label>
              <input 
                type="password"
                required 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none focus:ring-2 focus:ring-[#DB8C29]/50 transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-xs font-bold text-red-500 text-center bg-red-50 p-3 rounded-xl">{error}</p>}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Access Library" : "Create Account")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;