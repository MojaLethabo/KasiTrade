export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "entrepreneur" | "admin";
  business?: Business;
  createdAt: string;
  lastLogin: string;
  loginDates: string[];
};

export type Business = {
  name: string;
  sector: string;
  location: string;
  phone: string;
  stage: string;
  employees: number;
  description: string;
};

export type Customer = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
};

export type Product = {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  unit: string;
};

export type QuotationItem = {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
};

export type Quotation = {
  id: string;
  userId: string;
  customerId: string;
  customerName: string;
  items: QuotationItem[];
  total: number;
  status: "draft" | "sent" | "accepted" | "declined" | "converted";
  date: string;
  validUntil: string;
  notes: string;
};

export type Invoice = {
  id: string;
  userId: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  items: QuotationItem[];
  total: number;
  status: "unpaid" | "partial" | "paid";
  date: string;
  dueDate: string;
  paidAmount: number;
};

export type Receipt = {
  id: string;
  userId: string;
  invoiceId: string;
  customerName: string;
  amount: number;
  method: string;
  date: string;
  note: string;
};

export type Expense = {
  id: string;
  userId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
};

// ─── DUMMY DATA ────────────────────────────────────────────────────────────────

export const users: User[] = [
  {
    id: "u1",
    name: "Thabo Nkosi",
    email: "thabo@kasitrade.co.za",
    password: "password123",
    role: "entrepreneur",
    createdAt: "2024-01-15",
    lastLogin: "2024-04-10",
    loginDates: [
      "2024-02-01","2024-02-08","2024-02-15","2024-02-22",
      "2024-03-01","2024-03-10","2024-03-18","2024-03-25",
      "2024-04-02","2024-04-10",
    ],
    business: {
      name: "Nkosi Electrical Services",
      sector: "Construction & Trades",
      location: "Soweto, Johannesburg",
      phone: "071 234 5678",
      stage: "Growing",
      employees: 4,
      description: "Residential and commercial electrical installations and repairs.",
    },
  },
  {
    id: "u2",
    name: "Zanele Dlamini",
    email: "zanele@kasitrade.co.za",
    password: "password123",
    role: "entrepreneur",
    createdAt: "2024-02-03",
    lastLogin: "2024-04-12",
    loginDates: [
      "2024-02-10","2024-02-20","2024-03-01","2024-03-12",
      "2024-03-22","2024-04-01","2024-04-05","2024-04-12",
    ],
    business: {
      name: "Zanele's Catering & Events",
      sector: "Food & Hospitality",
      location: "Alexandra, Johannesburg",
      phone: "082 987 6543",
      stage: "Early",
      employees: 2,
      description: "Corporate catering, private events, and meal prep services.",
    },
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@kasitrade.co.za",
    password: "admin123",
    role: "admin",
    createdAt: "2023-12-01",
    lastLogin: "2024-04-13",
    loginDates: [],
  },
];

export const customers: Customer[] = [
  // Thabo's customers
  { id: "c1", userId: "u1", name: "Build-It Roodepoort", email: "orders@buildit.co.za", phone: "011 765 4321", address: "14 Main Reef Rd, Roodepoort", createdAt: "2024-01-20" },
  { id: "c2", userId: "u1", name: "Sipho Molefe", email: "sipho@gmail.com", phone: "073 456 7890", address: "45 Vilakazi St, Soweto", createdAt: "2024-02-05" },
  { id: "c3", userId: "u1", name: "Soweto Community Hall", email: "hall@soweto.gov.za", phone: "011 222 3344", address: "Freedom Square, Soweto", createdAt: "2024-03-01" },
  // Zanele's customers
  { id: "c4", userId: "u2", name: "FNB Campus Sandton", email: "facilities@fnb.co.za", phone: "011 999 0000", address: "4 First Place, Sandton", createdAt: "2024-02-10" },
  { id: "c5", userId: "u2", name: "Mpho Sithole", email: "mpho.sithole@gmail.com", phone: "079 111 2222", address: "22 London Rd, Alexandra", createdAt: "2024-03-05" },
  { id: "c6", userId: "u2", name: "Alex Community Centre", email: "info@alexcc.org.za", phone: "011 440 5500", address: "Pan Africa Ave, Alexandra", createdAt: "2024-03-20" },
];

export const products: Product[] = [
  // Thabo's products
  { id: "p1", userId: "u1", name: "Electrical Installation (per point)", description: "Single plug/light point installation", price: 450, unit: "point" },
  { id: "p2", userId: "u1", name: "Distribution Board Upgrade", description: "Full DB board replacement", price: 3500, unit: "job" },
  { id: "p3", userId: "u1", name: "Fault Finding & Repair", description: "Diagnosis and repair of electrical faults", price: 850, unit: "hour" },
  { id: "p4", userId: "u1", name: "Solar Geyser Installation", description: "Supply and install solar water heater", price: 12000, unit: "unit" },
  // Zanele's products
  { id: "p5", userId: "u2", name: "Corporate Lunch (per person)", description: "3-course sit-down lunch service", price: 185, unit: "person" },
  { id: "p6", userId: "u2", name: "Buffet Setup (per person)", description: "Full buffet with 6 salads and 3 mains", price: 220, unit: "person" },
  { id: "p7", userId: "u2", name: "Cake & Dessert Table", description: "Custom dessert table for events", price: 2800, unit: "event" },
  { id: "p8", userId: "u2", name: "Weekly Meal Prep (5 days)", description: "Healthy meal prep for one person", price: 650, unit: "week" },
];

export const quotations: Quotation[] = [
  // Thabo's quotations
  {
    id: "q1", userId: "u1", customerId: "c3", customerName: "Soweto Community Hall",
    items: [
      { productId: "p1", productName: "Electrical Installation (per point)", qty: 12, unitPrice: 450 },
      { productId: "p2", productName: "Distribution Board Upgrade", qty: 1, unitPrice: 3500 },
    ],
    total: 8900, status: "converted", date: "2024-02-10", validUntil: "2024-03-10", notes: "Full hall rewire project",
  },
  {
    id: "q2", userId: "u1", customerId: "c2", customerName: "Sipho Molefe",
    items: [{ productId: "p4", productName: "Solar Geyser Installation", qty: 1, unitPrice: 12000 }],
    total: 12000, status: "sent", date: "2024-03-28", validUntil: "2024-04-28", notes: "Awaiting customer approval",
  },
  {
    id: "q3", userId: "u1", customerId: "c1", customerName: "Build-It Roodepoort",
    items: [{ productId: "p3", productName: "Fault Finding & Repair", qty: 3, unitPrice: 850 }],
    total: 2550, status: "accepted", date: "2024-04-05", validUntil: "2024-05-05", notes: "",
  },
  // Zanele's quotations
  {
    id: "q4", userId: "u2", customerId: "c4", customerName: "FNB Campus Sandton",
    items: [{ productId: "p5", productName: "Corporate Lunch (per person)", qty: 80, unitPrice: 185 }],
    total: 14800, status: "converted", date: "2024-03-01", validUntil: "2024-04-01", notes: "Monthly Friday lunch",
  },
  {
    id: "q5", userId: "u2", customerId: "c6", customerName: "Alex Community Centre",
    items: [
      { productId: "p6", productName: "Buffet Setup (per person)", qty: 120, unitPrice: 220 },
      { productId: "p7", productName: "Cake & Dessert Table", qty: 1, unitPrice: 2800 },
    ],
    total: 29200, status: "sent", date: "2024-04-08", validUntil: "2024-05-08", notes: "Heritage Day function",
  },
];

export const invoices: Invoice[] = [
  // Thabo's invoices
  {
    id: "inv1", userId: "u1", quotationId: "q1", customerId: "c3", customerName: "Soweto Community Hall",
    items: [
      { productId: "p1", productName: "Electrical Installation (per point)", qty: 12, unitPrice: 450 },
      { productId: "p2", productName: "Distribution Board Upgrade", qty: 1, unitPrice: 3500 },
    ],
    total: 8900, status: "paid", date: "2024-02-15", dueDate: "2024-03-15", paidAmount: 8900,
  },
  {
    id: "inv2", userId: "u1", customerId: "c1", customerName: "Build-It Roodepoort",
    items: [{ productId: "p3", productName: "Fault Finding & Repair", qty: 2, unitPrice: 850 }],
    total: 1700, status: "unpaid", date: "2024-03-20", dueDate: "2024-04-20", paidAmount: 0,
  },
  {
    id: "inv3", userId: "u1", customerId: "c2", customerName: "Sipho Molefe",
    items: [{ productId: "p1", productName: "Electrical Installation (per point)", qty: 6, unitPrice: 450 }],
    total: 2700, status: "partial", date: "2024-04-01", dueDate: "2024-04-30", paidAmount: 1350,
  },
  // Zanele's invoices
  {
    id: "inv4", userId: "u2", quotationId: "q4", customerId: "c4", customerName: "FNB Campus Sandton",
    items: [{ productId: "p5", productName: "Corporate Lunch (per person)", qty: 80, unitPrice: 185 }],
    total: 14800, status: "paid", date: "2024-03-10", dueDate: "2024-04-10", paidAmount: 14800,
  },
  {
    id: "inv5", userId: "u2", customerId: "c5", customerName: "Mpho Sithole",
    items: [{ productId: "p8", productName: "Weekly Meal Prep (5 days)", qty: 4, unitPrice: 650 }],
    total: 2600, status: "paid", date: "2024-03-15", dueDate: "2024-04-15", paidAmount: 2600,
  },
  {
    id: "inv6", userId: "u2", customerId: "c4", customerName: "FNB Campus Sandton",
    items: [{ productId: "p5", productName: "Corporate Lunch (per person)", qty: 80, unitPrice: 185 }],
    total: 14800, status: "unpaid", date: "2024-04-05", dueDate: "2024-05-05", paidAmount: 0,
  },
];

export const receipts: Receipt[] = [
  { id: "r1", userId: "u1", invoiceId: "inv1", customerName: "Soweto Community Hall", amount: 8900, method: "EFT", date: "2024-03-10", note: "Full payment received" },
  { id: "r2", userId: "u1", invoiceId: "inv3", customerName: "Sipho Molefe", amount: 1350, method: "Cash", date: "2024-04-03", note: "50% deposit" },
  { id: "r3", userId: "u2", invoiceId: "inv4", customerName: "FNB Campus Sandton", amount: 14800, method: "EFT", date: "2024-04-08", note: "Full payment" },
  { id: "r4", userId: "u2", invoiceId: "inv5", customerName: "Mpho Sithole", amount: 2600, method: "SnapScan", date: "2024-03-16", note: "" },
];

export const expenses: Expense[] = [
  // Thabo's expenses
  { id: "e1", userId: "u1", category: "Materials", description: "Cable rolls and fittings - Makro", amount: 2100, date: "2024-02-12" },
  { id: "e2", userId: "u1", category: "Transport", description: "Fuel - client visits Soweto to Roodepoort", amount: 450, date: "2024-02-20" },
  { id: "e3", userId: "u1", category: "Tools", description: "New multimeter - Cape Union Mart", amount: 780, date: "2024-03-05" },
  { id: "e4", userId: "u1", category: "Labour", description: "Assistant wages - March", amount: 3500, date: "2024-03-31" },
  { id: "e5", userId: "u1", category: "Transport", description: "Fuel - April", amount: 620, date: "2024-04-08" },
  // Zanele's expenses
  { id: "e6", userId: "u2", category: "Ingredients", description: "FNB lunch - food supplies Pick n Pay", amount: 5200, date: "2024-03-08" },
  { id: "e7", userId: "u2", category: "Equipment", description: "Chafing dishes x 6", amount: 1800, date: "2024-03-10" },
  { id: "e8", userId: "u2", category: "Packaging", description: "Meal prep containers - bulk order", amount: 650, date: "2024-03-14" },
  { id: "e9", userId: "u2", category: "Transport", description: "Delivery fuel - March", amount: 380, date: "2024-03-28" },
  { id: "e10", userId: "u2", category: "Ingredients", description: "April catering supplies", amount: 4100, date: "2024-04-06" },
];

// Helper functions
export function getUserById(id: string) {
  return users.find((u) => u.id === id);
}

export function getDataForUser(userId: string) {
  return {
    customers: customers.filter((c) => c.userId === userId),
    products: products.filter((p) => p.userId === userId),
    quotations: quotations.filter((q) => q.userId === userId),
    invoices: invoices.filter((i) => i.userId === userId),
    receipts: receipts.filter((r) => r.userId === userId),
    expenses: expenses.filter((e) => e.userId === userId),
  };
}

export function getTotalIncome(userId: string) {
  return receipts.filter((r) => r.userId === userId).reduce((sum, r) => sum + r.amount, 0);
}

export function getTotalExpenses(userId: string) {
  return expenses.filter((e) => e.userId === userId).reduce((sum, e) => sum + e.amount, 0);
}

export function getUnpaidInvoices(userId: string) {
  return invoices.filter((i) => i.userId === userId && i.status !== "paid");
}

// ─── Monthly Income Trend (platform-wide) ─────────────────────────────────────
export type MonthlyTrend = {
  month: string;       // "Jan 2024"
  income: number;
  expenses: number;
  invoicesIssued: number;
  invoicesPaid: number;
  newCustomers: number;
};

export function getPlatformMonthlyTrend(): MonthlyTrend[] {
  // Build from receipts + expenses grouped by month
  const months = [
    "2024-01","2024-02","2024-03","2024-04",
  ];
  return months.map(m => {
    const label = new Date(m + "-01").toLocaleDateString("en-ZA", { month: "short", year: "numeric" });
    const mIncome   = receipts.filter(r => r.date.startsWith(m)).reduce((s,r) => s + r.amount, 0);
    const mExpenses = expenses.filter(e => e.date.startsWith(m)).reduce((s,e) => s + e.amount, 0);
    const mInvIssued = invoices.filter(i => i.date.startsWith(m)).length;
    const mInvPaid   = invoices.filter(i => i.date.startsWith(m) && i.status === "paid").length;
    const mCustomers = customers.filter(c => c.createdAt.startsWith(m)).length;
    return { month: label, income: mIncome, expenses: mExpenses, invoicesIssued: mInvIssued, invoicesPaid: mInvPaid, newCustomers: mCustomers };
  });
}
