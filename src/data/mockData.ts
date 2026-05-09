export interface User {
  id: string;
  name: string;
  email: string;
  signupDate: string;
  status: "active" | "disabled" | "deleted";
}

export const mockUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", signupDate: "2025-01-15", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", signupDate: "2025-02-03", status: "active" },
  { id: "3", name: "Carol White", email: "carol@example.com", signupDate: "2025-02-20", status: "disabled" },
  { id: "4", name: "David Brown", email: "david@example.com", signupDate: "2025-03-01", status: "active" },
  { id: "5", name: "Eva Green", email: "eva@example.com", signupDate: "2025-03-15", status: "deleted" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", signupDate: "2025-04-02", status: "active" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", signupDate: "2025-04-18", status: "active" },
  { id: "8", name: "Henry Davis", email: "henry@example.com", signupDate: "2025-05-05", status: "disabled" },
  { id: "9", name: "Ivy Chen", email: "ivy@example.com", signupDate: "2025-05-22", status: "active" },
  { id: "10", name: "Jack Wilson", email: "jack@example.com", signupDate: "2025-06-10", status: "active" },
];

export const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 185 },
  { month: "Mar", users: 260 },
  { month: "Apr", users: 340 },
  { month: "May", users: 425 },
  { month: "Jun", users: 510 },
];

export const transactionsData = [
  { month: "Jan", transactions: 450 },
  { month: "Feb", transactions: 620 },
  { month: "Mar", transactions: 890 },
  { month: "Apr", transactions: 1050 },
  { month: "May", transactions: 1320 },
  { month: "Jun", transactions: 1580 },
];

export const categoryData = [
  { category: "Food", amount: 4200 },
  { category: "Transport", amount: 2800 },
  { category: "Shopping", amount: 3500 },
  { category: "Bills", amount: 5100 },
  { category: "Entertainment", amount: 1900 },
];

export const kpiData = {
  totalUsers: 510,
  totalTransactions: 5910,
  totalReceipts: 3240,
  totalRecurring: 872,
  totalBudgets: 1456,
};
