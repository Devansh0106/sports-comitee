import React, { useState } from 'react';
import { useAppStore, getFaceEmoji } from '@/lib/store';
import { Edit2, Trash2, PlusCircle, LayoutDashboard, Users, UserCog, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'mentors' | 'core'>('overview');
  const [coreDept, setCoreDept] = useState('Core Head');

  const goToDept = (dept: string) => {
    setCoreDept(dept);
    setActiveTab('core');
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md relative overflow-hidden">
        <TabButton icon={<LayoutDashboard size={16}/>} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton icon={<Users size={16}/>} label="Mentors" active={activeTab === 'mentors'} onClick={() => setActiveTab('mentors')} />
        <TabButton icon={<UserCog size={16}/>} label="Committee" active={activeTab === 'core'} onClick={() => setActiveTab('core')} />
      </div>

      {activeTab === 'overview' && <OverviewTab onGoToMentors={() => setActiveTab('mentors')} onGoToDept={goToDept} />}
      {activeTab === 'mentors' && <MentorsTab />}
      {activeTab === 'core' && <CoreTab dept={coreDept} setDept={setCoreDept} />}
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${
        active ? 'bg-gradient-to-r from-[#6b5cff] to-[#8073ff] text-white shadow-[0_4px_20px_rgba(107,92,255,0.3)]' : 'text-white/50 hover:text-white/90 hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function OverviewTab({ onGoToMentors, onGoToDept }: { onGoToMentors: () => void, onGoToDept: (dept: string) => void }) {
  const { role, coreId, coreCreds, holidays, addHoliday, updateHoliday, deleteHoliday, bannerMsg, bannerVisible, events, coreMembers } = useAppStore();
  
  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  // BASIC, CLASSIC, MASTER, and ADMIN can edit Dashboard (Holidays)
  const canEditHolidays = isMaster || power === 'basic' || power === 'classic';

  const depts = [
    { name: "Core Head", icon: "👨‍💼" },
    { name: "Equipment Head", icon: "🏀" },
    { name: "Graphic Head", icon: "🎨" },
    { name: "Reels & VFX Head", icon: "🎬" },
    { name: "Treasurer Head", icon: "🤑" },
    { name: "Volunteer Head", icon: "🫂" },
    { name: "Documentation Head", icon: "📝" },
    { name: "Logistics Head", icon: "💰" }
  ];

  const handleAddHoliday = () => {
    const title = prompt("Holiday Title:");
    if (!title) return;
    const range = prompt("Date Range (e.g. DEC 25 - JAN 1):");
    addHoliday({ title, dateRange: range || '' });
  };

  const handleEditHoliday = (h: any) => {
    const title = prompt("New Title:", h.title);
    const range = prompt("New Range:", h.dateRange);
    updateHoliday(h.id, { title: title || h.title, dateRange: range || h.dateRange });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {bannerVisible && (
        <div className="bg-[#6b5cff] text-white p-3 rounded-2xl font-bold text-center animate-pulse shadow-[0_0_20px_rgba(107,92,255,0.4)]">
          📢 {bannerMsg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#6b5cff]/20 to-[#9f7aea]/10 border border-[#6b5cff]/30 p-6 rounded-[24px] text-center backdrop-blur-xl relative overflow-hidden group">
          <p className="text-xs text-[#b0b0cc] mb-2 font-bold tracking-widest uppercase relative z-10">Active Events</p>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 relative z-10">{events.length}</h2>
        </div>
        <div className="bg-gradient-to-br from-[#fca311]/20 to-orange-500/10 border border-[#fca311]/30 p-6 rounded-[24px] text-center backdrop-blur-xl relative overflow-hidden group">
          <p className="text-xs text-[#b0b0cc] mb-2 font-bold tracking-widest uppercase relative z-10">Committee</p>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 relative z-10">{coreMembers.length}</h2>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl p-6 rounded-[28px] border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fca311]"></span>
            Holidays & Break
          </h3>
          {canEditHolidays && (
            <button onClick={handleAddHoliday} className="p-2 bg-white/10 rounded-xl hover:bg-[#6b5cff] transition-colors">
              <Plus size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {holidays.map(h => (
            <div key={h.id} className="min-w-[180px] p-5 rounded-2xl bg-white/5 border border-white/10 shrink-0 relative group">
              <p className="text-[10px] font-bold text-[#fca311] mb-2 tracking-wider uppercase">{h.dateRange}</p>
              <p className="font-bold text-lg leading-tight">{h.title}</p>
              {canEditHolidays && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditHoliday(h)} className="p-1 bg-black/50 rounded-lg text-white/50 hover:text-white">
                    <Edit2 size={10} />
                  </button>
                  <button onClick={() => deleteHoliday(h.id)} className="p-1 bg-black/50 rounded-lg text-red-400/50 hover:text-red-400">
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {holidays.length === 0 && <p className="text-white/20 text-xs italic p-4">No upcoming holidays</p>}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="text-[#6b5cff]" size={20} /> Directory
        </h3>
        
        <div 
          onClick={onGoToMentors}
          className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 hover:border-[#6b5cff]/50 transition-all mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">👨‍🏫</div>
            <h4 className="font-bold text-lg">Our Mentors</h4>
          </div>
          <ArrowRight className="text-white/50" size={20} />
        </div>

        <h4 className="text-sm font-bold text-white/50 tracking-widest uppercase mb-4 mt-6">Core Committee</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {depts.map(d => (
            <div 
              key={d.name}
              onClick={() => onGoToDept(d.name)}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-[#6b5cff]/20 hover:border-[#6b5cff]/50 transition-all group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{d.icon}</div>
              <span className="text-xs font-bold">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}

function MentorsTab() {
  const { role, coreCreds, coreId, mentors, addMentor, updateMentor, deleteMentor } = useAppStore();
  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  // CLASSIC, MASTER, and ADMIN can edit Mentors (Teachers)
  const canEdit = isMaster || power === 'classic';

  const handleAdd = () => {
    const name = prompt("Mentor Name:");
    if (!name) return;
    const designation = prompt("Designation:");
    const description = prompt("Description:");
    const dateAdded = new Date().toISOString().split('T')[0];
    addMentor({ name, designation: designation || '', description: description || '', dateAdded });
  };

  const handleEdit = (m: any) => {
    const newName = prompt("Edit Name:", m.name);
    if (!newName) return;
    const newDesignation = prompt("Edit Designation:", m.designation);
    const newDesc = prompt("Edit Description:", m.description || '');
    updateMentor(m.id, { name: newName, designation: newDesignation || m.designation, description: newDesc || m.description });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
          Our Mentors
        </h2>
        {canEdit && (
          <button onClick={handleAdd} className="flex items-center gap-2 bg-[#10b981]/20 text-[#10b981] px-4 py-2 rounded-xl text-sm font-bold border border-[#10b981]/30 hover:bg-[#10b981]/30 transition-colors">
            <PlusCircle size={16} /> Add Mentor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map(m => (
          <div key={m.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[24px] p-6 relative group hover:bg-white/10 transition-all hover:border-white/20">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#fca311] to-orange-500 shrink-0 flex items-center justify-center text-3xl shadow-[0_4px_20px_rgba(252,163,17,0.3)]">
                {getFaceEmoji(m.name)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1 text-white">{m.name}</h4>
                <p className="text-sm text-[#fca311] font-bold mb-2 tracking-wide uppercase">{m.designation}</p>
                <p className="text-sm text-white/60 leading-relaxed">{m.description}</p>
                {m.dateAdded && <p className="text-[10px] font-mono text-white/30 mt-4 uppercase tracking-widest">Added: {m.dateAdded}</p>}
              </div>
            </div>
            
            {canEdit && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(m)} className="p-2 bg-black/50 rounded-xl text-white/70 hover:text-white hover:bg-[#6b5cff] transition-colors border border-white/10">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => {
                  if(confirm("Delete this mentor?")) deleteMentor(m.id);
                }} className="p-2 bg-black/50 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-colors border border-white/10">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CoreTab({ dept, setDept }: { dept: string, setDept: (d: string) => void }) {
  const { role, coreCreds, coreId, coreMembers, addCoreMember, updateCoreMember, deleteCoreMember, addCoreCred } = useAppStore();
  const depts = ["Core Head", "Equipment Head", "Graphic Head", "Reels & VFX Head", "Treasurer Head", "Volunteer Head", "Documentation Head", "Logistics Head"];
  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  // CLASSIC, MASTER, and ADMIN can edit Core members
  const canEdit = isMaster || power === 'classic';
  const members = coreMembers.filter(m => m.department === dept);

  const handleAdd = () => {
    const name = prompt("Name:");
    if(!name) return;
    const branch = prompt("Branch:");
    const description = prompt("Description:");
    addCoreMember({ department: dept, name, branch: branch || '', description: description || '', dateAdded: new Date().toISOString().split('T')[0] });
    
    // Auto-generate Core ID
    const generatedId = name.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random()*100);
    const generatedPass = name.toLowerCase().replace(/\s+/g, '') + '123';
    addCoreCred(generatedId, generatedPass, 'basic', name, dept);
    alert(`Member added!\nAuto-generated Core ID: ${generatedId}\nPassword: ${generatedPass}`);
  };

  const handleEdit = (m: any) => {
    const n = prompt("New Name:", m.name);
    if (!n) return;
    const b = prompt("New Branch:", m.branch);
    const d = prompt("New Description:", m.description || '');
    updateCoreMember(m.id, { name: n, branch: b || m.branch, description: d || m.description });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 px-1">
        {depts.map(d => (
          <button 
            key={d} 
            onClick={() => setDept(d)}
            className={`whitespace-nowrap px-5 py-3 rounded-[16px] text-sm font-bold transition-all duration-300 border ${
              dept === d 
              ? 'bg-[#6b5cff]/20 text-[#6b5cff] border-[#6b5cff]/50 shadow-[0_0_15px_rgba(107,92,255,0.2)]' 
              : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-[28px] p-6 min-h-[300px] backdrop-blur-md">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white tracking-wide">{dept} <span className="text-[#6b5cff]">Members</span></h3>
          {canEdit && (
            <button onClick={handleAdd} className="flex items-center gap-2 bg-[#10b981]/20 text-[#10b981] px-4 py-2 rounded-xl text-sm font-bold border border-[#10b981]/30 hover:bg-[#10b981]/30 transition-colors">
              <PlusCircle size={16} /> Add Member
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id} className="flex items-center justify-between p-5 bg-black/40 rounded-[20px] border border-white/5 group hover:border-[#6b5cff]/50 hover:bg-black/60 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6b5cff] to-purple-600 flex items-center justify-center text-2xl shadow-lg border border-white/10">
                  {getFaceEmoji(m.name)}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{m.name}</h4>
                  <p className="text-[11px] font-bold text-[#fca311] tracking-wider uppercase mb-1">{m.branch}</p>
                  {m.description && <p className="text-xs text-white/60 line-clamp-2">{m.description}</p>}
                </div>
              </div>
              
              {canEdit && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(m)} className="p-2.5 bg-white/5 hover:bg-[#6b5cff] rounded-xl text-white/70 hover:text-white transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => {
                    if(confirm("Delete member?")) deleteCoreMember(m.id);
                  }} className="p-2.5 bg-white/5 hover:bg-red-500 rounded-xl text-red-400 hover:text-white transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}