const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { getDevStore } = require('./devStore');

const todoModel = {
  async find(userId, filters = {}) {
    const {
      search,
      status,
      priority,
      category,
      dueDate,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = filters;

    if (supabase) {
      let query = supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (priority && priority !== 'all') {
        query = query.eq('priority', priority);
      }
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (dueDate) {
        query = query.eq('due_date', dueDate);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const ascending = sortOrder.toLowerCase() === 'asc';
      query = query.order(sortBy, { ascending });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    const store = getDevStore();
    let list = store.todos.filter(t => t.user_id === userId);

    if (status && status !== 'all') {
      list = list.filter(t => t.status === status);
    }
    if (priority && priority !== 'all') {
      list = list.filter(t => t.priority === priority);
    }
    if (category && category !== 'all') {
      list = list.filter(t => t.category && t.category.toLowerCase() === category.toLowerCase());
    }
    if (dueDate) {
      list = list.filter(t => t.due_date === dueDate);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        t => (t.title && t.title.toLowerCase().includes(q)) ||
             (t.description && t.description.toLowerCase().includes(q))
      );
    }

    const ascending = sortOrder.toLowerCase() === 'asc';
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (valA < valB) return ascending ? -1 : 1;
      return ascending ? 1 : -1;
    });

    return list.map(item => ({ ...item }));
  },

  async findById(id, userId) {
    if (supabase) {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    const store = getDevStore();
    const item = store.todos.find(t => t.id === id && t.user_id === userId);
    return item ? { ...item } : null;
  },

  async create({ user_id, title, description = '', status = 'pending', priority = 'medium', due_date = null, category = 'General' }) {
    const now = new Date().toISOString();
    const newTodo = {
      id: uuidv4(),
      user_id,
      title: title.trim(),
      description: description ? description.trim() : '',
      status,
      priority,
      due_date: due_date || null,
      category: category ? category.trim() : 'General',
      completed_at: status === 'completed' ? now : null,
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('todos')
        .insert([newTodo])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const store = getDevStore();
    store.todos.unshift(newTodo);
    return { ...newTodo };
  },

  async update(id, userId, updates) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const safeUpdates = { ...updates, updated_at: now };

    // Automatically manage completed_at
    if (updates.status) {
      if (updates.status === 'completed' && existing.status !== 'completed') {
        safeUpdates.completed_at = now;
      } else if (updates.status !== 'completed') {
        safeUpdates.completed_at = null;
      }
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('todos')
        .update(safeUpdates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const store = getDevStore();
    const index = store.todos.findIndex(t => t.id === id && t.user_id === userId);
    if (index === -1) return null;

    store.todos[index] = { ...store.todos[index], ...safeUpdates };
    return { ...store.todos[index] };
  },

  async delete(id, userId) {
    if (supabase) {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }

    const store = getDevStore();
    const initialLen = store.todos.length;
    store.todos = store.todos.filter(t => !(t.id === id && t.user_id === userId));
    return store.todos.length < initialLen;
  },

  async countToday(userId) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todos = await this.find(userId);
    // Count todos due today or completed today
    const todaysTasks = todos.filter(t => t.due_date === todayStr || (t.completed_at && t.completed_at.startsWith(todayStr)));
    const totalToday = todaysTasks.length;
    const completedToday = todaysTasks.filter(t => t.status === 'completed').length;
    const percentage = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

    return {
      totalToday,
      completedToday,
      percentage,
      pendingToday: totalToday - completedToday
    };
  }
};

module.exports = todoModel;
