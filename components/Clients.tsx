import React, { useState } from 'react';
import { useData } from '../services/dataContext';
import { Client, ProgressLog } from '../types';
import { Search, Plus, X, Activity, Pill, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Clients = () => {
  const { data, addClient, addProgress } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAge, setNewClientAge] = useState('');
  const [newClientCenter, setNewClientCenter] = useState(data.centers[0]?.id || '');

  // Progress State
  const [progressWeight, setProgressWeight] = useState('');
  const [progressNote, setProgressNote] = useState('');

  const filteredClients = data.clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `CL${Date.now()}`;
    const client: Client = {
      id,
      name: newClientName,
      phone: newClientPhone,
      age: parseInt(newClientAge),
      centerId: newClientCenter,
      metrics: { weightKg: 0, bp: '', sugar: 0 },
      trainers: [],
      plans: [],
      medicines: [],
      progress: []
    };
    addClient(client);
    setIsAddModalOpen(false);
    setNewClientName('');
    setNewClientPhone('');
    setNewClientAge('');
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    const log: ProgressLog = {
      date: new Date().toISOString().split('T')[0],
      weightKg: parseFloat(progressWeight),
      note: progressNote
    };
    addProgress(selectedClient.id, log);
    setProgressWeight('');
    setProgressNote('');
    // Update local selected client to reflect changes immediately in modal
    const updatedClient = { 
        ...selectedClient, 
        progress: [...selectedClient.progress, log],
        metrics: { ...selectedClient.metrics, weightKg: log.weightKg }
    };
    setSelectedClient(updatedClient);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-stone-800">Clients & Members</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-stone-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search clients by name or phone..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Client List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div 
            key={client.id} 
            onClick={() => setSelectedClient(client)}
            className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-stone-800 text-lg">{client.name}</h3>
                <p className="text-sm text-stone-500">{data.centers.find(c => c.id === client.centerId)?.name}</p>
              </div>
              <span className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full">{client.age} yrs</span>
            </div>
            
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" />
                <span>Wt: {client.metrics.weightKg || '--'} kg • BP: {client.metrics.bp || '--'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Pill size={14} className="text-blue-500" />
                <span>Meds: {client.medicines.length} • Plans: {client.plans.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">New Client Intake</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-stone-100 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input required type="text" className="w-full p-2 border rounded-lg" value={newClientName} onChange={e => setNewClientName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
                    <input required type="number" className="w-full p-2 border rounded-lg" value={newClientAge} onChange={e => setNewClientAge(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                    <input required type="tel" className="w-full p-2 border rounded-lg" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Assign Center</label>
                <select className="w-full p-2 border rounded-lg" value={newClientCenter} onChange={e => setNewClientCenter(e.target.value)}>
                    {data.centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700">Register Client</button>
            </form>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 p-6 shadow-xl animate-in zoom-in-95 relative">
             <button onClick={() => setSelectedClient(null)} className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full"><X size={24} /></button>
             
             <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Info */}
                <div className="md:w-1/3 space-y-6 border-r border-stone-100 pr-4">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800">{selectedClient.name}</h2>
                        <p className="text-stone-500">{selectedClient.phone}</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-xl space-y-2">
                        <p className="text-sm font-semibold text-stone-700">Current Vitals</p>
                        <div className="flex justify-between text-sm"><span>Weight:</span> <b>{selectedClient.metrics.weightKg} kg</b></div>
                        <div className="flex justify-between text-sm"><span>BP:</span> <b>{selectedClient.metrics.bp}</b></div>
                        <div className="flex justify-between text-sm"><span>Sugar:</span> <b>{selectedClient.metrics.sugar}</b></div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2"><Pill size={16} /> Medicines</h4>
                        {selectedClient.medicines.length > 0 ? (
                            <ul className="text-sm space-y-1">
                                {selectedClient.medicines.map((m, i) => <li key={i} className="text-stone-600">• {m.name} ({m.dose})</li>)}
                            </ul>
                        ) : <p className="text-xs text-stone-400">No active medication.</p>}
                    </div>
                </div>

                {/* Right Column: Progress & Plans */}
                <div className="md:w-2/3 space-y-6">
                    
                    {/* Progress Chart */}
                    <div className="h-48 w-full bg-stone-50 rounded-xl p-4 relative">
                        <h4 className="text-sm font-semibold text-stone-600 mb-2">Weight Progress</h4>
                        {selectedClient.progress.length > 0 ? (
                             <ResponsiveContainer width="100%" height="80%">
                                <LineChart data={selectedClient.progress}>
                                    <XAxis dataKey="date" hide />
                                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="weightKg" stroke="#10b981" strokeWidth={2} dot={{r:3}} />
                                </LineChart>
                             </ResponsiveContainer>
                        ) : <div className="flex items-center justify-center h-full text-stone-400 text-sm">No data points yet</div>}
                    </div>

                    {/* Add Progress Form */}
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <h4 className="font-bold text-emerald-800 text-sm mb-2">Log New Progress</h4>
                        <form onSubmit={handleAddProgress} className="flex gap-2 items-end">
                            <div className="flex-1">
                                <label className="text-xs text-emerald-700">Weight (kg)</label>
                                <input required type="number" step="0.1" className="w-full p-1.5 text-sm rounded border-emerald-200" value={progressWeight} onChange={e => setProgressWeight(e.target.value)} />
                            </div>
                            <div className="flex-[2]">
                                <label className="text-xs text-emerald-700">Note</label>
                                <input required type="text" className="w-full p-1.5 text-sm rounded border-emerald-200" value={progressNote} onChange={e => setProgressNote(e.target.value)} />
                            </div>
                            <button type="submit" className="bg-emerald-600 text-white text-sm px-3 py-1.5 rounded hover:bg-emerald-700">Save</button>
                        </form>
                    </div>

                    {/* Logs History */}
                    <div>
                        <h4 className="font-semibold mb-2">History</h4>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {selectedClient.progress.map((p, i) => (
                                <div key={i} className="text-sm flex justify-between border-b border-stone-100 pb-1">
                                    <span className="text-stone-500">{p.date}</span>
                                    <span className="font-medium text-stone-800">{p.note}</span>
                                    <span className="font-bold text-emerald-600">{p.weightKg}kg</span>
                                </div>
                            ))}
                            {selectedClient.progress.length === 0 && <p className="text-sm text-stone-400 italic">No logs recorded.</p>}
                        </div>
                    </div>

                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
