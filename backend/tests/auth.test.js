const request = require('supertest');
const app = require('../src/app');
const { resetDevStore } = require('../src/models/devStore');

describe('Authentication API Tests', () => {
  beforeEach(() => {
    resetDevStore();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new teen user successfully and return JWT', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jordan Smith',
          email: 'jordan@teenmoney.dev',
          password: 'securepassword123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('jordan@teenmoney.dev');
      expect(res.body.data.user.password_hash).toBeUndefined(); // Password must NEVER be returned
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject registration with duplicate email (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alex Impostor',
          email: 'alex@teenmoney.dev', // already seeded
          password: 'password123'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should reject registration with short password (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jordan Smith',
          email: 'jordan2@teenmoney.dev',
          password: '123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login demo user successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex@teenmoney.dev',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Alex Rivera');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.password_hash).toBeUndefined();
    });

    it('should reject login with invalid password (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex@teenmoney.dev',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('should reject login with nonexistent email (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@teenmoney.dev',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return profile for authenticated user', async () => {
      // First login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@teenmoney.dev', password: 'password123' });

      const token = loginRes.body.data.token;

      const profileRes = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(profileRes.statusCode).toBe(200);
      expect(profileRes.body.data.email).toBe('alex@teenmoney.dev');
    });

    it('should reject request without token (401 Unauthorized)', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
