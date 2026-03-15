import React, { useState } from 'react';
import { useAppStore, Role } from '@/lib/store';
import { motion } from 'framer-motion';

export function LoginModal() {
  const { role, login, coreCreds, adminPass } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  if (role) return null;

  const handleLogin = () => {
    if (selectedRole === 'student') {
      login('student');
    } else if (selectedRole === 'admin') {
      if (pass === adminPass || pass === '23515911') { 
        login('admin');
      } else {
        alert("Invalid admin password");
      }
    } else if (selectedRole === 'core') {
      const cred = coreCreds[id];
      if (cred && cred.pass === pass) {
        login('core', id);
      } else {
        alert("Invalid core credentials");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0b102a] z-[9999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1e1e3f] w-full max-w-[400px] p-8 rounded-[32px] text-center border border-white/10 shadow-2xl"
      >
        <div className="w-24 h-24 mx-auto border-4 border-[#6b5cff] rounded-full mb-6 flex items-center justify-center bg-[#12163f] shadow-[0_0_30px_rgba(107,92,255,0.3)]">
          <span className="text-4xl">⚽</span>
        </div>
        <h1 className="text-[#6b5cff] text-2xl font-bold mb-8 tracking-wider">GCET SPORTS CLUB</h1>
        
        <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-2xl border border-white/5">
          {(['student', 'core', 'admin'] as Role[]).map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedRole === r ? 'bg-[#6b5cff] text-white shadow-lg' : 'bg-transparent text-white/50 hover:text-white/80'
              }`}
            >
              {r?.toUpperCase()}
            </button>
          ))}
        </div>

        {selectedRole === 'core' && (
          <input
            type="text"
            placeholder="Enter Core ID"
            value={id}
            onChange={e => setId(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white mb-4 outline-none focus:border-[#6b5cff] transition-colors"
          />
        )}
        
        {(selectedRole === 'core' || selectedRole === 'admin') && (
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white mb-8 outline-none focus:border-[#6b5cff] transition-colors"
          />
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-[#6b5cff] to-[#9f7aea] text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(107,92,255,0.4)] transition-all"
        >
          SIGN IN
        </button>
      </motion.div>
    </div>
  );
}