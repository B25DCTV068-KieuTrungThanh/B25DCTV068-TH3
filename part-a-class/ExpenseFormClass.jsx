import React, { Component } from 'react';
import { CATEGORIES, localDate } from '../src/shared/expenseData.js';

export default class ExpenseFormClass extends Component {
  constructor(props) {
    super(props);
    this.state = { content: '', amount: '', category: CATEGORIES[0], date: localDate(), error: '' };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const content = this.state.content.trim();
    const amount = Number(this.state.amount);
    if (!content || !Number.isFinite(amount) || amount <= 0 || !this.state.date) {
      this.setState({ error: 'Vui lòng nhập nội dung, số tiền hợp lệ và ngày chi.' });
      return;
    }
    this.props.onAdd({ content, amount, category: this.state.category, date: this.state.date });
    this.setState({ content: '', amount: '', category: CATEGORIES[0], date: localDate(), error: '' });
  };

  render() {
    return (
      <form className="expense-form" onSubmit={this.handleSubmit} noValidate>
        <div className="field field-wide">
          <label htmlFor="class-content">Nội dung</label>
          <input id="class-content" value={this.state.content} onChange={(event) => this.setState({ content: event.target.value, error: '' })} placeholder="Ví dụ: Ăn trưa cùng đồng nghiệp" maxLength={80} />
        </div>
        <div className="field">
          <label htmlFor="class-amount">Số tiền</label>
          <div className="amount-input"><input id="class-amount" type="number" min="1" step="1000" value={this.state.amount} onChange={(event) => this.setState({ amount: event.target.value, error: '' })} placeholder="0" /><span>₫</span></div>
        </div>
        <div className="field">
          <label htmlFor="class-category">Loại chi</label>
          <select id="class-category" value={this.state.category} onChange={(event) => this.setState({ category: event.target.value })}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="class-date">Ngày chi</label>
          <input id="class-date" type="date" value={this.state.date} onChange={(event) => this.setState({ date: event.target.value, error: '' })} />
        </div>
        <button className="button button-primary add-button" type="submit"><span aria-hidden="true">＋</span> Thêm khoản chi</button>
        {this.state.error && <p className="form-error" role="alert">{this.state.error}</p>}
      </form>
    );
  }
}
