const request = require('supertest');
const app = require('../src/app');
const { resetDevStore } = require('../src/models/devStore');

describe('Expenses API Tests', () => {
  let tokenUser1;
  let tokenUser2;

  beforeEach(async () => {
    resetDevStore();

    // Login user 1 (Alex Rivera)
    const res1 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alex@teenmoney.dev', password: 'password123' });
    tokenUser1 = res1.body.data.token;

    // Register user 2 (Sam Taylor)
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Sam Taylor', email: 'sam@teenmoney.dev', password: 'password123' });
    tokenUser2 = res2.body.data.token;
  });

  it('should create an expense for authenticated user', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        title: 'Science Project Board',
        amount: 320,
        category: 'Education',
        payment_method: 'UPI',
        is_necessary: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Science Project Board');
    expect(res.body.data.amount).toBe(320);
    expect(res.body.data.id).toBeDefined();
  });

  it('should reject expense creation with invalid amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        title: 'Zero cost test',
        amount: -10,
        category: 'Food',
        payment_method: 'Cash'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should list paginated expenses for user', async () => {
    const res = await request(app)
      .get('/api/expenses?page=1&limit=5')
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(5);
  });

  it('should read a single expense by id', async () => {
    const listRes = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${tokenUser1}`);

    const firstId = listRes.body.data[0].id;

    const res = await request(app)
      .get(`/api/expenses/${firstId}`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(firstId);
  });

  it('should update an existing expense', async () => {
    const listRes = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${tokenUser1}`);

    const firstId = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/expenses/${firstId}`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        title: 'Updated Expense Title',
        amount: 450,
        category: 'Food',
        payment_method: 'Card'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Expense Title');
    expect(res.body.data.amount).toBe(450);
  });

  it('should delete an expense', async () => {
    const listRes = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${tokenUser1}`);

    const firstId = listRes.body.data[0].id;

    const res = await request(app)
      .delete(`/api/expenses/${firstId}`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone
    const getRes = await request(app)
      .get(`/api/expenses/${firstId}`)
      .set('Authorization', `Bearer ${tokenUser1}`);
    expect(getRes.statusCode).toBe(404);
  });

  it('should PREVENT access to another user expense (Authorization Isolation)', async () => {
    // User 1 has seeded expenses
    const listRes = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${tokenUser1}`);

    const user1ExpenseId = listRes.body.data[0].id;

    // User 2 tries to access User 1 expense
    const res = await request(app)
      .get(`/api/expenses/${user1ExpenseId}`)
      .set('Authorization', `Bearer ${tokenUser2}`);

    expect(res.statusCode).toBe(404); // Kept isolated and not visible to user 2
  });
});
