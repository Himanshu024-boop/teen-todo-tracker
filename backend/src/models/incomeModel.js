const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { getDevStore } = require('./devStore');

const incomeModel = {
  async find(userId, options = {}) {
    const { startDate, endDate, sortBy = 'income_date', sortOrder = 'desc' } = options;

    if (supabase) {
      let query = supabase
        .from('income')
        .select('*')
        .eq('user_id', userId);

      if (startDate) query = query.gte('income_date', startDate);
      if (endDate) query = query.lte('income_date', endDate);

      const ascending = sortOrder.toLowerCase() === 'asc';
      query = query.order(sortBy, { ascending });

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(i => ({ ...i, amount: Number(i.amount) }));
    }

    const store = getDevStore();
    let list = store.income.filter(i => i.user_id === userId);

    if (startDate) list = list.filter(i => i.income_date >= startDate);
    if (endDate) list = list.filter(i => i.income_date <= endDate);

    const ascending = sortOrder.toLowerCase() === 'asc';
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      }
      if (valA === valB) return 0;
      if (valA < valB) return ascending ? -1 : 1;
      return ascending ? 1 : -1;
    });

    return list.map(i => ({ ...i, amount: Number(i.amount) }));
  },

  async getAllForUser(userId) {
    return this.find(userId);
  },

  async findById(id, userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data ? { ...data, amount: Number(data.amount) } : null;
    }

    const store = getDevStore();
    const item = store.income.find(i => i.id === id && i.user_id === userId);
    return item ? { ...item, amount: Number(item.amount) } : null;
  },

  async create({ user_id, amount, source, description = '', income_date }) {
    const now = new Date().toISOString();
    const newIncome = {
      id: uuidv4(),
      user_id,
      amount: Number(amount),
      source: source.trim(),
      description: description ? description.trim() : '',
      income_date: income_date || new Date().toISOString().split('T')[0],
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('income')
        .insert([newIncome])
        .select()
        .single();
      if (error) throw error;
      return { ...data, amount: Number(data.amount) };
    }

    const store = getDevStore();
    store.income.unshift(newIncome);
    return { ...newIncome };
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
        .from('income')
        .update(safeUpdates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return { ...data, amount: Number(data.amount) };
    }

    const store = getDevStore();
    const index = store.income.findIndex(i => i.id === id && i.user_id === userId);
    if (index === -1) return null;

    store.income[index] = { ...store.income[index], ...safeUpdates };
    return { ...store.income[index], amount: Number(store.income[index].amount) };
  },

  async delete(id, userId) {
    if (supabase) {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }

    const store = getDevStore();
    const initialLen = store.income.length;
    store.income = store.income.filter(i => !(i.id === id && i.user_id === userId));
    return store.income.length < initialLen;
  }
};

module.exports = incomeModel;
