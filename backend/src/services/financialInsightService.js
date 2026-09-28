/**
 * Financial Insight Service (Money Coach Rule Engine)
 * Analyzes teenager's financial data deterministically and produces actionable,
 * supportive, and age-appropriate financial guidance.
 */

const financialInsightService = {
  generateInsights({ income = [], expenses = [], budgets = [], savingsGoals = [] }) {
    const insights = [];

    // Helper: parse numbers safely
    const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

    const totalIncome = income.reduce((acc, i) => acc + num(i.amount), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + num(e.amount), 0);

    // Rule 1: Insufficient Data Check
    if (expenses.length < 3) {
      insights.push({
        id: 'insufficient-data',
        type: 'insufficient_data',
        title: 'Start Tracking To Unlock Insights',
        message: 'Keep tracking your expenses and we will generate personalized financial tips right here.',
        severity: 'info',
        actionPrompt: 'Add your latest expense above to build your spending profile.'
      });
      return insights;
    }

    // Category Spending Aggregation
    const categoryTotals = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + num(e.amount);
    });

    // Rule 2 & 3: Budget Warnings & Exceeded
    budgets.forEach(budget => {
      const cat = budget.category;
      const spent = categoryTotals[cat] || 0;
      const budgetAmount = num(budget.amount);

      if (budgetAmount <= 0) return;

      const pct = Math.round((spent / budgetAmount) * 100);

      if (spent > budgetAmount) {
        const overspent = Math.round(spent - budgetAmount);
        insights.push({
          id: `budget-exceeded-${budget.id || cat}`,
          type: 'budget_exceeded',
          title: `${cat} budget exceeded`,
          message: `You've gone over your ${cat} budget this period by ₹${overspent.toLocaleString('en-IN')}.`,
          severity: 'high',
          actionPrompt: 'Review non-essential purchases in this category.'
        });
      } else if (pct >= 80) {
        insights.push({
          id: `budget-warning-${budget.id || cat}`,
          type: 'budget_warning',
          title: `${cat} budget alert`,
          message: `You've used ${pct}% of your ${cat} budget (₹${spent.toLocaleString('en-IN')} of ₹${budgetAmount.toLocaleString('en-IN')}).`,
          severity: 'medium',
          actionPrompt: 'Pace your remaining spending for this period.'
        });
      }
    });

    // Rule 4: High Category Spending (> 25% of total expenses)
    if (totalExpenses > 0) {
      Object.entries(categoryTotals).forEach(([cat, spent]) => {
        const pct = Math.round((spent / totalExpenses) * 100);
        // If higher than 25% and at least ₹200
        if (pct >= 25 && spent >= 200) {
          const hasBudget = budgets.some(b => b.category.toLowerCase() === cat.toLowerCase());
          insights.push({
            id: `high-category-${cat.toLowerCase()}`,
            type: 'high_category_spending',
            title: `High ${cat} spending`,
            message: `You spent ₹${spent.toLocaleString('en-IN')} on ${cat} this period (${pct}% of your total spending).${
              !hasBudget ? ` Consider setting a ${cat} budget to keep it balanced.` : ''
            }`,
            severity: 'medium',
            actionPrompt: !hasBudget ? `Set a ${cat} budget` : 'Keep an eye on everyday spending in this category'
          });
        }
      });
    }

    // Rule 5: Frequent Small Purchases (< ₹200 each)
    const smallPurchases = expenses.filter(e => num(e.amount) <= 200);
    if (smallPurchases.length >= 4) {
      const smallTotal = smallPurchases.reduce((acc, e) => acc + num(e.amount), 0);
      insights.push({
        id: 'frequent-small-expenses',
        type: 'frequent_small_expenses',
        title: 'Micro-purchases add up',
        message: `You made ${smallPurchases.length} small purchases totaling ₹${smallTotal.toLocaleString('en-IN')}. Try reviewing them together to see where your money is going.`,
        severity: 'info',
        actionPrompt: 'Even ₹50-₹100 treats can add up to a big goal!'
      });
    }

    // Rule 6: Savings Goals Progress
    savingsGoals.forEach(goal => {
      const target = num(goal.target_amount);
      const current = num(goal.current_amount);
      const remaining = target - current;

      if (target <= 0) return;

      if (remaining <= 0) {
        insights.push({
          id: `goal-achieved-${goal.id}`,
          type: 'saving_progress',
          title: `Goal achieved: ${goal.name} 🎉`,
          message: `Awesome achievement! You hit your ₹${target.toLocaleString('en-IN')} target for "${goal.name}".`,
          severity: 'success',
          actionPrompt: 'Celebrate your financial milestone and set your next dream goal!'
        });
      } else {
        // Suggest a weekly saving amount
        const weeklyPace = Math.ceil(remaining / 4); // 4-week pace suggestion
        const suggestedWeeks = Math.ceil(remaining / Math.max(100, Math.min(250, weeklyPace)));
        insights.push({
          id: `goal-progress-${goal.id}`,
          type: 'saving_progress',
          title: `Goal: ${goal.name}`,
          message: `You are ₹${remaining.toLocaleString('en-IN')} away from your savings goal. If you save ₹${Math.min(250, weeklyPace).toLocaleString('en-IN')} per week, you could reach it in approximately ${suggestedWeeks} weeks!`,
          severity: 'info',
          actionPrompt: 'Putting aside small change each week makes big dreams come true.'
        });
      }
    });

    // Rule 7: Positive Saving Habit
    if (totalIncome > 0) {
      const savingsRate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100);
      if (savingsRate >= 20 && totalIncome > totalExpenses) {
        insights.push({
          id: 'positive-saving-habit',
          type: 'positive_saving_habit',
          title: 'Great saving habit! 🌟',
          message: `Nice work — you're keeping ${savingsRate}% of your income aside. Consistency is your superpower!`,
          severity: 'success',
          actionPrompt: 'Keep allocating a portion to your savings goals.'
        });
      } else if (totalExpenses > totalIncome) {
        // Rule 8: Income vs Expense Difference (Deficit)
        const deficit = totalExpenses - totalIncome;
        insights.push({
          id: 'income-expense-deficit',
          type: 'income_expense_difference',
          title: 'Spending exceeds income',
          message: `Your total spending (₹${totalExpenses.toLocaleString('en-IN')}) is ₹${deficit.toLocaleString('en-IN')} higher than your recorded income (₹${totalIncome.toLocaleString('en-IN')}).`,
          severity: 'high',
          actionPrompt: 'Prioritize needs over wants until your next allowance or income.'
        });
      }
    }

    return insights;
  }
};

module.exports = financialInsightService;
