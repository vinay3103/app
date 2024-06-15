document.addEventListener('DOMContentLoaded', () => {
  const expenseListContainer = document.getElementById('expense-list-container');
  const totalExpenditures = document.getElementById('total-expenditures');
  const remainingBudget = document.getElementById('remaining-budget');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const backBtn = document.getElementById('back-btn2');
  const changeBudgetBtn = document.getElementById('change-budget-btn');
  const deleteBudgetBtn = document.getElementById('delete-budget-btn');
  const loadExpensesBtn = document.getElementById('load-expenses-btn');
  const monthSelector = document.getElementById('month-selector');

  let expenseData = JSON.parse(localStorage.getItem('expenseData')) || {};
  let monthlyBudgets = JSON.parse(localStorage.getItem('monthlyBudgets')) || {};

  function renderExpenseList(month) {
    expenseListContainer.innerHTML = '';
    let total = 0;
    let dailyExpenses = {};

    if (!expenseData[month]) {
      expenseData[month] = [];
    }

    if (!monthlyBudgets[month]) {
      monthlyBudgets[month] = 0;
    }

    // Group expenses by date
    expenseData[month].forEach(expense => {
      total += expense.amount;
      if (!dailyExpenses[expense.date]) {
        dailyExpenses[expense.date] = [];
      }
      dailyExpenses[expense.date].push(expense);
    });

    totalExpenditures.textContent = total.toFixed(2);
    remainingBudget.textContent = (monthlyBudgets[month] - total).toFixed(2);

    // Render daily expenses
    for (let date in dailyExpenses) {
      const dayContainer = document.createElement('div');
      dayContainer.classList.add('day-container');
      
      const dateHeader = document.createElement('h3');
      dateHeader.textContent = date;
      
      const dailyTotal = dailyExpenses[date].reduce((sum, expense) => sum + expense.amount, 0);
      const dailyTotalElement = document.createElement('p');
      dailyTotalElement.textContent = `Total: $${dailyTotal.toFixed(2)}`;
      dailyTotalElement.classList.add('daily-total');
      
      const expenseList = document.createElement('ul');
      expenseList.classList.add('expense-list');
      
      dailyExpenses[date].forEach((expense, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${expense.name}: $${expense.amount.toFixed(2)}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
          deleteExpenseItem(index, date, month);
        });
        
        listItem.appendChild(deleteBtn);
        expenseList.appendChild(listItem);
      });

      dayContainer.appendChild(dateHeader);
      dayContainer.appendChild(dailyTotalElement);
      dayContainer.appendChild(expenseList);
      expenseListContainer.appendChild(dayContainer);
    }
  }

  function deleteExpenseItem(index, date, month) {
    expenseData[month] = expenseData[month].filter((expense, i) => !(expense.date === date && i === index));
    localStorage.setItem('expenseData', JSON.stringify(expenseData));
    renderExpenseList(month);
  }

  clearAllBtn.addEventListener('click', () => {
    const selectedMonth = monthSelector.value || new Date().toISOString().slice(0, 7);
    expenseData[selectedMonth] = [];
    localStorage.setItem('expenseData', JSON.stringify(expenseData));
    renderExpenseList(selectedMonth);
  });

  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  changeBudgetBtn.addEventListener('click', () => {
    const selectedMonth = monthSelector.value || new Date().toISOString().slice(0, 7);
    const newBudget = parseFloat(prompt('Enter new monthly budget:'));
    if (!isNaN(newBudget)) {
      monthlyBudgets[selectedMonth] = newBudget;
      localStorage.setItem('monthlyBudgets', JSON.stringify(monthlyBudgets));
      renderExpenseList(selectedMonth);
    }
  });

  deleteBudgetBtn.addEventListener('click', () => {
    const selectedMonth = monthSelector.value || new Date().toISOString().slice(0, 7);
    delete monthlyBudgets[selectedMonth];
    localStorage.setItem('monthlyBudgets', JSON.stringify(monthlyBudgets));
    renderExpenseList(selectedMonth);
  });

  loadExpensesBtn.addEventListener('click', () => {
    const selectedMonth = monthSelector.value || new Date().toISOString().slice(0, 7);
    renderExpenseList(selectedMonth);
  });

  const initialMonth = new Date().toISOString().slice(0, 7);
  monthSelector.value = initialMonth;
  renderExpenseList(initialMonth);
});
