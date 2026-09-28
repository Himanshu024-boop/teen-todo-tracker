const expenseModel = require('../models/expenseModel');
const incomeModel = require('../models/incomeModel');

const analyticsService = {
  async getAnalytics(userId, query = {}) {
    const timeframe = query.timeframe || '30d'; // '7d', '30d', '90d', '6m', '1y', 'custom'

    // Determine start date
    const now = new Date();
    let startDate = new Date();

    if (timeframe === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (timeframe === '90d') {
      startDate.setDate(now.getDate() - 90);
    } else if (timeframe === '6m') {
      startDate.setMonth(now.getMonth() - 6);
    } else if (timeframe === '1y') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (timeframe === 'custom' && query.startDate) {
      startDate = new Date(query.startDate);
    } else {
      startDate.setDate(now.getDate() - 30);
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = (query.endDate && timeframe === 'custom')
      ? query.endDate
      : now.toISOString().split('T')[0];

    const [allExpenses, allIncome] = await Promise.all([
      expenseModel.getAllForUser(userId),
      incomeModel.getAllForUser(userId)
    ]);

    // Filter within timeframe
    const expenses = allExpenses.filter(e => e.expense_date >= startDateStr && e.expense_date <= endDateStr);
    const income = allIncome.filter(i => i.income_date >= startDateStr && i.income_date <= endDateStr);

    const totalSpending = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
    const totalIncome = income.reduce((acc, i) => acc + Number(i.amount), 0);

    // Number of days in range
    const diffTime = Math.abs(new Date(endDateStr) - new Date(startDateStr));
    const dayCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const avgDailySpending = Math.round((totalSpending / dayCount) * 100) / 100;
    const savingsRate = totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalSpending) / totalIncome) * 1000) / 10)
      : 0;

    // Largest expense
    let largestExpense = null;
    if (expenses.length > 0) {
      const sorted = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount));
      largestExpense = {
        title: sorted[0].title,
        amount: Number(sorted[0].amount),
        category: sorted[0].category,
        date: sorted[0].expense_date
      };
    }

    // Category Spending
    const categoryTotals = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
    });

    const categorySpending = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categorySpending.length > 0 ? categorySpending[0].category : 'None';

    // Daily Spending Trend (Line chart)
    const dailyMap = {};
    // Populate map with dates
    let cur = new Date(startDate);
    const end = new Date(endDateStr);
    while (cur <= end) {
      const dStr = cur.toISOString().split('T')[0];
      dailyMap[dStr] = { date: dStr, expenses: 0, income: 0, netSavings: 0 };
      cur.setDate(cur.getDate() + 1);
    }

    expenses.forEach(e => {
      if (dailyMap[e.expense_date]) {
        dailyMap[e.expense_date].expenses += Number(e.amount);
      }
    });

    income.forEach(i => {
      if (dailyMap[i.income_date]) {
        dailyMap[i.income_date].income += Number(i.amount);
      }
    });

    const dailyTrend = Object.values(dailyMap).map(d => ({
      ...d,
      netSavings: Math.max(0, d.income - d.expenses)
    }));

    // Needs vs Wants breakdown
    let needsTotal = 0;
    let wantsTotal = 0;
    expenses.forEach(e => {
      if (e.is_necessary) {
        needsTotal += Number(e.amount);
      } else {
        wantsTotal += Number(e.amount);
      }
    });

    const needsVsWants = [
      { name: 'Needs (Essentials)', amount: needsTotal, percentage: totalSpending > 0 ? Math.round((needsTotal / totalSpending) * 100) : 0 },
      { name: 'Wants (Lifestyle)', amount: wantsTotal, percentage: totalSpending > 0 ? Math.round((wantsTotal / totalSpending) * 100) : 0 }
    ];

    // Payment Methods breakdown
    const paymentMap = {};
    expenses.forEach(e => {
      const method = e.payment_method || 'Other';
      paymentMap[method] = (paymentMap[method] || 0) + Number(e.amount);
    });
    const paymentMethodBreakdown = Object.entries(paymentMap).map(([method, amount]) => ({
      method,
      amount,
      percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0
    }));

    return {
      timeframe,
      dateRange: { startDate: startDateStr, endDate: endDateStr },
      summary: {
        totalSpending,
        totalIncome,
        netBalance: totalIncome - totalSpending,
        avgDailySpending,
        savingsRate,
        largestExpense,
        topCategory
      },
      categorySpending,
      dailyTrend,
      needsVsWants,
      paymentMethodBreakdown
    };
  }
};

module.exports = analyticsService;
