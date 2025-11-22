import React, { useState } from 'react';
import { useData } from '../services/dataContext';
import { Appointment } from '../types';
import { Calendar as CalendarIcon, Clock, Plus, AlertCircle } from 'lucide-react';

const Appointments = () => {
  const { data, addAppointment, deleteAppointment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('09:00');
  const [formTrainer, setFormTrainer] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formType, setFormType] = useState<Appointment['type']>('Follow-up');
  const [formNotes, setFormNotes] = useState('');

  // Sort appointments by date
  const sortedAppointments = [...data.appointments].sort((a, b) => 
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const checkConflict = (trainerId: string, startIso: string): boolean => {
    // Simple conflict: checks if any appt starts at the exact same time for the trainer.
    // A real app would check ranges.
    return data.appointments.some(a => 
      a.trainerId === trainerId && a.start === startIso
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formTrainer || !formClient || !formDate) {
      setError('Please fill all required fields.');
      return;
    }

    const startIso = `${formDate}T${formTime}:00`;
    // Assume 30 min duration for demo simplicity
    const endDateObj = new Date(new Date(startIso).getTime() + 30 * 60000);
    const endIso = endDateObj.toISOString().slice(0, 19);

    if (checkConflict(formTrainer, startIso)) {
      setError('Conflict detected: This trainer is already booked at this time.');
      return;
    }

    const newAppt: Appointment = {
      id: `A${Date.now()}`,
      centerId: data.trainers.find(t => t.id === formTrainer)?.centerId || 'C1',
      trainerId: formTrainer,
      clientId: formClient,
      start: startIso,
      end: endIso,
      type: formType,
      notes: formNotes
    };

    addAppointment(newAppt);
    setIsModalOpen(false);
    // Reset form
    setFormNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">Appointment Schedule</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Appointment Cards List (Agenda View) */}
      <div className="space-y-4">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-stone-300">
            <CalendarIcon className="mx-auto h-12 w-12 text-stone-300 mb-3" />
            <h3 className="text-lg font-medium text-stone-900">No appointments scheduled</h3>
            <p className="text-stone-500">Get started by scheduling a new session.</p>
          </div>
        ) : (
          sortedAppointments.map(appt => {
            const client = data.clients.find(c => c.id === appt.clientId);
            const trainer = data.trainers.find(t => t.id === appt.trainerId);
            const center = data.centers.find(c => c.id === appt.centerId);
            const dateObj = new Date(appt.start);

            return (
              <div key={appt.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-emerald-500 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-shadow">
                <div className="flex gap-4 items-start">
                  <div className="text-center min-w-[60px]">
                    <div className="text-xs font-bold text-stone-500 uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-2xl font-bold text-emerald-600">{dateObj.getDate()}</div>
                    <div className="text-xs text-stone-400">{dateObj.toLocaleString('default', { weekday: 'short' })}</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg">{client?.name || 'Unknown'} <span className="text-stone-400 font-normal text-sm">with {trainer?.name}</span></h3>
                    <div className="flex flex-wrap gap-3 text-sm text-stone-500 mt-1">
                      <span className="flex items-center gap-1"><Clock size={14}/> {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600">{appt.type}</span>
                      <span>{center?.name}</span>
                    </div>
                    {appt.notes && <p className="text-stone-500 text-sm italic mt-1">"{appt.notes}"</p>}
                  </div>
                </div>
                <button 
                  onClick={() => { if(confirm('Cancel this appointment?')) deleteAppointment(appt.id); }}
                  className="mt-4 sm:mt-0 text-red-400 hover:text-red-600 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold mb-4">Schedule Appointment</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" required className="w-full border p-2 rounded-lg" value={formDate} onChange={e => setFormDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input type="time" required className="w-full border p-2 rounded-lg" value={formTime} onChange={e => setFormTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client</label>
                  <select required className="w-full border p-2 rounded-lg" value={formClient} onChange={e => setFormClient(e.target.value)}>
                    <option value="">Select Client</option>
                    {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trainer</label>
                  <select required className="w-full border p-2 rounded-lg" value={formTrainer} onChange={e => setFormTrainer(e.target.value)}>
                    <option value="">Select Trainer</option>
                    {data.trainers.map(t => <option key={t.id} value={t.id}>{t.name} ({data.centers.find(c=>c.id===t.centerId)?.name.split(' ')[0]})</option>)}
                  </select>
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full border p-2 rounded-lg" value={formType} onChange={e => setFormType(e.target.value as any)}>
                    <option value="Initial">Initial Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Yoga Class">Yoga Class</option>
                    <option value="Teleconsult">Teleconsult</option>
                  </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea className="w-full border p-2 rounded-lg h-20" value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Purpose of visit..."></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-stone-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
