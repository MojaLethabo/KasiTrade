export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "entrepreneur" | "admin" | "student";
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
  // ── Student users (SME Support System) ──
  {
    id: "s1",
    name: "Lebogang Mosia",
    email: "lebo@uj.ac.za",
    password: "student123",
    role: "student",
    createdAt: "2024-01-15",
    lastLogin: "2024-04-14",
    loginDates: ["2024-04-10", "2024-04-14"],
  },
  {
    id: "s2",
    name: "Ayanda Khumalo",
    email: "ayanda@uj.ac.za",
    password: "student123",
    role: "student",
    createdAt: "2024-01-20",
    lastLogin: "2024-04-12",
    loginDates: ["2024-04-12"],
  },
  {
    id: "s3",
    name: "Thandi Nkosi",
    email: "thandi@wits.ac.za",
    password: "student123",
    role: "student",
    createdAt: "2024-02-01",
    lastLogin: "2024-04-13",
    loginDates: ["2024-04-08", "2024-04-13"],
  },
  {
    id: "s4",
    name: "Siphamandla Dube",
    email: "sipham@uj.ac.za",
    password: "student123",
    role: "student",
    createdAt: "2024-02-10",
    lastLogin: "2024-04-14",
    loginDates: ["2024-04-11", "2024-04-14"],
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

// ─── Business Intelligence Helpers ────────────────────────────────────────────

export type BusinessTrend = "growing" | "stable" | "declining" | "insufficient_data";

export type DemandSignal = "strong" | "moderate" | "weak" | "no_activity";

export type BusinessHealth = {
  userId: string;
  userName: string;
  businessName: string;
  sector: string;
  // Income trend
  trend: BusinessTrend;
  trendReason: string;
  monthlyIncome: { month: string; value: number }[];
  incomeChange: number; // % change latest vs previous month
  // Demand signals
  demandSignal: DemandSignal;
  demandReason: string;
  quoteVolume: number;
  quoteConversionRate: number;   // % quotes -> converted/accepted
  lostQuoteRate: number;         // % declined
  pendingQuoteValue: number;     // value of sent/draft quotes not yet decided
  // Payment health
  unpaidRate: number;            // % of invoiced value unpaid
  overdueCount: number;
  unpaidValue: number;
  // Overall signal
  overallStatus: "growing" | "stable" | "at_risk" | "needs_support";
  flags: string[];               // specific actionable flags
};

export function analyseBusinessHealth(userId: string): BusinessHealth {
  const user   = getUserById(userId)!;
  const data   = getDataForUser(userId);
  const months = ["2024-01","2024-02","2024-03","2024-04"];

  // Per-month income
  const monthlyIncome = months.map(m => ({
    month: new Date(m + "-01").toLocaleDateString("en-ZA", { month: "short" }),
    value: receipts.filter(r => r.userId === userId && r.date.startsWith(m)).reduce((s, r) => s + r.amount, 0),
  }));

  // Trend: compare latest two non-zero months
  const nonZero = monthlyIncome.filter(m => m.value > 0);
  let trend: BusinessTrend = "insufficient_data";
  let trendReason = "Not enough income data yet";
  let incomeChange = 0;

  if (nonZero.length >= 2) {
    const latest = nonZero[nonZero.length - 1].value;
    const prev   = nonZero[nonZero.length - 2].value;
    incomeChange = prev > 0 ? Math.round(((latest - prev) / prev) * 100) : 0;

    if (incomeChange >= 20) {
      trend = "growing";
      trendReason = `Income up ${incomeChange}% month-on-month`;
    } else if (incomeChange >= -10) {
      trend = "stable";
      trendReason = `Income relatively stable (${incomeChange > 0 ? "+" : ""}${incomeChange}%)`;
    } else {
      trend = "declining";
      trendReason = `Income down ${Math.abs(incomeChange)}% month-on-month`;
    }
  } else if (nonZero.length === 1) {
    trend = "insufficient_data";
    trendReason = "Only one month of income data available";
  }

  // Demand: quotation analysis
  const userQuotes = data.quotations;
  const quoteVolume = userQuotes.length;
  const converted  = userQuotes.filter(q => q.status === "converted" || q.status === "accepted").length;
  const declined   = userQuotes.filter(q => q.status === "declined").length;
  const pending    = userQuotes.filter(q => q.status === "sent" || q.status === "draft");
  const pendingQuoteValue = pending.reduce((s, q) => s + q.total, 0);

  const quoteConversionRate = quoteVolume > 0 ? Math.round((converted / quoteVolume) * 100) : 0;
  const lostQuoteRate       = quoteVolume > 0 ? Math.round((declined  / quoteVolume) * 100) : 0;

  let demandSignal: DemandSignal = "no_activity";
  let demandReason = "No quotations created yet";

  if (quoteVolume === 0) {
    demandSignal = "no_activity";
    demandReason = "No quotation activity recorded";
  } else if (quoteConversionRate >= 50 && lostQuoteRate < 20) {
    demandSignal = "strong";
    demandReason = `${quoteConversionRate}% quote conversion rate, low drop-off`;
  } else if (quoteConversionRate >= 25 || (quoteVolume >= 2 && lostQuoteRate < 40)) {
    demandSignal = "moderate";
    demandReason = `${quoteConversionRate}% conversion — some opportunities being lost`;
  } else {
    demandSignal = "weak";
    demandReason = lostQuoteRate >= 40
      ? `${lostQuoteRate}% of quotes declined — demand or pricing issue`
      : `Low conversion rate (${quoteConversionRate}%) — review follow-up process`;
  }

  // Payment health
  const userInvoices  = data.invoices;
  const totalInvoiced = userInvoices.reduce((s, i) => s + i.total, 0);
  const totalUnpaid   = userInvoices.filter(i => i.status !== "paid").reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const unpaidRate    = totalInvoiced > 0 ? Math.round((totalUnpaid / totalInvoiced) * 100) : 0;
  const now           = new Date("2024-04-17"); // fixed for demo
  const overdueInvoices = userInvoices.filter(i => i.status !== "paid" && new Date(i.dueDate) < now);
  const overdueCount  = overdueInvoices.length;
  const unpaidValue   = totalUnpaid;

  // Flags
  const flags: string[] = [];
  if (trend === "declining")                   flags.push("Revenue declining month-on-month");
  if (trend === "insufficient_data")           flags.push("Limited income history — encourage regular invoicing");
  if (demandSignal === "weak")                 flags.push("Low quote conversion — may need pricing or follow-up support");
  if (demandSignal === "no_activity")          flags.push("No quotation activity — pipeline is empty");
  if (lostQuoteRate >= 40)                     flags.push(`High quote loss rate (${lostQuoteRate}%) — possible pricing or quality concern`);
  if (unpaidRate >= 50)                        flags.push(`${unpaidRate}% of invoiced value is unpaid`);
  if (overdueCount >= 2)                       flags.push(`${overdueCount} overdue invoices — cash flow risk`);
  if (pendingQuoteValue > 0 && quoteVolume > 0) flags.push(`R${pendingQuoteValue.toLocaleString("en-ZA")} in pending quotes — follow up`);
  if (data.customers.length < 2)              flags.push("Low customer base — risk of dependency on single client");

  // Overall status
  let overallStatus: BusinessHealth["overallStatus"];
  const flagCount = flags.length;
  if (trend === "growing" && demandSignal !== "weak" && unpaidRate < 30) {
    overallStatus = "growing";
  } else if (flagCount >= 3 || trend === "declining" || unpaidRate >= 50) {
    overallStatus = "needs_support";
  } else if (flagCount >= 1 || demandSignal === "weak" || unpaidRate >= 30) {
    overallStatus = "at_risk";
  } else {
    overallStatus = "stable";
  }

  return {
    userId, userName: user.name, businessName: user.business?.name || "",
    sector: user.business?.sector || "",
    trend, trendReason, monthlyIncome, incomeChange,
    demandSignal, demandReason,
    quoteVolume, quoteConversionRate, lostQuoteRate, pendingQuoteValue,
    unpaidRate, overdueCount, unpaidValue,
    overallStatus, flags,
  };
}

export function getEcosystemSummary() {
  const entrepreneurs = users.filter(u => u.role === "entrepreneur");
  const health = entrepreneurs.map(e => analyseBusinessHealth(e.id));

  const growing      = health.filter(h => h.overallStatus === "growing").length;
  const stable       = health.filter(h => h.overallStatus === "stable").length;
  const atRisk       = health.filter(h => h.overallStatus === "at_risk").length;
  const needsSupport = health.filter(h => h.overallStatus === "needs_support").length;
  const total        = health.length;

  const totalIncome    = health.reduce((s, h) => s + getTotalIncome(h.userId), 0);
  const totalUnpaid    = health.reduce((s, h) => s + h.unpaidValue, 0);
  const avgConversion  = total > 0 ? Math.round(health.reduce((s, h) => s + h.quoteConversionRate, 0) / total) : 0;
  const pendingPipeline= health.reduce((s, h) => s + h.pendingQuoteValue, 0);

  return {
    total, growing, stable, atRisk, needsSupport,
    totalIncome, totalUnpaid, avgConversion, pendingPipeline,
    growingPct:      total > 0 ? Math.round((growing      / total) * 100) : 0,
    stablePct:       total > 0 ? Math.round((stable       / total) * 100) : 0,
    atRiskPct:       total > 0 ? Math.round((atRisk       / total) * 100) : 0,
    needsSupportPct: total > 0 ? Math.round((needsSupport / total) * 100) : 0,
    health,
  };
}

// ─── Workers / Employees ──────────────────────────────────────────────────────
export type Employee = {
  id: string;
  userId: string;        // owner (entrepreneur)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  role: string;          // job title
  employeeNumber: string;
  bankName: string;
  accountNumber: string;
  startDate: string;
  contractType: "Permanent" | "Fixed-Term" | "Part-Time" | "Casual" | "Contractor" | "Internship";
  salary: number;        // monthly CTC
  active: boolean;
};

export const employees: Employee[] = [
  {
    id: "emp1", userId: "u1",
    firstName: "Sipho", lastName: "Mokoena",
    email: "sipho.mokoena@gmail.com", phone: "072 345 6789",
    idNumber: "9001015009087", role: "Electrician Assistant",
    employeeNumber: "EMP001", bankName: "FNB", accountNumber: "62001234567",
    startDate: "2024-02-01", contractType: "Permanent", salary: 8500, active: true,
  },
  {
    id: "emp2", userId: "u1",
    firstName: "Bongani", lastName: "Dlamini",
    email: "bongani.d@gmail.com", phone: "083 567 8901",
    idNumber: "9503125009083", role: "Apprentice",
    employeeNumber: "EMP002", bankName: "Capitec", accountNumber: "1234567890",
    startDate: "2024-03-15", contractType: "Fixed-Term", salary: 5500, active: true,
  },
  {
    id: "emp3", userId: "u2",
    firstName: "Nomsa", lastName: "Sithole",
    email: "nomsa.sithole@gmail.com", phone: "076 234 5678",
    idNumber: "9702285009081", role: "Chef Assistant",
    employeeNumber: "EMP001", bankName: "Absa", accountNumber: "4056789012",
    startDate: "2024-02-10", contractType: "Part-Time", salary: 4200, active: true,
  },
];

export function getEmployeesForUser(userId: string): Employee[] {
  return employees.filter(e => e.userId === userId);
}

// ═══════════════════════════════════════════════════════════════════
//  SME SUPPORT SYSTEM
// ═══════════════════════════════════════════════════════════════════

export const SUPPORT_TYPES = [
  "Financial Planning",
  "Bookkeeping & Accounting",
  "Marketing & Social Media",
  "Business Strategy",
  "Legal & Compliance",
  "Tax & SARS",
  "Operations & Processes",
  "Digital Tools & Technology",
  "Human Resources",
  "Funding & Investment",
] as const;

export type SupportType = typeof SUPPORT_TYPES[number];

export type SupportRequest = {
  id: string;
  smeId: string;           // entrepreneur user id
  type: SupportType;
  title: string;
  description: string;
  documents: string[];     // file names (simulated)
  status: "open" | "matched" | "scheduled" | "completed" | "cancelled";
  createdAt: string;
  studentId: string | null;
  bookingId: string | null;
};

export type StudentProfile = {
  id: string;              // user id
  name: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  yearOfStudy: number;
  skills: SupportType[];
  bio: string;
  avatar: string;          // initials
  joinedAt: string;
  active: boolean;
  // stats
  requestsReceived: number;
  requestsAccepted: number;
  sessionsCompleted: number;
  avgRating: number;       // 0–5
  ratingCount: number;
};

export type RequestMatch = {
  id: string;
  requestId: string;
  studentId: string;
  status: "pending" | "accepted" | "declined";
  declineReason?: string;
  // if accepted
  timeSlots?: TimeSlot[];
  sessionMode?: "online" | "in-person" | "both";
  respondedAt?: string;
};

export type TimeSlot = {
  date: string;     // "2024-04-20"
  time: string;     // "14:00"
  label: string;    // "Sat 20 Apr at 14:00"
};

export type Booking = {
  id: string;
  requestId: string;
  studentId: string;
  smeId: string;
  confirmedSlot: TimeSlot;
  mode: "online" | "in-person";
  meetingLink?: string;    // auto-generated for online
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;
};

export type Rating = {
  id: string;
  bookingId: string;
  requestId: string;
  studentId: string;
  smeId: string;
  professionalism: number;   // 1–5
  communication: number;
  helpfulness: number;
  knowledge: number;
  overall: number;           // avg of above
  feedback: string;
  createdAt: string;
};

// ── Seed: Students ────────────────────────────────────────────────
export const students: StudentProfile[] = [
  {
    id: "s1", name: "Lebogang Mosia", email: "lebo.mosia@uj.ac.za",
    phone: "073 111 2233", institution: "University of Johannesburg",
    course: "BCom Accounting", yearOfStudy: 3,
    skills: ["Bookkeeping & Accounting", "Tax & SARS", "Financial Planning"],
    bio: "Final-year accounting student with a passion for helping small businesses manage their finances properly.",
    avatar: "LM", joinedAt: "2024-01-15", active: true,
    requestsReceived: 8, requestsAccepted: 6, sessionsCompleted: 5, avgRating: 4.6, ratingCount: 5,
  },
  {
    id: "s2", name: "Ayanda Khumalo", email: "ayanda.k@uj.ac.za",
    phone: "082 334 5566", institution: "University of Johannesburg",
    course: "BCom Marketing", yearOfStudy: 2,
    skills: ["Marketing & Social Media", "Business Strategy", "Digital Tools & Technology"],
    bio: "Marketing student specialising in digital strategy for township and informal economy businesses.",
    avatar: "AK", joinedAt: "2024-01-20", active: true,
    requestsReceived: 5, requestsAccepted: 4, sessionsCompleted: 3, avgRating: 4.3, ratingCount: 3,
  },
  {
    id: "s3", name: "Thandi Nkosi", email: "thandi.n@wits.ac.za",
    phone: "079 556 7788", institution: "University of the Witwatersrand",
    course: "BCom Law", yearOfStudy: 3,
    skills: ["Legal & Compliance", "Human Resources", "Business Strategy"],
    bio: "Law and commerce student focused on helping SMEs navigate compliance and HR challenges.",
    avatar: "TN", joinedAt: "2024-02-01", active: true,
    requestsReceived: 4, requestsAccepted: 3, sessionsCompleted: 2, avgRating: 4.8, ratingCount: 2,
  },
  {
    id: "s4", name: "Siphamandla Dube", email: "sipham.d@uj.ac.za",
    phone: "064 778 9900", institution: "University of Johannesburg",
    course: "BCom Finance", yearOfStudy: 4,
    skills: ["Financial Planning", "Funding & Investment", "Business Strategy", "Tax & SARS"],
    bio: "Honours finance student with internship experience at a development finance institution.",
    avatar: "SD", joinedAt: "2024-02-10", active: true,
    requestsReceived: 6, requestsAccepted: 5, sessionsCompleted: 4, avgRating: 4.5, ratingCount: 4,
  },
];

// ── Seed: Requests ────────────────────────────────────────────────
export const supportRequests: SupportRequest[] = [
  {
    id: "req1", smeId: "u1",
    type: "Bookkeeping & Accounting",
    title: "Set up basic bookkeeping system",
    description: "I need help setting up a simple bookkeeping system for my electrical business. Currently tracking everything in a notebook and need to move to something more organised.",
    documents: [],
    status: "completed",
    createdAt: "2024-03-10",
    studentId: "s1", bookingId: "bk1",
  },
  {
    id: "req2", smeId: "u1",
    type: "Marketing & Social Media",
    title: "Help with Facebook and Instagram presence",
    description: "I want to grow my business online. I have a Facebook page but don't know how to use it effectively to get more clients in Soweto.",
    documents: [],
    status: "scheduled",
    createdAt: "2024-04-05",
    studentId: "s2", bookingId: "bk2",
  },
  {
    id: "req3", smeId: "u2",
    type: "Financial Planning",
    title: "Cashflow planning for catering events",
    description: "My catering business gets paid after events but I have to buy ingredients upfront. Need help planning cash flow so I don't run short between jobs.",
    documents: [],
    status: "matched",
    createdAt: "2024-04-10",
    studentId: "s4", bookingId: null,
  },
  {
    id: "req4", smeId: "u2",
    type: "Tax & SARS",
    title: "Understanding my tax obligations",
    description: "I am not sure what taxes I need to pay as a small catering business. I need someone to explain SARS requirements for my business size.",
    documents: [],
    status: "open",
    createdAt: "2024-04-14",
    studentId: null, bookingId: null,
  },
];

// ── Seed: Matches ─────────────────────────────────────────────────
export const requestMatches: RequestMatch[] = [
  {
    id: "m1", requestId: "req1", studentId: "s1",
    status: "accepted",
    timeSlots: [
      { date: "2024-03-18", time: "10:00", label: "Mon 18 Mar at 10:00" },
      { date: "2024-03-19", time: "14:00", label: "Tue 19 Mar at 14:00" },
    ],
    sessionMode: "online",
    respondedAt: "2024-03-11",
  },
  {
    id: "m2", requestId: "req2", studentId: "s2",
    status: "accepted",
    timeSlots: [
      { date: "2024-04-12", time: "09:00", label: "Fri 12 Apr at 09:00" },
      { date: "2024-04-13", time: "11:00", label: "Sat 13 Apr at 11:00" },
    ],
    sessionMode: "both",
    respondedAt: "2024-04-06",
  },
  {
    id: "m3", requestId: "req3", studentId: "s4",
    status: "accepted",
    timeSlots: [
      { date: "2024-04-17", time: "13:00", label: "Wed 17 Apr at 13:00" },
      { date: "2024-04-18", time: "15:00", label: "Thu 18 Apr at 15:00" },
    ],
    sessionMode: "online",
    respondedAt: "2024-04-11",
  },
];

// ── Seed: Bookings ────────────────────────────────────────────────
export const bookings: Booking[] = [
  {
    id: "bk1", requestId: "req1", studentId: "s1", smeId: "u1",
    confirmedSlot: { date: "2024-03-18", time: "10:00", label: "Mon 18 Mar at 10:00" },
    mode: "online",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/fake-bk1",
    status: "completed",
    createdAt: "2024-03-12",
    completedAt: "2024-03-18",
  },
  {
    id: "bk2", requestId: "req2", studentId: "s2", smeId: "u1",
    confirmedSlot: { date: "2024-04-13", time: "11:00", label: "Sat 13 Apr at 11:00" },
    mode: "online",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/fake-bk2",
    status: "confirmed",
    createdAt: "2024-04-07",
  },
];

// ── Seed: Ratings ─────────────────────────────────────────────────
export const ratings: Rating[] = [
  {
    id: "r1", bookingId: "bk1", requestId: "req1",
    studentId: "s1", smeId: "u1",
    professionalism: 5, communication: 5, helpfulness: 4, knowledge: 5,
    overall: 4.75,
    feedback: "Lebogang was fantastic. She explained everything clearly and set up a simple spreadsheet system that I can actually use. Highly recommend.",
    createdAt: "2024-03-18",
  },
];

// ── Helpers ───────────────────────────────────────────────────────
export function getRequestsForSme(smeId: string): SupportRequest[] {
  return supportRequests.filter(r => r.smeId === smeId);
}

export function getRequestsForStudent(studentId: string): SupportRequest[] {
  const matchIds = requestMatches.filter(m => m.studentId === studentId).map(m => m.requestId);
  return supportRequests.filter(r => matchIds.includes(r.id));
}

export function getMatchForRequest(requestId: string): RequestMatch | undefined {
  return requestMatches.find(m => m.requestId === requestId);
}

export function getBookingForRequest(requestId: string): Booking | undefined {
  return bookings.find(b => b.requestId === requestId);
}

export function getRatingsForStudent(studentId: string): Rating[] {
  return ratings.filter(r => r.studentId === studentId);
}

export function matchStudentsToRequest(type: SupportType): StudentProfile[] {
  return students.filter(s => s.active && s.skills.includes(type));
}
