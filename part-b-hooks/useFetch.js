import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'personal-expenses-v1';

async function readResponse(response) {
  if (!response.ok) throw new Error(`Máy chủ phản hồi ${response.status}. Vui lòng thử lại.`);
  if (response.status === 204) return null;
  return response.json();
}

export default function useFetch(endpoint) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    async function loadExpenses() {
      try {
        if (endpoint) {
          const response = await fetch(endpoint, { signal: controller.signal });
          const data = await readResponse(response);
          setExpenses(Array.isArray(data) ? data : []);
        } else {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          setExpenses(saved ? JSON.parse(saved) : []);
        }
      } catch (loadError) {
        if (loadError.name !== 'AbortError') setError(loadError.message || 'Không thể tải dữ liệu.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadExpenses();
    return () => controller.abort();
  }, [endpoint]);

  const addExpense = useCallback(async (expense) => {
    setError('');
    try {
      let savedExpense = expense;
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expense),
        });
        savedExpense = await readResponse(response);
      } else {
        savedExpense = { ...expense, id: `${Date.now()}-${Math.random()}` };
      }
      setExpenses((current) => {
        const next = [savedExpense, ...current];
        if (!endpoint) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return true;
    } catch (saveError) {
      setError(saveError.message || 'Không thể thêm khoản chi.');
      return false;
    }
  }, [endpoint]);

  const deleteExpense = useCallback(async (id) => {
    setError('');
    try {
      if (endpoint) {
        const response = await fetch(`${endpoint.replace(/\/$/, '')}/${id}`, { method: 'DELETE' });
        await readResponse(response);
      }
      setExpenses((current) => {
        const next = current.filter((expense) => String(expense.id) !== String(id));
        if (!endpoint) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return true;
    } catch (deleteError) {
      setError(deleteError.message || 'Không thể xóa khoản chi.');
      return false;
    }
  }, [endpoint]);

  return { expenses, loading, error, addExpense, deleteExpense };
}
