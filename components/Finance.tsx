import React, { useState } from 'react';
import { useData } from '../services/dataContext';
import { Invoice, InvoiceItem, Transaction } from '../types';
import { Plus, IndianRupee, FileText, CheckCircle, Clock, CreditCard, Banknote, Smartphone, Printer, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Finance = () => {
  const { data, addInvoice, addTransaction } = useData();
  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions' | 'reports'>('invoices');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // States for generating invoice
  const [selectedClientId, setSelectedClientId] = useState('');
  const [invDate, setInvDate] = useState(new Date().toISOString().split('T')[0]);
  const [invDueDate, setInvDueDate] = useState('');
  const [invItems, setInvItems] = useState<InvoiceItem[]>([{ description: '', amount: 0 }]);
  
  // States for recording payment
  const [paymentInvoiceId, setPaymentInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Transaction['method']>('upi');
  const [paymentNote, setPaymentNote] = useState('');

  // Helpers
  const getClientName = (id: string) => data.clients.find(c => c.id === id)?.name || 'Unknown';
  const getClient = (id: string) => data.clients.find(c => c.id === id);
  const getTotalPaidForInvoice = (invId: string) => data.transactions.filter(t => t.invoiceId === invId).reduce((sum, t) => sum + t.amount, 0);

  // --- Actions ---

  const handleAddInvoiceItem = () => {
    setInvItems([...invItems, { description: '', amount: 0 }]);
  };

  const handleUpdateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvItems(newItems);
  };

  const handleSelectPlan = (planId: string) => {
    const plan = data.plans.find(p => p.id === planId);
    if (plan) {
      const finalPrice = plan.discount 
        ? plan.price - (plan.price * (plan.discount / 100)) 
        : plan.price;
      
      setInvItems([{ 
        description: `Plan: ${plan.title}`, 
        amount: finalPrice 
      }]);
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const total = invItems.reduce((sum, item) => sum + Number(item.amount), 0);
    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${String(data.invoices.length + 1).padStart(3, '0')}`,
      clientId: selectedClientId,
      date: invDate,
      dueDate: invDueDate || invDate,
      items: invItems.map(i => ({ ...i, amount: Number(i.amount) })),
      totalAmount: total,
      status: 'pending'
    };
    addInvoice(newInvoice);
    setIsInvoiceModalOpen(false);
    // Reset
    setInvItems([{ description: '', amount: 0 }]);
    setSelectedClientId('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const invoice = data.invoices.find(i => i.id === paymentInvoiceId);
    if (!invoice) return;

    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      invoiceId: paymentInvoiceId,
      clientId: invoice.clientId,
      amount: parseFloat(paymentAmount),
      date: new Date().toISOString().split('T')[0],
      method: paymentMethod,
      note: paymentNote
    };
    
    addTransaction(newTransaction);
    setIsPaymentModalOpen(false);
    setPaymentAmount('');
    setPaymentNote('');
  };

  const openPaymentModal = (invoice: Invoice) => {
    const paid = getTotalPaidForInvoice(invoice.id);
    const remaining = invoice.totalAmount - paid;
    setPaymentInvoiceId(invoice.id);
    setPaymentAmount(remaining.toString());
    setIsPaymentModalOpen(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const client = getClient(invoice.clientId);
    const paid = getTotalPaidForInvoice(invoice.id);
    const balance = invoice.totalAmount - paid;
    const center = data.centers[0]; // Use main center details for invoice header

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            @page { size: A4; margin: 0; }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
            .container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; min-height: 900px; position: relative; }
            .top-bar { background: #f8f9fa; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; }
            .logo { font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -1px; }
            .copy-mark { font-size: 10px; text-transform: uppercase; border: 1px solid #999; padding: 4px 8px; border-radius: 4px; color: #666; }
            
            .header { padding: 30px; display: flex; justify-content: space-between; }
            .company-details h2 { font-size: 18px; margin: 0 0 5px 0; color: #333; }
            .company-details p { font-size: 13px; margin: 2px 0; color: #666; line-height: 1.5; }
            
            .invoice-details { text-align: right; }
            .invoice-details h1 { font-size: 32px; margin: 0 0 10px 0; color: #10b981; font-weight: 300; letter-spacing: 2px; }
            .meta-table { float: right; font-size: 13px; }
            .meta-table td { padding: 3px 0 3px 15px; }
            .meta-table .label { font-weight: 600; color: #666; text-align: right; }
            
            .bill-to { padding: 0 30px 30px 30px; }
            .bill-to h3 { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 700; }
            .client-card { background: #fcfcfc; border: 1px solid #eee; padding: 15px; border-radius: 6px; width: 50%; }
            .client-card p { margin: 2px 0; font-size: 14px; font-weight: 600; color: #333; }
            .client-card .sub { font-weight: 400; font-size: 13px; color: #666; }

            .items-container { padding: 0 30px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px 15px; background: #374151; color: white; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
            .col-desc { width: 70%; }
            .col-amount { text-align: right; width: 30%; }
            tr:nth-child(even) { background-color: #f9fafb; }
            
            .totals-section { display: flex; justify-content: flex-end; padding: 30px; }
            .totals-table { width: 300px; border-collapse: collapse; }
            .totals-table td { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .totals-table .label { font-size: 13px; color: #666; font-weight: 600; }
            .totals-table .value { text-align: right; font-size: 14px; font-weight: 600; color: #333; }
            
            .totals-table .grand-total td { border-top: 2px solid #333; border-bottom: none; padding-top: 15px; font-size: 18px; color: #10b981; font-weight: 800; }
            .totals-table .paid-row td { color: #10b981; font-size: 13px; }
            .totals-table .due-row td { color: #ef4444; font-size: 13px; }

            .footer { position: absolute; bottom: 0; width: 100%; border-top: 1px solid #eee; background: #fcfcfc; padding: 20px 0; text-align: center; font-size: 11px; color: #999; }
            
            .stamp {
                position: absolute;
                top: 45%;
                right: 15%;
                border: 3px solid #10b981;
                color: #10b981;
                font-size: 32px;
                font-weight: bold;
                padding: 10px 30px;
                text-transform: uppercase;
                transform: rotate(-15deg);
                opacity: 0.15;
                pointer-events: none;
                border-radius: 8px;
            }
            .paid-stamp { border-color: #10b981; color: #10b981; }
            .overdue-stamp { border-color: #ef4444; color: #ef4444; opacity: 0.2; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="top-bar">
                <div class="logo">Dhanbad Wellness</div>
                <div class="copy-mark">Original For Recipient</div>
            </div>
            
            <div class="header">
              <div class="company-details">
                <h2>${center.name}</h2>
                <p>${center.address}</p>
                <p>Phone: ${center.phone}</p>
                <p>Email: admin@dhanbad.well</p>
                <p><strong>GSTIN: 20AAAAA0000A1Z5</strong></p>
              </div>
              <div class="invoice-details">
                <h1>TAX INVOICE</h1>
                <table class="meta-table">
                  <tr><td class="label">Invoice #:</td><td>${invoice.id}</td></tr>
                  <tr><td class="label">Date:</td><td>${invoice.date}</td></tr>
                  <tr><td class="label">Due Date:</td><td>${invoice.dueDate}</td></tr>
                  <tr><td class="label">Place of Supply:</td><td>Jharkhand (20)</td></tr>
                </table>
              </div>
            </div>

            <div class="bill-to">
              <h3>Bill To</h3>
              <div class="client-card">
                <p>${client?.name}</p>
                <div class="sub">Client ID: ${client?.id}</div>
                <div class="sub">Phone: ${client?.phone}</div>
                <div class="sub">State: Jharkhand</div>
              </div>
            </div>

            <div class="items-container">
              <table>
                <thead>
                  <tr>
                    <th class="col-desc">Description of Services</th>
                    <th class="col-amount">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => `
                    <tr>
                      <td class="col-desc">
                        <strong>${item.description}</strong>
                        <div style="font-size: 11px; color: #888; margin-top: 2px;">SAC: 999312 - Wellness Services</div>
                      </td>
                      <td class="col-amount">₹${item.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="totals-section">
              <table class="totals-table">
                <tr>
                  <td class="label">Taxable Value</td>
                  <td class="value">₹${invoice.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td class="label">CGST (0%)</td>
                  <td class="value">₹0.00</td>
                </tr>
                <tr>
                  <td class="label">SGST (0%)</td>
                  <td class="value">₹0.00</td>
                </tr>
                <tr class="grand-total">
                  <td class="label">Total Amount</td>
                  <td class="value">₹${invoice.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr class="paid-row">
                  <td class="label">Amount Paid</td>
                  <td class="value">(-) ₹${paid.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr class="due-row">
                  <td class="label">Balance Due</td>
                  <td class="value">₹${balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
              </table>
            </div>

            ${balance <= 0 ? '<div class="stamp paid-stamp">PAID</div>' : ''}
            ${invoice.status === 'overdue' && balance > 0 ? '<div class="stamp overdue-stamp">OVERDUE</div>' : ''}

            <div class="footer">
              <p>Thank you for choosing Dhanbad Wellness. | This is a computer generated invoice.</p>
              <p>Terms & Conditions Apply. Interest @18% pa will be charged on overdue payments.</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // --- Reports Logic ---
  const totalRevenue = data.transactions.reduce((acc, t) => acc + t.amount, 0);
  const pendingAmount = data.invoices.filter(i => i.status !== 'paid').reduce((acc, i) => {
    const paid = getTotalPaidForInvoice(i.id);
    return acc + (i.totalAmount - paid);
  }, 0);

  // Chart Data: Revenue by Month (Mocking last 6 months based on available data)
  const revenueByMonthMap = new Map<string, number>();
  data.transactions.forEach(t => {
    const month = t.date.slice(0, 7); // YYYY-MM
    revenueByMonthMap.set(month, (revenueByMonthMap.get(month) || 0) + t.amount);
  });
  const revenueChartData = Array.from(revenueByMonthMap.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Pie Chart: Payment Methods
  const methodDataMap = new Map<string, number>();
  data.transactions.forEach(t => {
    methodDataMap.set(t.method, (methodDataMap.get(t.method) || 0) + t.amount);
  });
  const methodChartData = Array.from(methodDataMap.entries()).map(([name, value]) => ({ name, value }));
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Finance & Invoicing</h2>
          <p className="text-stone-500">Manage billing, track payments, and analyze revenue.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setIsInvoiceModalOpen(true)}
            className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
        >
          Invoices
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
        >
          Transactions
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reports' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
        >
          Earnings Report
        </button>
      </div>

      {/* --- INVOICES TAB --- */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {data.invoices.map(inv => {
               const paid = getTotalPaidForInvoice(inv.id);
               const progress = Math.min((paid / inv.totalAmount) * 100, 100);
               const isPaid = inv.status === 'paid';
               
               return (
                 <div key={inv.id} className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-stone-800">{getClientName(inv.clientId)}</h3>
                        <p className="text-xs text-stone-500">Inv: {inv.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        isPaid ? 'bg-emerald-100 text-emerald-700' : 
                        inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-stone-600">
                          <span className="truncate w-2/3">{item.description}</span>
                          <span>₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100">
                        <span>Total</span>
                        <span>₹{inv.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Payment Progress */}
                    <div className="mb-4 bg-stone-50 p-3 rounded-lg">
                       <div className="flex justify-between text-xs mb-1.5 font-medium">
                          <span className="text-stone-500">Paid Amount</span>
                          <span className="text-emerald-700">₹{paid.toLocaleString()}</span>
                       </div>
                       <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                       </div>
                       <div className="flex justify-between text-xs mt-1.5">
                           <span className="text-stone-400">{Math.round(progress)}% Complete</span>
                           {!isPaid && <span className="text-red-500 font-medium">₹{(inv.totalAmount - paid).toLocaleString()} Due</span>}
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                       <p className="text-xs text-stone-500">Due: {inv.dueDate}</p>
                       <div className="flex items-center gap-2">
                           <button
                                onClick={() => handlePrintInvoice(inv)}
                                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Print Official Invoice"
                            >
                                <Printer size={18} />
                            </button>
                           {!isPaid ? (
                             <button 
                               onClick={() => openPaymentModal(inv)}
                               className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                             >
                               Record Payment
                             </button>
                           ) : (
                             <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium px-2 py-1 bg-emerald-50 rounded">
                               <CheckCircle size={12} /> Full Paid
                             </span>
                           )}
                       </div>
                    </div>
                 </div>
               )
             })}
             {data.invoices.length === 0 && <p className="text-stone-400 italic">No invoices generated yet.</p>}
          </div>
        </div>
      )}

      {/* --- TRANSACTIONS TAB --- */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Invoice Ref</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Note</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.transactions.map(trx => (
                  <tr key={trx.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="p-4">{trx.date}</td>
                    <td className="p-4 font-medium text-stone-800">{getClientName(trx.clientId)}</td>
                    <td className="p-4 text-stone-500">{trx.invoiceId}</td>
                    <td className="p-4 capitalize flex items-center gap-2">
                       {trx.method === 'cash' && <Banknote size={14} className="text-green-600" />}
                       {trx.method === 'card' && <CreditCard size={14} className="text-blue-600" />}
                       {trx.method === 'upi' && <Smartphone size={14} className="text-purple-600" />}
                       {trx.method}
                    </td>
                    <td className="p-4 text-stone-500 italic">{trx.note || '-'}</td>
                    <td className="p-4 text-right font-bold text-stone-800">₹{trx.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {data.transactions.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-stone-400">No transactions recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- REPORTS TAB --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
           {/* Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><IndianRupee size={20} /></div>
                  <h3 className="text-sm font-medium text-stone-500">Total Revenue</h3>
                </div>
                <p className="text-2xl font-bold text-stone-800">₹{totalRevenue.toLocaleString()}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Clock size={20} /></div>
                  <h3 className="text-sm font-medium text-stone-500">Pending Payments</h3>
                </div>
                <p className="text-2xl font-bold text-stone-800">₹{pendingAmount.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20} /></div>
                  <h3 className="text-sm font-medium text-stone-500">Total Invoices</h3>
                </div>
                <p className="text-2xl font-bold text-stone-800">{data.invoices.length}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <h3 className="font-bold text-stone-800 mb-6">Revenue Trend</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={revenueChartData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                       <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                   </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Methods Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center justify-center">
                 <h3 className="font-bold text-stone-800 mb-6 self-start w-full">Payment Methods</h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={methodChartData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {methodChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex gap-4 justify-center w-full">
                    {methodChartData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-stone-600 capitalize">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                         {entry.name}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
      </div>
      )}

      {/* --- MODALS --- */}

      {/* Create Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">New Invoice</h3>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Client</label>
                        <select required className="w-full border p-2 rounded-lg" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
                            <option value="">Select Client</option>
                            {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Invoice Date</label>
                        <input type="date" required className="w-full border p-2 rounded-lg" value={invDate} onChange={e => setInvDate(e.target.value)} />
                    </div>
                 </div>

                 {/* Helper to auto-fill items based on plan */}
                 <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-800">Quick Fill:</span>
                    <select className="text-sm bg-white border border-emerald-200 rounded px-2 py-1" onChange={e => handleSelectPlan(e.target.value)}>
                        <option value="">Select a Plan to Auto-fill...</option>
                        {data.plans.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                 </div>
                 
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Items</label>
                        <button type="button" onClick={handleAddInvoiceItem} className="text-xs text-blue-600 hover:underline">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                        {invItems.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Description" 
                                    className="flex-[3] border p-2 rounded-lg" 
                                    value={item.description} 
                                    onChange={e => handleUpdateInvoiceItem(index, 'description', e.target.value)}
                                    required 
                                />
                                <input 
                                    type="number" 
                                    placeholder="Amount" 
                                    className="flex-1 border p-2 rounded-lg" 
                                    value={item.amount} 
                                    onChange={e => handleUpdateInvoiceItem(index, 'amount', e.target.value)}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <div className="text-right mt-2 font-bold text-stone-800">
                        Total: ₹{invItems.reduce((sum, i) => sum + Number(i.amount), 0).toLocaleString()}
                    </div>
                 </div>

                 <div className="flex gap-3 pt-4 border-t border-stone-100">
                    <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-stone-50">Cancel</button>
                    <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Generate Invoice</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95">
              <h3 className="text-xl font-bold mb-4">Record Payment</h3>
              <form onSubmit={handleRecordPayment} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                    <input type="number" required step="0.01" className="w-full border p-2 rounded-lg font-bold text-lg" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select required className="w-full border p-2 rounded-lg" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)}>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI / GPay / Paytm</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea className="w-full border p-2 rounded-lg" rows={2} value={paymentNote} onChange={e => setPaymentNote(e.target.value)} placeholder="Transaction ID, etc."></textarea>
                 </div>
                 
                 <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-stone-50">Cancel</button>
                    <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Transaction</button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Finance;