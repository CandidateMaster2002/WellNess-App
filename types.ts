export interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Trainer {
  id: string;
  name: string;
  centerId: string;
  specialties: string[];
  phone: string;
}

export interface Metrics {
  weightKg: number;
  bp: string;
  sugar: number;
}

export interface Medicine {
  name: string;
  dose: string;
}

export interface ProgressLog {
  date: string;
  note: string;
  weightKg: number;
}

export interface Client {
  id: string;
  name: string;
  centerId: string;
  age: number;
  phone: string;
  metrics: Metrics;
  trainers: string[];
  plans: string[];
  medicines: Medicine[];
  progress: ProgressLog[];
}

export interface Plan {
  id: string;
  title: string;
  type: 'combined' | 'yoga' | 'diet' | 'medical' | 'physio';
  yoga?: string;
  diet?: string;
  startDate: string;
  durationWeeks: number;
  price: number;
  discount?: number; // Percentage 0-100
}

export interface Appointment {
  id: string;
  centerId: string;
  trainerId: string;
  clientId: string;
  start: string; // ISO String
  end: string; // ISO String
  type: 'Initial' | 'Follow-up' | 'Yoga Class' | 'Teleconsult';
  notes: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Transaction {
  id: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'upi' | 'bank_transfer';
  note?: string;
}

export interface AppData {
  centers: Center[];
  trainers: Trainer[];
  clients: Client[];
  plans: Plan[];
  appointments: Appointment[];
  invoices: Invoice[];
  transactions: Transaction[];
}

export type ViewState = 'dashboard' | 'calendar' | 'clients' | 'centers' | 'reports' | 'plans' | 'finance';