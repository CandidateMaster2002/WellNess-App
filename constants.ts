import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  centers: [
    { id: "C1", name: "Dhanbad Wellness — Main", address: "Station Road, Dhanbad", phone: "+91-9000000001" },
    { id: "C2", name: "Dhanbad East Center", address: "Karmabandh, Dhanbad", phone: "+91-9000000002" },
    { id: "C3", name: "Sindri Wellness Hub", address: "Sindri, near market", phone: "+91-9000000003" },
    { id: "C4", name: "Bokaro Outreach", address: "Bokaro Road", phone: "+91-9000000004" },
    { id: "C5", name: "Nearby Health Point", address: "Jharia, Dhanbad", phone: "+91-9000000005" }
  ],
  trainers: [
    { id: "T1", name: "Anita Sharma", centerId: "C1", specialties: ["Yoga", "Lifestyle"], phone: "+91-9810000001" },
    { id: "T2", name: "Ravi Kumar", centerId: "C2", specialties: ["Yoga", "Diet"], phone: "+91-9810000002" },
    { id: "T3", name: "Sunita Verma", centerId: "C3", specialties: ["Physio", "Yoga"], phone: "+91-9810000003" },
    { id: "T4", name: "Dr. A. Khan", centerId: "C1", specialties: ["Physio", "Rehab"], phone: "+91-9810000004" }
  ],
  clients: [
    {
      id: "CL1",
      name: "Suresh Gupta",
      centerId: "C1",
      age: 52,
      phone: "+91-9900000001",
      metrics: { weightKg: 78, bp: "140/90", sugar: 160 },
      trainers: ["T1"],
      plans: ["P1"],
      medicines: [{ name: "Amlodipine", dose: "5mg once daily" }],
      progress: [{ date: "2025-11-01", note: "Started yoga", weightKg: 79 }]
    },
    {
      id: "CL2",
      name: "Meena Devi",
      centerId: "C2",
      age: 45,
      phone: "+91-9900000002",
      metrics: { weightKg: 65, bp: "120/80", sugar: 110 },
      trainers: ["T2"],
      plans: [],
      medicines: [],
      progress: []
    },
    {
      id: "CL3",
      name: "Rahul Verma",
      centerId: "C1",
      age: 29,
      phone: "+91-9900000003",
      metrics: { weightKg: 82, bp: "110/70", sugar: 90 },
      trainers: ["T4"],
      plans: ["P2"],
      medicines: [{ name: "Pain Killer (SOS)", dose: "As needed" }],
      progress: [{ date: "2025-11-10", note: "Back pain reduced", weightKg: 81.5 }]
    },
    {
      id: "CL4",
      name: "Priya Singh",
      centerId: "C3",
      age: 34,
      phone: "+91-9900000004",
      metrics: { weightKg: 70, bp: "115/75", sugar: 95 },
      trainers: ["T3"],
      plans: ["P3"],
      medicines: [],
      progress: [{ date: "2025-11-05", note: "Started diet", weightKg: 70 }]
    },
    {
      id: "CL5",
      name: "Amit Kumar",
      centerId: "C1",
      age: 40,
      phone: "+91-9900000005",
      metrics: { weightKg: 90, bp: "135/85", sugar: 140 },
      trainers: ["T1"],
      plans: ["P1"],
      medicines: [],
      progress: []
    },
    {
      id: "CL6",
      name: "Sneha Roy",
      centerId: "C2",
      age: 26,
      phone: "+91-9900000006",
      metrics: { weightKg: 55, bp: "110/70", sugar: 85 },
      trainers: ["T2"],
      plans: ["P3"],
      medicines: [],
      progress: []
    },
    {
      id: "CL7",
      name: "Vikram Malhotra",
      centerId: "C4",
      age: 60,
      phone: "+91-9900000007",
      metrics: { weightKg: 75, bp: "150/95", sugar: 180 },
      trainers: [],
      plans: [],
      medicines: [{ name: "Metformin", dose: "500mg BD" }],
      progress: []
    }
  ],
  plans: [
    {
      id: "P1",
      title: "Hypertension — 12 week yoga + diet",
      type: "combined",
      yoga: "Daily morning 30 min sequence",
      diet: "Low salt, high fibre, controlled carbs",
      startDate: "2025-11-01",
      durationWeeks: 12,
      price: 12000,
      discount: 10
    },
    {
      id: "P2",
      title: "Post-Injury Recovery — 8 week physio",
      type: "physio",
      yoga: "Gentle stretching, 2x per week",
      startDate: "2025-11-01",
      durationWeeks: 8,
      price: 8500,
      discount: 0
    },
    {
      id: "P3",
      title: "Weight Loss — 16 week combined",
      type: "combined",
      yoga: "Vinyasa flow, 5x per week",
      diet: "Calorie deficit, protein-rich",
      startDate: "2025-11-01",
      durationWeeks: 16,
      price: 15000,
      discount: 15
    }
  ],
  appointments: [
    {
      id: "A1",
      centerId: "C1",
      trainerId: "T1",
      clientId: "CL1",
      start: "2025-11-22T09:00:00",
      end: "2025-11-22T09:30:00",
      type: "Follow-up",
      notes: "Check BP and adjust plan"
    },
    {
      id: "A2",
      centerId: "C1",
      trainerId: "T4",
      clientId: "CL3",
      start: "2025-11-22T10:00:00",
      end: "2025-11-22T10:45:00",
      type: "Initial",
      notes: "Back pain assessment"
    },
    {
      id: "A3",
      centerId: "C3",
      trainerId: "T3",
      clientId: "CL4",
      start: "2025-11-23T08:00:00",
      end: "2025-11-23T09:00:00",
      type: "Yoga Class",
      notes: "Morning group session"
    },
    {
      id: "A4",
      centerId: "C2",
      trainerId: "T2",
      clientId: "CL6",
      start: "2025-11-23T11:00:00",
      end: "2025-11-23T11:30:00",
      type: "Follow-up",
      notes: "Diet review"
    },
    {
      id: "A5",
      centerId: "C1",
      trainerId: "T1",
      clientId: "CL5",
      start: "2025-11-24T09:00:00",
      end: "2025-11-24T09:30:00",
      type: "Teleconsult",
      notes: "Weekly check-in"
    },
    {
      id: "A6",
      centerId: "C1",
      trainerId: "T4",
      clientId: "CL3",
      start: "2025-11-25T16:00:00",
      end: "2025-11-25T16:45:00",
      type: "Follow-up",
      notes: "Physio session 2"
    },
    {
      id: "A7",
      centerId: "C4",
      trainerId: "T1", // Visiting trainer
      clientId: "CL7",
      start: "2025-11-26T10:00:00",
      end: "2025-11-26T11:00:00",
      type: "Initial",
      notes: "Senior citizen assessment"
    },
    {
      id: "A8",
      centerId: "C2",
      trainerId: "T2",
      clientId: "CL2",
      start: "2025-11-26T14:00:00",
      end: "2025-11-26T14:30:00",
      type: "Follow-up",
      notes: "Routine check"
    }
  ],
  invoices: [
    {
      id: "INV-2025-001",
      clientId: "CL1",
      date: "2025-11-01",
      dueDate: "2025-11-15",
      items: [
        { description: "Hypertension — 12 week yoga + diet", amount: 10800 }
      ],
      totalAmount: 10800,
      status: "paid"
    },
    {
      id: "INV-2025-002",
      clientId: "CL2",
      date: "2025-11-20",
      dueDate: "2025-11-27",
      items: [
        { description: "Initial Consultation", amount: 1500 }
      ],
      totalAmount: 1500,
      status: "pending"
    },
    {
      id: "INV-2025-003",
      clientId: "CL3",
      date: "2025-11-10",
      dueDate: "2025-11-17",
      items: [
        { description: "Post-Injury Recovery Plan", amount: 8500 }
      ],
      totalAmount: 8500,
      status: "paid"
    },
    {
      id: "INV-2025-004",
      clientId: "CL4",
      date: "2025-11-05",
      dueDate: "2025-11-12",
      items: [
        { description: "Weight Loss Plan (15% Off)", amount: 12750 }
      ],
      totalAmount: 12750,
      status: "overdue"
    },
    {
      id: "INV-2025-005",
      clientId: "CL5",
      date: "2025-11-21",
      dueDate: "2025-11-28",
      items: [
        { description: "Hypertension Plan", amount: 10800 },
        { description: "Supplements Pack", amount: 2000 }
      ],
      totalAmount: 12800,
      status: "pending"
    },
    {
      id: "INV-2025-006",
      clientId: "CL6",
      date: "2025-11-15",
      dueDate: "2025-11-22",
      items: [
        { description: "Yoga Class Pass (10 sessions)", amount: 3000 }
      ],
      totalAmount: 3000,
      status: "paid"
    }
  ],
  transactions: [
    {
      id: "TRX-101",
      invoiceId: "INV-2025-001",
      clientId: "CL1",
      amount: 5000,
      date: "2025-11-02",
      method: "upi",
      note: "Part payment"
    },
    {
      id: "TRX-102",
      invoiceId: "INV-2025-001",
      clientId: "CL1",
      amount: 5800,
      date: "2025-11-05",
      method: "cash",
      note: "Final settlement"
    },
    {
      id: "TRX-103",
      invoiceId: "INV-2025-003",
      clientId: "CL3",
      amount: 8500,
      date: "2025-11-10",
      method: "card",
      note: "Full payment"
    },
    {
      id: "TRX-104",
      invoiceId: "INV-2025-004",
      clientId: "CL4",
      amount: 5000,
      date: "2025-11-06",
      method: "upi",
      note: "Advance"
    },
    {
      id: "TRX-105",
      invoiceId: "INV-2025-006",
      clientId: "CL6",
      amount: 3000,
      date: "2025-11-15",
      method: "upi",
      note: "Class pass"
    },
    {
      id: "TRX-106",
      invoiceId: "INV-2025-005",
      clientId: "CL5",
      amount: 2000,
      date: "2025-11-21",
      method: "cash",
      note: "Supplements paid"
    }
  ]
};