import React, { Component } from 'react';
import { ClockLabel, ExpenseDashboard } from '../src/shared/ExpenseComponents.jsx';
import { createSampleExpenses, filterExpenses, money, totalOf } from '../src/shared/expenseData.js';
import ExpenseFormClass from './ExpenseFormClass.jsx';

export default class ClassExpenseApp extends Component {
  constructor(props) {
    super(props);
    this.state = { expenses: createSampleExpenses(), category: 'Tất cả', now: new Date(), query: '', debouncedQuery: '' };
  }

  componentDidMount() {
    this.clockId = window.setInterval(() => this.setState({ now: new Date() }), 1000);
    this.updateTitle();
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.expenses !== this.state.expenses) this.updateTitle();
    if (previousState.query !== this.state.query) {
      window.clearTimeout(this.searchId);
      this.searchId = window.setTimeout(() => this.setState({ debouncedQuery: this.state.query.trim().toLocaleLowerCase('vi') }), 300);
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.clockId);
    window.clearTimeout(this.searchId);
    document.title = 'Sổ chi tiêu cá nhân';
  }

  updateTitle = () => {
    document.title = `${money.format(totalOf(this.state.expenses))} · Sổ chi tiêu`;
  };

  addExpense = (expense) => this.setState((current) => ({ expenses: [{ ...expense, id: `${Date.now()}` }, ...current.expenses] }));

  deleteExpense = (id) => this.setState((current) => ({ expenses: current.expenses.filter((expense) => String(expense.id) !== String(id)) }));

  render() {
    const { expenses, category, now, query, debouncedQuery } = this.state;
    const filteredExpenses = filterExpenses(expenses, category, debouncedQuery);
    return (
      <>
        <div className="clock-row"><span className="clock-caption">HÔM NAY</span><ClockLabel now={now} /></div>
        <ExpenseDashboard
          expenses={expenses}
          filteredExpenses={filteredExpenses}
          onAdd={this.addExpense}
          onDelete={this.deleteExpense}
          category={category}
          onCategoryChange={(nextCategory) => this.setState({ category: nextCategory })}
          query={query}
          onQueryChange={(nextQuery) => this.setState({ query: nextQuery })}
          FormComponent={ExpenseFormClass}
        />
      </>
    );
  }
}
