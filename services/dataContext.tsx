import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppData, Appointment, Client, ProgressLog, Plan, Invoice, Transaction } from '../types';
import { INITIAL_DATA } from '../constants';

interface DataContextType {
  data: AppData;
  addAppointment: (appt: Appointment) => void;
  addClient: (client: Client) => void;
  addProgress: (clientId: string, log: ProgressLog) => void;
  deleteAppointment: (id: string) => void;
  addPlan: (plan: Plan) => void;
  deletePlan: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  addTransaction: (transaction: Transaction) => void;
  resetData: () => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('wellness_app_data');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        // Ensure new fields exist if loading from old localStorage
        if (!parsedData.invoices) parsedData.invoices = [];
        if (!parsedData.transactions) parsedData.transactions = [];
        setData(parsedData);
      } catch (e) {
        console.error("Failed to parse stored data", e);
        setData(INITIAL_DATA);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('wellness_app_data', JSON.stringify(data));
    }
  }, [data, loading]);

  const addAppointment = (appt: Appointment) => {
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, appt]
    }));
  };

  const deleteAppointment = (id: string) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.filter(a => a.id !== id)
    }));
  };

  const addClient = (client: Client) => {
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, client]
    }));
  };

  const addProgress = (clientId: string, log: ProgressLog) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => {
        if (c.id === clientId) {
          return { ...c, progress: [...c.progress, log], metrics: { ...c.metrics, weightKg: log.weightKg } };
        }
        return c;
      })
    }));
  };

  const addPlan = (plan: Plan) => {
    setData(prev => ({
      ...prev,
      plans: [...prev.plans, plan]
    }));
  };

  const deletePlan = (id: string) => {
    setData(prev => ({
      ...prev,
      plans: prev.plans.filter(p => p.id !== id)
    }));
  };

  const addInvoice = (invoice: Invoice) => {
    setData(prev => ({
      ...prev,
      invoices: [invoice, ...prev.invoices]
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    setData(prev => {
      // Add transaction
      const newTransactions = [transaction, ...prev.transactions];
      
      // Update invoice status based on total paid
      const invoice = prev.invoices.find(i => i.id === transaction.invoiceId);
      let newInvoices = prev.invoices;

      if (invoice) {
        const relatedTransactions = newTransactions.filter(t => t.invoiceId === invoice.id);
        const totalPaid = relatedTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        const newStatus = totalPaid >= invoice.totalAmount ? 'paid' : 'pending';
        
        if (newStatus !== invoice.status) {
          newInvoices = prev.invoices.map(i => i.id === invoice.id ? { ...i, status: newStatus } : i);
        }
      }

      return {
        ...prev,
        transactions: newTransactions,
        invoices: newInvoices
      };
    });
  };

  const resetData = () => {
    if (confirm("Are you sure you want to reset all data to the demo default? This cannot be undone.")) {
      setData(INITIAL_DATA);
      window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{ 
      data, 
      addAppointment, 
      addClient, 
      deleteAppointment, 
      addProgress, 
      addPlan,
      deletePlan,
      addInvoice,
      addTransaction,
      resetData, 
      loading 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};