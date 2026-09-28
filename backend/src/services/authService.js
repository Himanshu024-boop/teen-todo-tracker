const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const config = require('../config/env');

const authService = {
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  },

  async register({ name, email, password }) {
    const existing = await userModel.findByEmail(email);
    if (existing) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
      name,
      email,
      password_hash
    });

    const token = this.generateToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const { password_hash: _, ...safeUser } = user;
    const token = this.generateToken(safeUser);
    return { user: safeUser, token };
  },

  async getProfile(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  async updateProfile(userId, { name, avatar_url, currentPassword, newPassword }) {
    const userWithPassword = await userModel.findById(userId, true);
    if (!userWithPassword) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (name && name.trim()) {
      updates.name = name.trim();
    }
    if (avatar_url !== undefined) {
      updates.avatar_url = avatar_url;
    }

    if (newPassword) {
      if (!currentPassword) {
        const error = new Error('Current password is required to set a new password.');
        error.statusCode = 400;
        throw error;
      }
      const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password_hash);
      if (!isMatch) {
        const error = new Error('Current password is incorrect.');
        error.statusCode = 400;
        throw error;
      }
      if (newPassword.length < 6) {
        const error = new Error('New password must be at least 6 characters.');
        error.statusCode = 400;
        throw error;
      }
      updates.password_hash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await userModel.update(userId, updates);
    return updated;
  },

  async deleteAccount(userId) {
    return userModel.delete(userId);
  }
};

module.exports = authService;
