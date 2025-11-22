import React from 'react';
import { useData } from '../services/dataContext';
import { MapPin, Phone, Users, Calendar } from 'lucide-react';

const Centers = () => {
  const { data } = useData();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-stone-800">Wellness Centers</h2>
            <p className="text-stone-500">Managed locations in Dhanbad Region</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.centers.map(center => {
          const trainerCount = data.trainers.filter(t => t.centerId === center.id).length;
          const clientCount = data.clients.filter(c => c.centerId === center.id).length;
          
          return (
            <div key={center.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 flex flex-col">
              <div className="h-32 bg-emerald-100 flex items-center justify-center relative">
                <MapPin className="text-emerald-300 w-16 h-16 opacity-50" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-white font-bold text-lg drop-shadow-md">{center.name}</h3>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="flex items-start gap-3 text-stone-600">
                        <MapPin className="w-5 h-5 mt-0.5 text-emerald-600" />
                        <span>{center.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-stone-600">
                        <Phone className="w-5 h-5 text-emerald-600" />
                        <span>{center.phone}</span>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-stone-400 text-xs font-semibold uppercase">
                            <Users size={12} /> Trainers
                        </div>
                        <p className="text-2xl font-bold text-stone-800">{trainerCount}</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-stone-400 text-xs font-semibold uppercase">
                            <Users size={12} /> Clients
                        </div>
                        <p className="text-2xl font-bold text-stone-800">{clientCount}</p>
                    </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                    <button className="flex-1 py-2 text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">View Schedule</button>
                    <button className="flex-1 py-2 text-sm text-stone-600 border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors">Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Centers;
