export const CATEGORIES = ['Ăn uống', 'Đi lại', 'Học tập', 'Giải trí'];

export const CATEGORY_MARKS = {
  'Ăn uống': 'Ă',
  'Đi lại': 'Đ',
  'Học tập': 'H',
  'Giải trí': 'G',
};

export const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function localDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function createSampleExpenses() {
  return [
    { id: 'a1', content: 'Cà phê và bánh mì', amount: 65000, category: 'Ăn uống', date: localDate() },
    { id: 'a2', content: 'Vé xe buýt tháng', amount: 120000, category: 'Đi lại', date: localDate() },
    { id: 'a3', content: 'Sách vở', amount: 185000, category: 'Học tập', date: localDate(-1) },
    { id: 'a4', content: 'Xem phim cuối tuần', amount: 95000, category: 'Giải trí', date: localDate(-2) },
  ];
}

export function totalOf(expenses) {
  return expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

export function filterExpenses(expenses, category, query) {
  return expenses.filter((expense) => {
    const matchesCategory = category === 'Tất cả' || expense.category === category;
    const matchesQuery = !query || `${expense.content} ${expense.category}`.toLocaleLowerCase('vi').includes(query);
    return matchesCategory && matchesQuery;
  });
}

export function formatDate(dateString) {
  if (!dateString) return 'Không rõ ngày';
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
