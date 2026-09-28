const financialInsightService = require('../src/services/financialInsightService');

describe('Financial Insight Service (Money Coach Engine) Unit Tests', () => {
  it('should return insufficient_data insight when fewer than 3 expenses exist', () => {
    const insights = financialInsightService.generateInsights({
      expenses: [
        { amount: 100, category: 'Food' },
        { amount: 50, category: 'Transport' }
      ],
      income: [{ amount: 1000 }],
      budgets: [],
      savingsGoals: []
    });

    expect(insights.length).toBe(1);
    expect(insights[0].type).toBe('insufficient_data');
    expect(insights[0].message).toMatch(/keep tracking/i);
  });

  it('should trigger budget_warning when category spending is >= 80% and <= 100%', () => {
    const insights = financialInsightService.generateInsights({
      expenses: [
        { amount: 450, category: 'Gaming' },
        { amount: 100, category: 'Food' },
        { amount: 50, category: 'Transport' }
      ],
      income: [{ amount: 2000 }],
      budgets: [{ id: 'b1', category: 'Gaming', amount: 500 }],
      savingsGoals: []
    });

    const warning = insights.find(i => i.type === 'budget_warning');
    expect(warning).toBeDefined();
    expect(warning.title).toMatch(/Gaming budget alert/i);
    expect(warning.message).toMatch(/90%/i);
  });

  it('should trigger budget_exceeded when category spending exceeds budget', () => {
    const insights = financialInsightService.generateInsights({
      expenses: [
        { amount: 650, category: 'Entertainment' },
        { amount: 100, category: 'Food' },
        { amount: 50, category: 'Transport' }
      ],
      income: [{ amount: 2000 }],
      budgets: [{ id: 'b2', category: 'Entertainment', amount: 500 }],
      savingsGoals: []
    });

    const exceeded = insights.find(i => i.type === 'budget_exceeded');
    expect(exceeded).toBeDefined();
    expect(exceeded.severity).toBe('high');
    expect(exceeded.message).toMatch(/150/); // 650 - 500 = 150 over
  });

  it('should trigger high_category_spending when single category is > 25% of total', () => {
    const insights = financialInsightService.generateInsights({
      expenses: [
        { amount: 1200, category: 'Shopping' },
        { amount: 200, category: 'Food' },
        { amount: 100, category: 'Transport' }
      ],
      income: [{ amount: 3000 }],
      budgets: [],
      savingsGoals: []
    });

    const highCat = insights.find(i => i.type === 'high_category_spending');
    expect(highCat).toBeDefined();
    expect(highCat.title).toMatch(/High Shopping spending/i);
  });

  it('should trigger saving_progress for active savings goals', () => {
    const insights = financialInsightService.generateInsights({
      expenses: [
        { amount: 100, category: 'Food' },
        { amount: 100, category: 'Food' },
        { amount: 100, category: 'Food' }
      ],
      income: [{ amount: 2000 }],
      budgets: [],
      savingsGoals: [
        { id: 'g1', name: 'New Skateboard', target_amount: 3000, current_amount: 1500 }
      ]
    });

    const goalInsight = insights.find(i => i.type === 'saving_progress');
    expect(goalInsight).toBeDefined();
    expect(goalInsight.title).toMatch(/New Skateboard/i);
    expect(goalInsight.message).toMatch(/1,500 away/i);
  });
});
