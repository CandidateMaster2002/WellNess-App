import React, { useState } from 'react';
import { useData } from '../services/dataContext';
import { Plan } from '../types';
import { Plus, Trash2, Edit2, Tag, Percent } from 'lucide-react';

const Plans = () => {
  const { data, addPlan, deletePlan } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats
  const totalPlans = data.plans.length;
  const activePlans = data.clients.reduce((uniquePlans, client) => {
    client.plans.forEach(pId => uniquePlans.add(pId));
    return uniquePlans;
  }, new Set<string>()).size;
  
  const clientCoverage = totalPlans > 0 
    ? Math.round((data.clients.filter(c => c.plans.length > 0).length / data.clients.length) * 100) 
    : 0;

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Plan['type']>('combined');
  const [yoga, setYoga] = useState('');
  const [diet, setDiet] = useState('');
  const [duration, setDuration] = useState(4);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: Plan = {
      id: `P${Date.now()}`,
      title,
      type,
      yoga: yoga || undefined,
      diet: diet || undefined,
      startDate: new Date().toISOString().split('T')[0],
      durationWeeks: duration,
      price,
      discount
    };
    addPlan(newPlan);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setType('combined');
    setYoga('');
    setDiet('');
    setDuration(4);
    setPrice(0);
    setDiscount(0);
  };

  const getPriceDisplay = (plan: Plan) => {
    const finalPrice = plan.discount 
      ? plan.price - (plan.price * (plan.discount / 100))
      : plan.price;
    
    return (
      <div className="flex flex-col items-start mt-3 p-3 bg-stone-50 rounded-lg">
        <p className="text-xs font-semibold text-stone-500 uppercase flex items-center gap-1 mb-1">
          <Tag size={12} /> Price
        </p>
        <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700">₹{finalPrice.toLocaleString('en-IN')}</span>
            {plan.discount ? (
                <>
                <span className="text-sm text-stone-400 line-through">₹{plan.price.toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded flex items-center">
                    <Percent size={10} className="mr-0.5" />{plan.discount}% OFF
                </span>
                </>
            ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Plans & Medicines</h2>
          <p className="text-stone-500">Create and manage wellness plans with templates.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all font-medium"
        >
          <Plus size={18} />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
            <p className="text-stone-500 text-sm font-medium mb-1">Total Plans</p>
            <p className="text-3xl font-bold text-stone-800">{totalPlans}</p>
        </div>
        <div className="border-l border-stone-100 pl-8 hidden md:block">
            <p className="text-stone-500 text-sm font-medium mb-1">Active Plans</p>
            <p className="text-3xl font-bold text-stone-800">{activePlans}</p>
        </div>
        <div className="border-l border-stone-100 pl-8 hidden md:block">
            <p className="text-stone-500 text-sm font-medium mb-1">Client Coverage</p>
            <p className="text-3xl font-bold text-stone-800">{clientCoverage}%</p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.plans.map(plan => {
          const clientCount = data.clients.filter(c => c.plans.includes(plan.id)).length;
          
          let badgeColor = "bg-stone-100 text-stone-600";
          if (plan.type === 'combined') badgeColor = "bg-purple-50 text-purple-700";
          if (plan.type === 'physio') badgeColor = "bg-blue-50 text-blue-700";
          if (plan.type === 'diet') badgeColor = "bg-amber-50 text-amber-700";

          return (
            <div key={plan.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-stone-800 leading-tight pr-4">{plan.title}</h3>
                  </div>
                  
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${badgeColor}`}>
                    {plan.type}
                  </span>

                  <div className="mt-6 space-y-4">
                    {plan.yoga && (
                        <div>
                            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Yoga</p>
                            <p className="text-sm text-stone-600">{plan.yoga}</p>
                        </div>
                    )}
                    {plan.diet && (
                        <div>
                            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Diet</p>
                            <p className="text-sm text-stone-600">{plan.diet}</p>
                        </div>
                    )}
                  </div>

                  {getPriceDisplay(plan)}
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50 rounded-lg p-3">
                        <p className="text-xs text-emerald-600 font-medium">Duration</p>
                        <p className="text-lg font-bold text-emerald-800">{plan.durationWeeks}w</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs text-amber-600 font-medium">Clients</p>
                        <p className="text-lg font-bold text-amber-800">{clientCount}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <Edit2 size={14} /> Edit
                    </button>
                    <button 
                        onClick={() => { if(confirm('Delete this plan template?')) deletePlan(plan.id); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Plan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan Title</label>
                <input required type="text" className="w-full border p-2 rounded-lg" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Stress Relief Program" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full border p-2 rounded-lg" value={type} onChange={e => setType(e.target.value as any)}>
                    <option value="combined">Combined</option>
                    <option value="yoga">Yoga Only</option>
                    <option value="diet">Diet Only</option>
                    <option value="physio">Physiotherapy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (Weeks)</label>
                  <input required type="number" min="1" className="w-full border p-2 rounded-lg" value={duration} onChange={e => setDuration(parseInt(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Yoga Routine Details</label>
                <textarea className="w-full border p-2 rounded-lg h-20" value={yoga} onChange={e => setYoga(e.target.value)} placeholder="Describe the yoga sequence..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Diet Plan Details</label>
                <textarea className="w-full border p-2 rounded-lg h-20" value={diet} onChange={e => setDiet(e.target.value)} placeholder="Describe dietary restrictions..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-100">
                <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Base Price (₹)</label>
                    <input required type="number" min="0" className="w-full border p-2 rounded-lg bg-white" value={price} onChange={e => setPrice(parseFloat(e.target.value))} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Discount (%)</label>
                    <input type="number" min="0" max="100" className="w-full border p-2 rounded-lg bg-white" value={discount} onChange={e => setDiscount(parseFloat(e.target.value))} />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-stone-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Create Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;