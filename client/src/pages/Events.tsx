import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Trophy, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Events() {
  const { role, coreCreds, coreId, events, addEvent, updateEvent, deleteEvent, portals, addPortal, updatePortal, deletePortal } = useAppStore();

  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  // BASIC, CLASSIC, MASTER, and ADMIN can edit Events
  const canEdit = isMaster || power === 'basic' || power === 'classic';

  const handleAddEvent = () => {
    const name = prompt("Event Name:");
    if (!name) return;
    const date = prompt("Date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    const desc = prompt("Description:");
    const img = prompt("Image URL (leave blank for default):") || "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800";
    addEvent({ name, date: date || '', description: desc || '', img });
  };

  const handleEditEvent = (e: any) => {
    const name = prompt("New Event Name:", e.name);
    if (!name) return;
    const date = prompt("New Date:", e.date);
    const desc = prompt("New Description:", e.description);
    const img = prompt("New Image URL:", e.img);
    updateEvent(e.id, { name, date: date || e.date, description: desc || e.description, img: img || e.img });
  };

  const handleAddPortal = () => {
    const title = prompt("Portal Name:");
    if(!title) return;
    const link = prompt("Portal Link URL:");
    const icon = prompt("Emoji Icon (e.g. 🏆):", "🏆") || "🏆";
    addPortal({ title, link: link || '#', icon });
  };

  const handleEditPortal = (p: any) => {
    const title = prompt("New Portal Name:", p.title);
    if(!title) return;
    const link = prompt("New Link:", p.link);
    const icon = prompt("New Emoji Icon:", p.icon);
    updatePortal(p.id, { title, link: link || p.link, icon: icon || p.icon });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 animate-in fade-in duration-500 pb-20">
      <h2 className="text-3xl font-bold tracking-tight px-1">Event Gallery</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold tracking-wide">Portals</h3>
          {role === 'admin' && (
            <button onClick={handleAddPortal} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-colors">
              + Add Portal
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {portals.map(p => (
            <PortalCard key={p.id} portal={p} canEdit={role === 'admin'} onEdit={() => handleEditPortal(p)} onDelete={() => deletePortal(p.id)} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold tracking-wide">Events</h3>
          {canEdit && (
            <button onClick={handleAddEvent} className="bg-[#10b981] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#0da06f] transition-all shadow-lg active:scale-95">
              <Plus size={18} /> Add Event
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.length === 0 && <p className="text-white/40 italic px-2">No events currently.</p>}
          {events.map(e => (
            <div key={e.id} className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-[#6b5cff]/30 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={e.img} alt={e.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="p-6 relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#6b5cff]" />
                  <h4 className="font-bold text-xl">{e.name}</h4>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-6">{e.description}</p>
                <div className="flex items-center justify-between text-white/30 font-mono text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} /> {e.date}
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEditEvent(e)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-[#6b5cff] transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => { if(confirm("Delete event?")) deleteEvent(e.id) }} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PortalCard({ portal, canEdit, onEdit, onDelete }: any) {
  return (
    <div className="bg-[#1e1e3f]/60 border border-white/5 p-8 rounded-[32px] text-center backdrop-blur-xl hover:bg-[#6b5cff]/10 hover:border-[#6b5cff]/20 transition-all relative group">
      {canEdit && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={onEdit} className="p-1.5 bg-black/40 hover:bg-[#6b5cff] rounded-lg text-white/60 hover:text-white transition-colors"><Edit2 size={12}/></button>
           <button onClick={onDelete} className="p-1.5 bg-black/40 hover:bg-red-500 rounded-lg text-white/60 hover:text-white transition-colors"><Trash2 size={12}/></button>
        </div>
      )}
      <a href={portal.link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300">{portal.icon}</div>
        <h4 className="font-bold text-lg mb-1">{portal.title}</h4>
        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
          Open portal <ExternalLink size={10} />
        </p>
      </a>
    </div>
  );
}