import React from 'react';
import { useData } from '../services/dataContext';
import { Users, Calendar, Activity, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MetricCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-stone-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-stone-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { data } = useData();

  // KPI Calculations
  const totalClients = data.clients.length;
  const activePlans = data.clients.reduce((acc, c) => acc + c.plans.length, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Mock "Today" as the demo date usually, but let's check real today or just show all upcoming
  const appointmentsToday = data.appointments.filter(a => a.start.startsWith(todayStr)).length;
  const activeCenters = data.centers.length;

  // Chart Data Preparation
  // 1. Appointments by Trainer
  const apptsByTrainer = data.trainers.map(t => ({
    name: t.name.split(' ')[0], // First name
    count: data.appointments.filter(a => a.trainerId === t.id).length
  }));

  // 2. Client Growth (Mocked based on client registration which isn't in schema, so we simulate progress)
  const progressData = data.clients.flatMap(c => c.progress).sort((a, b) => a.date.localeCompare(b.date));
  const progressChartData = progressData.length > 0 ? progressData : [{ date: 'Start', weightKg: 0 }];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-stone-800">Dashboard Overview</h2>
        <p className="text-stone-500">Welcome back, Admin. Here is what's happening today.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Clients" value={totalClients} icon={Users} color="bg-emerald-500 text-emerald-600" />
        <MetricCard title="Active Plans" value={activePlans} icon={Activity} color="bg-blue-500 text-blue-600" />
        <MetricCard title="Appointments Today" value={appointmentsToday} icon={Calendar} color="bg-amber-500 text-amber-600" />
        <MetricCard title="Centers Active" value={activeCenters} icon={MapPin} color="bg-purple-500 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-semibold mb-4 text-stone-700">Trainer Workload</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apptsByTrainer}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Upcoming */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-semibold mb-4 text-stone-700">Upcoming Appointments</h3>
          <div className="space-y-3">
            {data.appointments.length === 0 ? (
              <p className="text-stone-400 italic">No upcoming appointments.</p>
            ) : (
              data.appointments.slice(0, 4).map(appt => {
                const client = data.clients.find(c => c.id === appt.clientId);
                const trainer = data.trainers.find(t => t.id === appt.trainerId);
                const date = new Date(appt.start);
                return (
                  <div key={appt.id} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg border border-transparent hover:border-stone-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        {date.getDate()}
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">{client?.name || 'Unknown Client'}</p>
                        <p className="text-xs text-stone-500">{appt.type} • {trainer?.name}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-stone-600">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
