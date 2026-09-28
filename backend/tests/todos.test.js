const request = require('supertest');
const app = require('../src/app');
const { resetDevStore } = require('../src/models/devStore');

describe('Todos API Tests', () => {
  let token;

  beforeEach(async () => {
    resetDevStore();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alex@teenmoney.dev', password: 'password123' });
    token = res.body.data.token;
  });

  it('should create a new todo task', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Review Chemistry formulas',
        description: 'Periodic table and molar masses',
        priority: 'high',
        category: 'Education',
        due_date: '2026-10-01'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Review Chemistry formulas');
    expect(res.body.data.status).toBe('pending');
  });

  it('should update todo status to completed and set completed_at', async () => {
    const listRes = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    const pendingItem = listRes.body.data.find(t => t.status === 'pending');
    expect(pendingItem).toBeDefined();

    const patchRes = await request(app)
      .patch(`/api/todos/${pendingItem.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body.data.status).toBe('completed');
    expect(patchRes.body.data.completed_at).toBeDefined();
  });

  it('should filter todos by status', async () => {
    const res = await request(app)
      .get('/api/todos?status=completed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.every(t => t.status === 'completed')).toBe(true);
  });

  it('should delete a todo task', async () => {
    const listRes = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    const targetId = listRes.body.data[0].id;

    const delRes = await request(app)
      .delete(`/api/todos/${targetId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.statusCode).toBe(200);

    const checkRes = await request(app)
      .get(`/api/todos/${targetId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
