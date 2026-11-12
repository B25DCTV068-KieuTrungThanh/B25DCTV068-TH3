import React, { useContext, useEffect, useRef, useState } from 'react';
import { ClockLabel, ExpenseDashboard } from '../src/shared/ExpenseComponents.jsx';
import ThemeContext from '../src/shared/ThemeContext.js';
import { filterExpenses, money, totalOf } from '../src/shared/expenseData.js';
import ExpenseForm from './ExpenseForm.jsx';
import useClock from './useClock.js';
import useFetch from './useFetch.js';

const MOCKAPI_URL = import.meta.env.VITE_MOCKAPI_URL?.trim() || '';

export default function FunctionExpenseApp() {
  const { theme } = useContext(ThemeContext);
  const now = useClock();
  const { expenses, loading, error, addExpense, deleteExpense } = useFetch(MOCKAPI_URL);
  const [category, setCategory] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef(null);
  const total = totalOf(expenses);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query.trim().toLocaleLowerCase('vi')), 300);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    document.title = `${money.format(total)} · Sổ chi tiêu`;
    return () => { document.title = 'Sổ chi tiêu cá nhân'; };
  }, [total]);

  const filteredExpenses = filterExpenses(expenses, category, debouncedQuery);
  return (
    <div className="part-app" data-theme={theme}>
      <div className="clock-row"><span className="clock-caption">HÔM NAY</span><ClockLabel now={now} /></div>
      <ExpenseDashboard
        expenses={expenses}
        filteredExpenses={filteredExpenses}
        onAdd={addExpense}
        onDelete={deleteExpense}
        category={category}
        onCategoryChange={setCategory}
        query={query}
        onQueryChange={setQuery}
        FormComponent={ExpenseForm}
        inputRef={inputRef}
        loading={loading}
        error={error}
      />
    </div>
  );
}
