import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Calendar, Users, MapPin, FileBarChart, RefreshCcw, FileHeart, IndianRupee } from 'lucide-react';
import { useData } from '../services/dataContext';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar = ({ currentView, onChangeView }: SidebarProps) => {
  const { resetData } = useData();

  const navItems: { id: ViewState; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Appointments', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'plans', label: 'Plans & Medicines', icon: FileHeart },
    { id: 'finance', label: 'Finance', icon: IndianRupee },
    { id: 'centers', label: 'Centers', icon: MapPin },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-stone-100">
        <h1 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">D</span>
          Wellness
        </h1>
        <p className="text-xs text-stone-400 mt-1">Manager Portal v1.0</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-100">
        <div className="bg-stone-50 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                <div>
                    <p className="text-sm font-bold text-stone-800">Admin Demo</p>
                    <p className="text-xs text-stone-500">admin@dhanbad.well</p>
                </div>
            </div>
        </div>
        
        <button onClick={resetData} className="w-full flex items-center gap-2 text-xs text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
            <RefreshCcw size={14} /> Reset Demo Data
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;