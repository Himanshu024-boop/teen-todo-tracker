const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { getDevStore } = require('./devStore');

const savingsModel = {
  async find(userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(s => ({
        ...s,
        target_amount: Number(s.target_amount),
        current_amount: Number(s.current_amount)
      }));
    }

    const store = getDevStore();
    return store.savings_goals
      .filter(s => s.user_id === userId)
      .map(s => ({
        ...s,
        target_amount: Number(s.target_amount),
        current_amount: Number(s.current_amount)
      }));
  },

  async findById(id, userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data ? {
        ...data,
        target_amount: Number(data.target_amount),
        current_amount: Number(data.current_amount)
      } : null;
    }

    const store = getDevStore();
    const item = store.savings_goals.find(s => s.id === id && s.user_id === userId);
    return item ? {
      ...item,
      target_amount: Number(item.target_amount),
      current_amount: Number(item.current_amount)
    } : null;
  },

  async create({ user_id, name, target_amount, current_amount = 0, deadline = null, description = '' }) {
    const now = new Date().toISOString();
    const newGoal = {
      id: uuidv4(),
      user_id,
      name: name.trim(),
      target_amount: Number(target_amount),
      current_amount: Number(current_amount) || 0,
      deadline: deadline || null,
      description: description ? description.trim() : '',
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([newGoal])
        .select()
        .single();
      if (error) throw error;
      return {
        ...data,
        target_amount: Number(data.target_amount),
        current_amount: Number(data.current_amount)
      };
    }

    const store = getDevStore();
    store.savings_goals.unshift(newGoal);
    return { ...newGoal };
  },

  async update(id, userId, updates) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const safeUpdates = { ...updates, updated_at: now };
    if (safeUpdates.target_amount !== undefined) {
      safeUpdates.target_amount = Number(safeUpdates.target_amount);
    }
    if (safeUpdates.current_amount !== undefined) {
      safeUpdates.current_amount = Number(safeUpdates.current_amount);
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(safeUpdates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return {
        ...data,
        target_amount: Number(data.target_amount),
        current_amount: Number(data.current_amount)
      };
    }

    const store = getDevStore();
    const index = store.savings_goals.findIndex(s => s.id === id && s.user_id === userId);
    if (index === -1) return null;

    store.savings_goals[index] = { ...store.savings_goals[index], ...safeUpdates };
    return {
      ...store.savings_goals[index],
      target_amount: Number(store.savings_goals[index].target_amount),
      current_amount: Number(store.savings_goals[index].current_amount)
    };
  },

  async addMoney(id, userId, addAmount) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const newAmount = Math.max(0, existing.current_amount + Number(addAmount));
    return this.update(id, userId, { current_amount: newAmount });
  },

  async delete(id, userId) {
    if (supabase) {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }

    const store = getDevStore();
    const initialLen = store.savings_goals.length;
    store.savings_goals = store.savings_goals.filter(s => !(s.id === id && s.user_id === userId));
    return store.savings_goals.length < initialLen;
  }
};

module.exports = savingsModel;
