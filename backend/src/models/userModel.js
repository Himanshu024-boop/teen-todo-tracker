const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { getDevStore } = require('./devStore');

const userModel = {
  async findByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    const store = getDevStore();
    return store.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findById(id, includePassword = false) {
    if (supabase) {
      const selectFields = includePassword
        ? '*'
        : 'id, name, email, avatar_url, created_at, updated_at';
      const { data, error } = await supabase
        .from('users')
        .select(selectFields)
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    const store = getDevStore();
    const user = store.users.find(u => u.id === id);
    if (!user) return null;
    if (includePassword) return { ...user };
    const { password_hash, ...safeUser } = user;
    return safeUser;
  },

  async create({ name, email, password_hash, avatar_url = null }) {
    const cleanEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();
    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: cleanEmail,
      password_hash,
      avatar_url: avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select('id, name, email, avatar_url, created_at, updated_at')
        .single();
      if (error) throw error;
      return data;
    }

    const store = getDevStore();
    store.users.push(newUser);
    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  },

  async update(id, updates) {
    const now = new Date().toISOString();
    const safeUpdates = { ...updates, updated_at: now };

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .update(safeUpdates)
        .eq('id', id)
        .select('id, name, email, avatar_url, created_at, updated_at')
        .single();
      if (error) throw error;
      return data;
    }

    const store = getDevStore();
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    store.users[index] = { ...store.users[index], ...safeUpdates };
    const { password_hash, ...safeUser } = store.users[index];
    return safeUser;
  },

  async delete(id) {
    if (supabase) {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const store = getDevStore();
    const initialLen = store.users.length;
    store.users = store.users.filter(u => u.id !== id);
    // Cascade delete in devStore
    store.todos = store.todos.filter(t => t.user_id !== id);
    store.expenses = store.expenses.filter(e => e.user_id !== id);
    store.income = store.income.filter(i => i.user_id !== id);
    store.budgets = store.budgets.filter(b => b.user_id !== id);
    store.savings_goals = store.savings_goals.filter(s => s.user_id !== id);
    return store.users.length < initialLen;
  }
};

module.exports = userModel;
