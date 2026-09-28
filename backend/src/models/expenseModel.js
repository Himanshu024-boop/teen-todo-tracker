const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { getDevStore } = require('./devStore');

const expenseModel = {
  async find(userId, options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const {
      search,
      category,
      payment_method,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      is_necessary,
      sortBy = 'expense_date',
      sortOrder = 'desc'
    } = options;

    if (supabase) {
      let query = supabase
        .from('expenses')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (payment_method && payment_method !== 'all') {
        query = query.eq('payment_method', payment_method);
      }
      if (is_necessary !== undefined && is_necessary !== '' && is_necessary !== 'all') {
        query = query.eq('is_necessary', is_necessary === 'true' || is_necessary === true);
      }
      if (startDate) {
        query = query.gte('expense_date', startDate);
      }
      if (endDate) {
        query = query.lte('expense_date', endDate);
      }
      if (minAmount !== undefined && minAmount !== '') {
        query = query.gte('amount', Number(minAmount));
      }
      if (maxAmount !== undefined && maxAmount !== '') {
        query = query.lte('amount', Number(maxAmount));
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const ascending = sortOrder.toLowerCase() === 'asc';
      query = query
        .order(sortBy, { ascending })
        .range(offset, offset + limit - 1);

      const { data, count, error } = await query;
      if (error) throw error;

      return {
        data: (data || []).map(e => ({ ...e, amount: Number(e.amount) })),
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    }

    const store = getDevStore();
    let list = store.expenses.filter(e => e.user_id === userId);

    if (category && category !== 'all') {
      list = list.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (payment_method && payment_method !== 'all') {
      list = list.filter(e => e.payment_method.toLowerCase() === payment_method.toLowerCase());
    }
    if (is_necessary !== undefined && is_necessary !== '' && is_necessary !== 'all') {
      const boolVal = is_necessary === 'true' || is_necessary === true;
      list = list.filter(e => Boolean(e.is_necessary) === boolVal);
    }
    if (startDate) {
      list = list.filter(e => e.expense_date >= startDate);
    }
    if (endDate) {
      list = list.filter(e => e.expense_date <= endDate);
    }
    if (minAmount !== undefined && minAmount !== '') {
      list = list.filter(e => Number(e.amount) >= Number(minAmount));
    }
    if (maxAmount !== undefined && maxAmount !== '') {
      list = list.filter(e => Number(e.amount) <= Number(maxAmount));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        e => (e.title && e.title.toLowerCase().includes(q)) ||
             (e.description && e.description.toLowerCase().includes(q))
      );
    }

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

    const total = list.length;
    const paginated = list.slice(offset, offset + limit).map(item => ({
      ...item,
      amount: Number(item.amount)
    }));

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getAllForUser(userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('expense_date', { ascending: false });
      if (error) throw error;
      return (data || []).map(e => ({ ...e, amount: Number(e.amount) }));
    }

    const store = getDevStore();
    return store.expenses
      .filter(e => e.user_id === userId)
      .map(e => ({ ...e, amount: Number(e.amount) }));
  },

  async findByDateRange(userId, startDate, endDate) {
    if (supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .order('expense_date', { ascending: true });
      if (error) throw error;
      return (data || []).map(e => ({ ...e, amount: Number(e.amount) }));
    }

    const store = getDevStore();
    return store.expenses
      .filter(e => e.user_id === userId && e.expense_date >= startDate && e.expense_date <= endDate)
      .sort((a, b) => a.expense_date.localeCompare(b.expense_date))
      .map(e => ({ ...e, amount: Number(e.amount) }));
  },

  async findById(id, userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data ? { ...data, amount: Number(data.amount) } : null;
    }

    const store = getDevStore();
    const item = store.expenses.find(e => e.id === id && e.user_id === userId);
    return item ? { ...item, amount: Number(item.amount) } : null;
  },

  async create({ user_id, amount, title, description = '', category, payment_method, expense_date, is_necessary = false }) {
    const now = new Date().toISOString();
    const newExpense = {
      id: uuidv4(),
      user_id,
      amount: Number(amount),
      title: title.trim(),
      description: description ? description.trim() : '',
      category,
      payment_method,
      expense_date: expense_date || new Date().toISOString().split('T')[0],
      is_necessary: Boolean(is_necessary),
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select()
        .single();
      if (error) throw error;
      return { ...data, amount: Number(data.amount) };
    }

    const store = getDevStore();
    store.expenses.unshift(newExpense);
    return { ...newExpense };
  },

  async update(id, userId, updates) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const safeUpdates = { ...updates, updated_at: now };
    if (safeUpdates.amount !== undefined) {
      safeUpdates.amount = Number(safeUpdates.amount);
    }
    if (safeUpdates.is_necessary !== undefined) {
      safeUpdates.is_necessary = Boolean(safeUpdates.is_necessary);
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .update(safeUpdates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return { ...data, amount: Number(data.amount) };
    }

    const store = getDevStore();
    const index = store.expenses.findIndex(e => e.id === id && e.user_id === userId);
    if (index === -1) return null;

    store.expenses[index] = { ...store.expenses[index], ...safeUpdates };
    return { ...store.expenses[index], amount: Number(store.expenses[index].amount) };
  },

  async delete(id, userId) {
    if (supabase) {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }

    const store = getDevStore();
    const initialLen = store.expenses.length;
    store.expenses = store.expenses.filter(e => !(e.id === id && e.user_id === userId));
    return store.expenses.length < initialLen;
  }
};

module.exports = expenseModel;
