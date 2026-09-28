const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { getDevStore } = require('./devStore');

const budgetModel = {
  async find(userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(b => ({ ...b, amount: Number(b.amount) }));
    }

    const store = getDevStore();
    return store.budgets
      .filter(b => b.user_id === userId)
      .map(b => ({ ...b, amount: Number(b.amount) }));
  },

  async findById(id, userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data ? { ...data, amount: Number(data.amount) } : null;
    }

    const store = getDevStore();
    const item = store.budgets.find(b => b.id === id && b.user_id === userId);
    return item ? { ...item, amount: Number(item.amount) } : null;
  },

  async findByCategoryAndPeriod(userId, category, period = 'monthly') {
    if (supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .ilike('category', category)
        .eq('period', period)
        .maybeSingle();
      if (error) throw error;
      return data ? { ...data, amount: Number(data.amount) } : null;
    }

    const store = getDevStore();
    const item = store.budgets.find(
      b => b.user_id === userId &&
           b.category.toLowerCase() === category.toLowerCase() &&
           b.period === period
    );
    return item ? { ...item, amount: Number(item.amount) } : null;
  },

  async create({ user_id, category, amount, period = 'monthly', start_date = null, end_date = null }) {
    const now = new Date().toISOString();
    const newBudget = {
      id: uuidv4(),
      user_id,
      category: category.trim(),
      amount: Number(amount),
      period,
      start_date,
      end_date,
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .insert([newBudget])
        .select()
        .single();
      if (error) throw error;
      return { ...data, amount: Number(data.amount) };
    }

    const store = getDevStore();
    store.budgets.unshift(newBudget);
    return { ...newBudget };
  },

  async update(id, userId, updates) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const safeUpdates = { ...updates, updated_at: now };
    if (safeUpdates.amount !== undefined) {
      safeUpdates.amount = Number(safeUpdates.amount);
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .update(safeUpdates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return { ...data, amount: Number(data.amount) };
    }

    const store = getDevStore();
    const index = store.budgets.findIndex(b => b.id === id && b.user_id === userId);
    if (index === -1) return null;

    store.budgets[index] = { ...store.budgets[index], ...safeUpdates };
    return { ...store.budgets[index], amount: Number(store.budgets[index].amount) };
  },

  async delete(id, userId) {
    if (supabase) {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }

    const store = getDevStore();
    const initialLen = store.budgets.length;
    store.budgets = store.budgets.filter(b => !(b.id === id && b.user_id === userId));
    return store.budgets.length < initialLen;
  }
};

module.exports = budgetModel;
