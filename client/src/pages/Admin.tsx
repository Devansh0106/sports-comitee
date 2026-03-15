import React, { useRef, useState } from 'react';
import { useAppStore, getFaceEmoji } from '@/lib/store';
import { Shield, KeyRound, Trash2, Plus, Palette, Upload, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function Admin() {
  const { role, coreId, coreCreds, updateCoreCred, addCoreCred, deleteCoreCred, setIslandMessage, bgUrl, setBgUrl, bannerMsg, setBanner, setAdminPass } = useAppStore();
  const [, setLoc] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState('');

  if (role !== 'admin' && role !== 'core') {
    setLoc('/');
    return null;
  }

  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  
  const canEditBanner = isMaster || power === 'classic';
  const canManageIDs = role === 'admin';

  const visibleCreds = isMaster ? Object.values(coreCreds) : Object.values(coreCreds).filter(c => c.id === coreId);

  const posts = [
    "President", "Vice President", "Secretary", "Coordinator", "Sports Lead", 
    "Core Head", "Equipment Head", "Graphic Head", "Reels & VFX Head", 
    "Treasurer Head", "Volunteer Head", "Documentation Head", "Logistics Head", "Member"
  ];
  const levels = ["Master Core", "Classic Core", "Basic Core"];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setBgUrl(result);
        setIslandMessage('Background updated from gallery');
      };
      reader.readAsDataURL(file);
    }
  };

  const mapPowerToLevel = (power: string) => {
    if (power === 'master') return 'Master Core';
    if (power === 'classic') return 'Classic Core';
    return 'Basic Core';
  };

  const mapLevelToPower = (level: string) => {
    if (level === 'Master Core') return 'master';
    if (level === 'Classic Core') return 'classic';
    return 'basic';
  };

  const handleGenerateID = () => {
    if(!newName.trim()) return;
    // format as name.surname matching image "rishi.bhut" if there are spaces
    const parts = newName.trim().split(' ');
    let id = parts[0].toLowerCase();
    if(parts.length > 1) {
      id += '.' + parts[1].toLowerCase();
    } else {
      id += '.' + Math.floor(Math.random()*100);
    }
    const pass = id.replace('.', '') + "123";
    addCoreCred(id, pass, 'basic', newName.trim(), 'Member');
    setNewName('');
    setIslandMessage(`ID Generated: ${id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-20">
      
      <div className={`p-6 rounded-[28px] border relative overflow-hidden ${
        isMaster ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30' : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30'
      }`}>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Shield size={100} />
        </div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <Shield className={isMaster ? "text-red-400" : "text-blue-400"} size={28} />
          <h2 className={`text-2xl font-extrabold tracking-wide ${isMaster ? "text-red-400" : "text-blue-400"}`}>
            Control Panel
          </h2>
        </div>
        <p className="text-sm text-white/70 relative z-10 font-medium">
          {isMaster ? 'You have Master Control access. You can add/delete IDs, grant power levels, and customize themes.' : `You have ${power} Core access. You can manage your own credentials.`}
        </p>
      </div>

      {role === 'admin' && (
        <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <KeyRound size={20} className="text-red-500" /> 
            </div>
            Admin Security
          </h3>
          <p className="text-sm text-white/60 mb-4">Change the primary admin password. (The master override code cannot be changed).</p>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                const p = prompt("Enter new Admin Password:");
                if(p) setAdminPass(p);
              }}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-colors border border-red-500/30"
            >
              Change Admin Password
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isMaster && (
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6b5cff]/20 rounded-xl">
                <Palette size={20} className="text-[#6b5cff]" /> 
              </div>
              Style Studio
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2 block">Background Source</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={bgUrl.startsWith('data:') ? 'Local Image' : bgUrl}
                    onChange={e => setBgUrl(e.target.value)}
                    placeholder="https://..." 
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#6b5cff] outline-none transition-colors"
                  />
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 hover:bg-[#6b5cff] rounded-xl transition-colors border border-white/10">
                    <Upload size={18} />
                  </button>
                </div>
              </div>
              <button onClick={() => setIslandMessage('Theme applied!')} className="w-full py-3 bg-white/10 hover:bg-[#6b5cff] rounded-xl text-sm font-bold transition-colors">
                Apply Theme
              </button>
            </div>
          </div>
        )}

        {canEditBanner && (
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#10b981]/20 rounded-xl">
                <MessageSquare size={20} className="text-[#10b981]" /> 
              </div>
              Announcement Banner
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2 block">Banner Message</label>
                <input 
                  type="text" 
                  value={bannerMsg}
                  onChange={e => setBanner(e.target.value, true)}
                  placeholder="Welcome to..." 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#10b981] outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setBanner(bannerMsg, true)} className="flex-1 py-3 bg-[#10b981]/20 hover:bg-[#10b981] text-[#10b981] hover:text-white rounded-xl text-sm font-bold transition-colors border border-[#10b981]/30">
                  Update & Show
                </button>
                <button onClick={() => setBanner(bannerMsg, false)} className="flex-1 py-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-colors border border-red-500/30">
                  Hide Banner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1e1e3f]/80 border border-white/10 rounded-[28px] p-8 backdrop-blur-xl shadow-2xl">
        
        {canManageIDs && (
          <div className="mb-8 bg-[#181832] p-6 rounded-[24px] border border-white/5">
            <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4">ADD NEW CORE MEMBER</h4>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Full Name (e.g. John Doe)" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[#1e1e3f] border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-[#6b5cff] outline-none transition-colors"
                />
                <p className="text-[10px] text-white/30 mt-2 italic">* ID will be auto-generated as: name.surname</p>
              </div>
              <button 
                onClick={handleGenerateID}
                className="px-6 py-4 bg-[#10b981] hover:bg-[#0da06f] text-white rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 text-sm whitespace-nowrap shadow-lg shadow-green-500/20"
              >
                <Plus size={16} /> GENERATE ID
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#181832] rounded-[24px] border border-white/5 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest bg-black/20">
            <div className="col-span-5">NAME & ID</div>
            <div className="col-span-5">ROLE & POST</div>
            <div className="col-span-2 text-right">ACTIONS</div>
          </div>

          <div className="divide-y divide-white/5">
            {visibleCreds.map(cred => (
              <div key={cred.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-white/5 transition-colors group">
                <div className="col-span-5 flex items-center gap-3">
                  <div>
                    <p className="font-bold text-[15px] text-white leading-tight">{cred.name || cred.id}</p>
                    <p className="text-[13px] text-white/40 mt-0.5">{cred.id}</p>
                    {(isMaster || cred.id === coreId) && (
                       <p className="text-[10px] text-white/20 mt-1 font-mono hover:text-[#fca311] transition-colors">PWD: {cred.pass}</p>
                    )}
                  </div>
                </div>
                
                <div className="col-span-5 flex flex-col gap-2">
                  <div className="relative inline-block w-fit">
                    <select 
                      disabled={!canManageIDs}
                      value={mapPowerToLevel(cred.power)}
                      onChange={(e) => updateCoreCred(cred.id, { power: mapLevelToPower(e.target.value) as any })}
                      className="bg-[#2a2a4a] border border-white/10 rounded-lg px-3 py-1.5 text-[13px] font-medium text-white appearance-none outline-none focus:border-[#6b5cff] disabled:opacity-70 pr-8 shadow-sm cursor-pointer"
                    >
                      {levels.map(l => <option key={l} value={l} className="bg-[#1e1e3f]">{l}</option>)}
                    </select>
                    {canManageIDs && <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#fca311] text-[10px]">▼</div>}
                  </div>
                  <div className="relative inline-block w-fit mt-1">
                    <select 
                      disabled={!canManageIDs}
                      value={cred.post || "Member"}
                      onChange={(e) => updateCoreCred(cred.id, { post: e.target.value })}
                      className="bg-transparent border-none text-[#fca311] text-[13px] font-medium appearance-none outline-none cursor-pointer pr-6 hover:text-yellow-300 transition-colors"
                    >
                      {posts.map(p => <option key={p} value={p} className="bg-[#1e1e3f] text-white">{p}</option>)}
                    </select>
                    {canManageIDs && <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#fca311] text-[10px]">▼</div>}
                  </div>
                </div>

                <div className="col-span-2 flex justify-end items-center gap-3">
                  {!canManageIDs && cred.id === coreId && (
                     <button 
                     onClick={() => {
                       const newPass = prompt("New Password:", cred.pass);
                       if(newPass) updateCoreCred(cred.id, { pass: newPass });
                     }}
                     className="px-3 py-1.5 bg-[#6b5cff]/20 hover:bg-[#6b5cff]/40 text-[#6b5cff] hover:text-white rounded-lg text-xs font-bold transition-colors"
                   >
                     Pass
                   </button>
                  )}
                  {canManageIDs && (
                    <button 
                      onClick={() => {
                        if(confirm(`Permanently delete ${cred.id}?`)) deleteCoreCred(cred.id);
                      }}
                      className="text-red-500/50 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}