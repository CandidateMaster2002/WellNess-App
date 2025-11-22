import React from 'react';
import { useData } from '../services/dataContext';
import { Download, Printer, FileText } from 'lucide-react';

const Reports = () => {
  const { data } = useData();

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = (filename: string, rows: object[]) => {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(row => headers.map(fieldName => JSON.stringify((row as any)[fieldName])).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getClientExportData = () => {
    return data.clients.map(c => ({
        ID: c.id,
        Name: c.name,
        Phone: c.phone,
        Center: data.centers.find(ctr => ctr.id === c.centerId)?.name,
        Weight: c.metrics.weightKg,
        Conditions: c.plans.map(pId => data.plans.find(p=>p.id===pId)?.title).join('; ')
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
          <h2 className="text-2xl font-bold text-stone-800">Reports & Exports</h2>
          <p className="text-stone-500">Download data for offline analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Client List Export */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
            <div className="bg-emerald-100 p-4 rounded-full mb-4 text-emerald-600">
                <UsersIcon />
            </div>
            <h3 className="font-bold text-lg mb-2">Client Registry</h3>
            <p className="text-sm text-stone-500 mb-6">Export full list of {data.clients.length} registered clients with health metrics.</p>
            <button 
                onClick={() => exportCSV('clients_export', getClientExportData())}
                className="w-full py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 flex items-center justify-center gap-2"
            >
                <Download size={16} /> Export CSV
            </button>
        </div>

        {/* Appointment Export */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
                <FileText size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Appointments</h3>
            <p className="text-sm text-stone-500 mb-6">Download schedule log for {data.appointments.length} active bookings.</p>
            <button 
                onClick={() => exportCSV('appointments_export', data.appointments)}
                className="w-full py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 flex items-center justify-center gap-2"
            >
                <Download size={16} /> Export CSV
            </button>
        </div>

        {/* Print View */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
            <div className="bg-amber-100 p-4 rounded-full mb-4 text-amber-600">
                <Printer size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Print Summary</h3>
            <p className="text-sm text-stone-500 mb-6">Generate a browser-native print view of the current dashboard.</p>
            <button 
                onClick={handlePrint}
                className="w-full py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 flex items-center justify-center gap-2"
            >
                <Printer size={16} /> Print Page
            </button>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
        <h3 className="font-bold text-emerald-900 mb-2">Monthly Demo Report</h3>
        <p className="text-sm text-emerald-800 mb-4">
            This is a static view demonstrating how a monthly PDF report might look generated client-side.
        </p>
        <div className="bg-white p-8 shadow-sm max-w-2xl mx-auto text-xs font-mono border">
            <h1 className="text-lg font-bold mb-4 border-b pb-2">DHANBAD WELLNESS - NOV 2025</h1>
            <div className="grid grid-cols-2 gap-8 mb-4">
                <div>
                    <span className="block text-stone-400">NEW CLIENTS</span>
                    <span className="text-xl font-bold">2</span>
                </div>
                <div>
                    <span className="block text-stone-400">REVENUE (EST)</span>
                    <span className="text-xl font-bold">₹ 45,000</span>
                </div>
            </div>
            <p className="mb-2 font-bold">TOP TRAINERS:</p>
            <ul>
                {data.trainers.map(t => (
                    <li key={t.id} className="flex justify-between border-b border-dotted py-1">
                        <span>{t.name}</span>
                        <span>{data.appointments.filter(a => a.trainerId === t.id).length} Sessions</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    )
}

export default Reports;
