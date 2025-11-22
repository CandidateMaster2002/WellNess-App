import React, { useState } from 'react';
import { DataProvider } from './services/dataContext';
import { ViewState } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Clients from './components/Clients';
import Centers from './components/Centers';
import Reports from './components/Reports';
import Plans from './components/Plans';
import Finance from './components/Finance';
import { Menu } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <Appointments />;
      case 'clients': return <Clients />;
      case 'plans': return <Plans />;
      case 'centers': return <Centers />;
      case 'reports': return <Reports />;
      case 'finance': return <Finance />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex text-stone-800 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-xl pt-16" onClick={e => e.stopPropagation()}>
             {/* Reuse sidebar content logic simplified for mobile */}
             <nav className="flex flex-col p-4 space-y-2">
                {['dashboard', 'calendar', 'clients', 'plans', 'finance', 'centers', 'reports'].map((view) => (
                    <button 
                        key={view}
                        onClick={() => { setCurrentView(view as ViewState); setMobileMenuOpen(false); }}
                        className={`p-3 rounded-lg text-left capitalize ${currentView === view ? 'bg-emerald-50 text-emerald-700' : 'text-stone-600'}`}
                    >
                        {view}
                    </button>
                ))}
             </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="font-bold text-emerald-800">Dhanbad Wellness</h1>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-white rounded shadow-sm"><Menu size={20} /></button>
        </div>

        {renderView()}
        
        <footer className="mt-12 pt-6 border-t border-stone-200 text-center text-stone-400 text-sm">
            <p>© 2025 Dhanbad Wellness Management System. Prototype Build.</p>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}