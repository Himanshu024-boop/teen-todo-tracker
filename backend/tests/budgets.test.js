const request = require('supertest');
const app = require('../src/app');
const { resetDevStore } = require('../src/models/devStore');

describe('Budgets API Tests', () => {
  let token;

  beforeEach(async () => {
    resetDevStore();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alex@teenmoney.dev', password: 'password123' });
    token = res.body.data.token;
  });

  it('should create a new category budget', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'Sports',
        amount: 1500,
        period: 'monthly'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.category).toBe('Sports');
    expect(res.body.data.amount).toBe(1500);
  });

  it('should reject duplicate budget for the same category and period', async () => {
    // Seeded data already has monthly 'Food' budget
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'Food',
        amount: 2500,
        period: 'monthly'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should calculate spentAmount, remainingAmount, and percentage on budgets list', async () => {
    const res = await request(app)
      .get('/api/budgets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const foodBudget = res.body.data.find(b => b.category === 'Food');
    expect(foodBudget).toBeDefined();
    expect(typeof foodBudget.spentAmount).toBe('number');
    expect(typeof foodBudget.remainingAmount).toBe('number');
    expect(typeof foodBudget.percentage).toBe('number');
  });
});
