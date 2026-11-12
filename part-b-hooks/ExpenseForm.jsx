import React, { useState } from 'react';
import { CATEGORIES, localDate } from '../src/shared/expenseData.js';

export default function ExpenseForm({ onAdd, inputRef }) {
  const [form, setForm] = useState({ content: '', amount: '', category: CATEGORIES[0], date: localDate() });
  const [error, setError] = useState('');
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const content = form.content.trim();
    const amount = Number(form.amount);
    if (!content || !Number.isFinite(amount) || amount <= 0 || !form.date) {
      setError('Vui lòng nhập nội dung, số tiền hợp lệ và ngày chi.');
      return;
    }
    if (await onAdd({ content, amount, category: form.category, date: form.date })) {
      setForm({ content: '', amount: '', category: CATEGORIES[0], date: localDate() });
      setError('');
      inputRef.current?.focus();
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="field field-wide">
        <label htmlFor="function-content">Nội dung</label>
        <input ref={inputRef} id="function-content" value={form.content} onChange={(event) => update('content', event.target.value)} placeholder="Ví dụ: Ăn trưa cùng đồng nghiệp" maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="function-amount">Số tiền</label>
        <div className="amount-input"><input id="function-amount" type="number" min="1" step="1000" value={form.amount} onChange={(event) => update('amount', event.target.value)} placeholder="0" /><span>₫</span></div>
      </div>
      <div className="field">
        <label htmlFor="function-category">Loại chi</label>
        <select id="function-category" value={form.category} onChange={(event) => update('category', event.target.value)}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
      </div>
      <div className="field">
        <label htmlFor="function-date">Ngày chi</label>
        <input id="function-date" type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
      </div>
      <button className="button button-primary add-button" type="submit"><span aria-hidden="true">＋</span> Thêm khoản chi</button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
