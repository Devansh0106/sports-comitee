import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Plus, Trash2, Wallet, TrendingDown, Package, ShoppingCart, ExternalLink, Upload, Image as ImageIcon } from 'lucide-react';

export default function Join() {
  const { role, coreCreds, coreId, expenses, addExpense, deleteExpense, equipment, addEquipment, deleteEquipment } = useAppStore();
  const [activeTab, setActiveTab] = useState<'registration' | 'attendance' | 'budget' | 'equipment'>('registration');

  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  
  const canEditReg = isMaster || power === 'basic' || power === 'classic';
  const canEditBudget = isMaster || power === 'classic';
  const isStaff = role === 'admin' || role === 'core';

  const excelLink = "https://onedrive.live.com/view.aspx?resid=9876543210!123";

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      {isStaff && (
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto scrollbar-hide">
          <TabButton label="Registration" active={activeTab === 'registration'} onClick={() => setActiveTab('registration')} />
          <TabButton label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <TabButton label="Budget" active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} />
          <TabButton label="Equipment" active={activeTab === 'equipment'} onClick={() => setActiveTab('equipment')} />
        </div>
      )}

      {activeTab === 'registration' && <FormView title="Registration Form" actionLabel="Submit Registration" dbTitle="Registration Database" xlsx="gcet sports.xlsx" canEdit={canEditReg} excelLink={excelLink} showUpload={true} />}
      
      {isStaff && (
        <>
          {activeTab === 'attendance' && <FormView title="Attendance Form" actionLabel="Mark Attendance" dbTitle="Attendance Database" xlsx="gcet sports.xlsx" canEdit={canEditReg} excelLink={excelLink} />}
          {activeTab === 'budget' && <BudgetView expenses={expenses} addExpense={addExpense} deleteExpense={deleteExpense} canEdit={canEditBudget} excelLink={excelLink} />}
          {activeTab === 'equipment' && <EquipmentView equipment={equipment} addEquipment={addEquipment} deleteEquipment={deleteEquipment} canEdit={canEditBudget} excelLink={excelLink} />}
        </>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
        active ? 'bg-gradient-to-r from-[#6b5cff] to-[#8073ff] text-white shadow-lg' : 'text-white/40 hover:text-white/80'
      }`}
    >
      {label}
    </button>
  );
}

function FormView({ title, actionLabel, dbTitle, xlsx, canEdit, excelLink, showUpload }: any) {
  const { setIslandMessage } = useAppStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    setIslandMessage(`${title} data saved to ${xlsx}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {canEdit && <button className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-red-600 transition-colors">Unpublish</button>}
      </div>

      <div className="bg-[#1e1e3f]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 space-y-6 shadow-2xl">
        {showUpload && (
          <div className="flex flex-col items-center gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-3xl bg-black/30 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#6b5cff]/50 hover:bg-black/40 transition-all overflow-hidden relative group"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="text-white/20 group-hover:text-[#6b5cff] transition-colors" size={32} />
                  <span className="text-[10px] font-bold text-white/20 mt-2 uppercase tracking-widest">Upload Photo</span>
                </>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="text-white" size={24} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Passport size photo required</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Full Name" />
          <Input placeholder="Email ID" />
          <Input placeholder="Roll Number" />
          <Input placeholder="Mobile Number" />
          <Select options={["B.Tech", "Diploma"]} placeholder="Engineering Type" />
          <Select options={["1", "2", "3", "4"]} placeholder="Year" />
          <Select options={["Football", "Cricket", "Volleyball"]} placeholder="Select Event" />
          <Select options={["1", "2", "3", "4", "5", "6", "7", "8"]} placeholder="Select Semester" />
        </div>
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#6b5cff] hover:bg-[#8073ff] text-white py-4 rounded-2xl font-bold text-lg transition-all mt-4 shadow-lg active:scale-95"
        >
          {actionLabel}
        </button>
      </div>

      {canEdit && (
        <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
                <FileSpreadsheet size={24} />
             </div>
             <div>
               <h4 className="font-bold text-lg">{dbTitle}</h4>
               <p className="text-xs text-white/30 font-mono tracking-wider">{xlsx}</p>
             </div>
          </div>
          <a 
            href={excelLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#0da270] transition-all active:scale-95 shadow-lg shadow-green-500/20"
          >
            Open Live Excel <ExternalLink size={14} />
          </a>
        </div>
      )}
    </motion.div>
  );
}

function BudgetView({ expenses, addExpense, deleteExpense, canEdit, excelLink }: any) {
  const totalAllotted = expenses.filter(e => e.type === 'allotted').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = (type: 'allotted' | 'expense') => {
    const item = prompt(`Enter ${type} item name:`);
    if (!item) return;
    const amount = parseFloat(prompt("Enter amount:") || "0");
    if (isNaN(amount)) return;
    addExpense({ type, item, amount, date: new Date().toLocaleDateString() });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold tracking-tight">Budget Management</h2>
        <a href={excelLink} target="_blank" rel="noopener noreferrer" className="text-green-400 p-2 hover:bg-green-400/10 rounded-xl transition-colors">
          <FileSpreadsheet size={24} />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetStat label="Total Allotted" amount={totalAllotted} color="text-green-400" />
        <BudgetStat label="Total Expense" amount={totalExpense} color="text-red-400" />
      </div>

      {canEdit && (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h4 className="font-bold mb-6 text-white/70 uppercase tracking-widest text-sm">Add Entry</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAdd('allotted')} className="flex items-center justify-center gap-2 bg-[#10b981]/10 text-[#10b981] py-4 rounded-2xl font-bold border border-[#10b981]/20 hover:bg-[#10b981]/20 transition-all active:scale-95">
              <Plus size={20} /> Add Allotted
            </button>
            <button onClick={() => handleAdd('expense')} className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-4 rounded-2xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95">
              <Plus size={20} /> Add Expense
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-bold text-white/50 tracking-widest uppercase text-sm px-1">Recent Entries</h4>
        {expenses.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl py-8 text-center text-white/20 font-medium backdrop-blur-sm">No entries yet.</div>
        ) : (
          expenses.map(e => (
            <div key={e.id} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-[#6b5cff]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${e.type === 'allotted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {e.type === 'allotted' ? <Wallet size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-bold">{e.item}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{e.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className={`font-bold text-lg ${e.type === 'allotted' ? 'text-green-400' : 'text-red-400'}`}>
                  {e.type === 'allotted' ? '+' : '-'} ₹{e.amount}
                </p>
                {canEdit && (
                  <button onClick={() => deleteExpense(e.id)} className="text-white/20 hover:text-red-400 transition-colors p-2 active:scale-90">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function EquipmentView({ equipment, addEquipment, deleteEquipment, canEdit, excelLink }: any) {
  const handleAdd = (type: 'available' | 'wanted') => {
    const name = prompt(`Enter ${type} item name:`);
    if (!name) return;
    const qty = parseInt(prompt("Enter quantity:") || "0");
    if (isNaN(qty)) return;
    addEquipment({ type, name, qty });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold tracking-tight">Equipment List</h2>
        <a href={excelLink} target="_blank" rel="noopener noreferrer" className="text-green-400 p-2 hover:bg-green-400/10 rounded-xl transition-colors">
          <FileSpreadsheet size={24} />
        </a>
      </div>

      <EquipmentSection 
        title="Available Items" 
        items={equipment.filter((e: any) => e.type === 'available')} 
        icon={<Package size={20} className="text-green-400" />}
        onAdd={() => handleAdd('available')}
        onDelete={deleteEquipment}
        canEdit={canEdit}
        dotColor="bg-green-400"
      />

      <EquipmentSection 
        title="Wanted List" 
        items={equipment.filter((e: any) => e.type === 'wanted')} 
        icon={<ShoppingCart size={20} className="text-[#fca311]" />}
        onAdd={() => handleAdd('wanted')}
        onDelete={deleteEquipment}
        canEdit={canEdit}
        dotColor="bg-[#fca311]"
      />
    </motion.div>
  );
}

function EquipmentSection({ title, items, onAdd, onDelete, canEdit, dotColor }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="font-bold flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}></span>
          {title}
        </h4>
        {canEdit && (
          <button onClick={onAdd} className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-500/20 transition-all active:scale-95">
            + Add {title.split(' ')[0]}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item: any) => (
          <div key={item.id} className="bg-black/40 border border-white/5 p-5 rounded-[24px] flex items-center justify-between group hover:border-[#6b5cff]/30 transition-all backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                {getEmoji(item.name)}
              </div>
              <div>
                <p className="font-bold text-lg">{item.name}</p>
                <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Qty: {item.qty}</p>
              </div>
            </div>
            {canEdit && <button onClick={() => onDelete(item.id)} className="text-red-400/50 hover:text-red-400 text-xs font-bold transition-colors active:scale-90">Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetStat({ label, amount, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl shadow-xl">
      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-3">{label}</p>
      <h3 className={`text-4xl font-extrabold ${color} tracking-tighter`}>₹{amount.toLocaleString()}</h3>
    </div>
  );
}

function Input({ placeholder }: any) {
  return <input type="text" placeholder={placeholder} className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#6b5cff] outline-none transition-colors placeholder:text-white/20" />;
}

function Select({ options, placeholder }: any) {
  return (
    <select className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#6b5cff] outline-none appearance-none transition-colors">
      <option value="" className="bg-[#1e1e3f]">{placeholder}</option>
      {options.map((o: any) => <option key={o} value={o} className="bg-[#1e1e3f]">{o}</option>)}
    </select>
  );
}

function getEmoji(name: string) {
  const n = name.toLowerCase();
  if (n.includes('football')) return '⚽';
  if (n.includes('bat') || n.includes('cricket')) return '🏏';
  if (n.includes('basketball')) return '🏀';
  if (n.includes('volleyball')) return '🏐';
  if (n.includes('tennis')) return '🎾';
  if (n.includes('shuttle') || n.includes('badminton')) return '🏸';
  return '📦';
}