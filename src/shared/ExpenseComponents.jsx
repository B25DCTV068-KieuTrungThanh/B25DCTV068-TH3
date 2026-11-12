import React from 'react';
import { CATEGORIES, CATEGORY_MARKS, formatDate, money, totalOf } from './expenseData.js';

const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: 'long' });
const TIME_FORMATTER = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function ClockLabel({ now }) {
  return (
    <div className="clock-label" aria-live="off">
      <span className="clock-dot" />
      <span>{DATE_FORMATTER.format(now)}</span>
      <strong>{TIME_FORMATTER.format(now)}</strong>
    </div>
  );
}

function FilterButtons({ value, onChange }) {
  return (
    <div className="filter-list" role="group" aria-label="Lọc theo loại chi">
      {['Tất cả', ...CATEGORIES].map((category) => (
        <button key={category} type="button" className={`filter-button ${value === category ? 'is-active' : ''}`} onClick={() => onChange(category)} aria-pressed={value === category}>
          {category !== 'Tất cả' && <span className={`category-mark mark-${CATEGORIES.indexOf(category)}`} aria-hidden="true">{CATEGORY_MARKS[category]}</span>}{category}
        </button>
      ))}
    </div>
  );
}

function CategoryStats({ expenses }) {
  const total = totalOf(expenses);
  return (
    <section className="stats-strip" aria-label="Tổng chi theo loại">
      {CATEGORIES.map((category, index) => {
        const amount = totalOf(expenses.filter((expense) => expense.category === category));
        const percent = total ? Math.round((amount / total) * 100) : 0;
        return (
          <div className="stat-item" key={category}>
            <div className="stat-topline"><span className={`category-mark mark-${index}`} aria-hidden="true">{CATEGORY_MARKS[category]}</span><span>{category}</span></div>
            <strong>{money.format(amount)}</strong>
            <div className="stat-meter" aria-label={`${percent}%`}><span className={`meter-${index}`} style={{ width: `${percent}%` }} /></div>
          </div>
        );
      })}
    </section>
  );
}

function ExpenseList({ expenses, onDelete }) {
  if (!expenses.length) {
    return <div className="empty-state"><span className="empty-mark" aria-hidden="true">—</span><strong>Chưa có khoản chi nào</strong><span>Thử đổi bộ lọc hoặc thêm một khoản mới.</span></div>;
  }
  return (
    <div className="expense-list">
      {expenses.map((expense, index) => {
        const categoryIndex = CATEGORIES.indexOf(expense.category);
        return (
          <article className="expense-row" key={expense.id} style={{ '--row-index': index }}>
            <span className={`category-mark expense-mark mark-${categoryIndex}`} aria-hidden="true">{CATEGORY_MARKS[expense.category] || '•'}</span>
            <div className="expense-description"><strong>{expense.content}</strong><span>{expense.category}<i>·</i>{formatDate(expense.date)}</span></div>
            <strong className="expense-amount">−{money.format(Number(expense.amount) || 0)}</strong>
            <button className="icon-button delete-button" type="button" aria-label={`Xóa ${expense.content}`} title="Xóa khoản chi" onClick={() => {
              if (window.confirm(`Xóa khoản chi “${expense.content}”?`)) onDelete(expense.id);
            }}><span aria-hidden="true">×</span></button>
          </article>
        );
      })}
    </div>
  );
}

export function ExpenseDashboard({ expenses, filteredExpenses, onAdd, onDelete, category, onCategoryChange, query, onQueryChange, FormComponent, inputRef, loading = false, error = '' }) {
  const total = totalOf(expenses);
  return (
    <>
      <div className="overview-row">
        <div className="overview-copy"><span className="eyebrow">BẢNG ĐIỀU KHIỂN</span><h1>Chi tiêu <em>có ý thức.</em></h1><p>Mỗi khoản nhỏ, một bức tranh rõ ràng hơn.</p></div>
        <div className="total-card"><span>TỔNG CHI ĐÃ GHI</span><strong>{money.format(total)}</strong><small>{expenses.length} khoản chi</small><span className="total-decoration" aria-hidden="true">↗</span></div>
      </div>
      <section className="panel form-panel">
        <div className="section-heading"><div><span className="section-index">01</span><h2>Ghi khoản chi mới</h2></div><span className="section-note">Các trường có dấu * là bắt buộc</span></div>
        <FormComponent onAdd={onAdd} {...(inputRef ? { inputRef } : {})} />
      </section>
      <CategoryStats expenses={expenses} />
      <section className="panel ledger-panel">
        <div className="ledger-heading">
          <div className="section-heading"><div><span className="section-index">02</span><h2>Sổ giao dịch</h2></div><span className="entry-count">{filteredExpenses.length} khoản</span></div>
          <label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Tìm khoản chi..." aria-label="Tìm khoản chi" /></label>
        </div>
        <FilterButtons value={category} onChange={onCategoryChange} />
        {error && <div className="notice notice-error" role="alert"><span aria-hidden="true">!</span>{error}</div>}
        {loading ? <div className="loading-state"><span className="spinner" />Đang tải sổ chi tiêu...</div> : <ExpenseList expenses={filteredExpenses} onDelete={onDelete} />}
        <div className="ledger-total"><span>Tổng đang hiển thị</span><strong>{money.format(totalOf(filteredExpenses))}</strong></div>
      </section>
      <footer className="page-footer"><span>SỔ CHI TIÊU CÁ NHÂN</span><span>Ghi lại hôm nay, an tâm ngày mai.</span></footer>
    </>
  );
}
