document.getElementById('budget-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const selectedMonth = new Date().toISOString().slice(0, 7); // Get current year-month
  let monthlyBudgets = JSON.parse(localStorage.getItem('monthlyBudgets')) || {};

  if (monthlyBudgets[selectedMonth]) {
    alert('Monthly budget has already been set for this month.');
    return;
  }

  const monthlyBudget = parseFloat(document.getElementById('monthly-budget').value);
  monthlyBudgets[selectedMonth] = monthlyBudget;
  localStorage.setItem('monthlyBudgets', JSON.stringify(monthlyBudgets));

  document.getElementById('budget-form').reset();
});

document.getElementById('expense-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const itemName = document.getElementById('item-name').value;
  const itemAmount = parseFloat(document.getElementById('item-amount').value);
  const itemDate = new Date().toLocaleDateString(); // Get current date
  const selectedMonth = new Date().toISOString().slice(0, 7); // Get current year-month

  const expense = {
    name: itemName,
    amount: itemAmount,
    date: itemDate
  };

  let expenseData = JSON.parse(localStorage.getItem('expenseData')) || {};
  if (!expenseData[selectedMonth]) {
    expenseData[selectedMonth] = [];
  }
  expenseData[selectedMonth].push(expense);
  localStorage.setItem('expenseData', JSON.stringify(expenseData));

  document.getElementById('expense-form').reset();
});
