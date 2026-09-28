const bcrypt = require('bcryptjs');

// Pre-hashed password for demo user ('password123')
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const getInitialSeedData = () => ({
  users: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Alex Rivera',
      email: 'alex@teenmoney.dev',
      password_hash: DEMO_PASSWORD_HASH,
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  todos: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Complete Math homework (Algebra ch. 4)',
      description: 'Exercise questions 1 through 15',
      status: 'pending',
      priority: 'high',
      due_date: new Date().toISOString().split('T')[0],
      category: 'Education',
      completed_at: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Exercise for 30 minutes',
      description: 'Morning cardio and pushups',
      status: 'completed',
      priority: 'medium',
      due_date: new Date().toISOString().split('T')[0],
      category: 'Health',
      completed_at: new Date().toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000003',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Read 20 pages of Atomic Habits',
      description: 'Chapter on building micro-habits',
      status: 'pending',
      priority: 'low',
      due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      category: 'Personal',
      completed_at: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000004',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Clean room & organize desk',
      description: 'Put away laundry and books',
      status: 'completed',
      priority: 'low',
      due_date: new Date().toISOString().split('T')[0],
      category: 'Chores',
      completed_at: new Date().toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000005',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Prepare CS project presentation slides',
      description: 'Intro to web dev slides for class',
      status: 'in_progress',
      priority: 'high',
      due_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      category: 'Education',
      completed_at: null,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000006',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Return library book',
      description: 'Physics reference guide',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      category: 'Errands',
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  income: [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 5000,
      source: 'Pocket Money',
      description: 'Monthly allowance from parents',
      income_date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 2000,
      source: 'Part-time Work',
      description: 'Weekend math tutoring for junior student',
      income_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 1000,
      source: 'Gift',
      description: 'Birthday gift from grandma',
      income_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ],
  expenses: [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 250,
      title: 'McDonalds burger meal',
      description: 'Lunch with school friends after exam',
      category: 'Food',
      payment_method: 'UPI',
      expense_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      is_necessary: false,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 50,
      title: 'Bus ticket',
      description: 'City bus commute to school',
      category: 'Transport',
      payment_method: 'Cash',
      expense_date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
      is_necessary: true,
      created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 9 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 499,
      title: 'Steam indie game bundle',
      description: 'Weekend indie exploration game',
      category: 'Gaming',
      payment_method: 'Card',
      expense_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      is_necessary: false,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000004',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 600,
      title: 'Science textbook guide',
      description: 'Science revision companion book',
      category: 'Education',
      payment_method: 'UPI',
      expense_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      is_necessary: true,
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000005',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 120,
      title: 'Metro smart card top-up',
      description: 'Transit card reload',
      category: 'Transport',
      payment_method: 'UPI',
      expense_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      is_necessary: true,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000006',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 350,
      title: 'Cinema ticket',
      description: 'Sci-fi movie screening with friends',
      category: 'Entertainment',
      payment_method: 'UPI',
      expense_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      is_necessary: false,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000007',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 750,
      title: 'Sports grip & gear',
      description: 'Badminton racket grip and shuttlecocks',
      category: 'Sports',
      payment_method: 'Card',
      expense_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      is_necessary: true,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000008',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 280,
      title: 'Boba tea & cafe snack',
      description: 'Group study treats',
      category: 'Food',
      payment_method: 'UPI',
      expense_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      is_necessary: false,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000009',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 199,
      title: 'Spotify Student subscription',
      description: 'Ad-free music for study and focus',
      category: 'Subscriptions',
      payment_method: 'Card',
      expense_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      is_necessary: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000010',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      amount: 652,
      title: 'T-shirt on sale',
      description: 'Casual graphic tee',
      category: 'Shopping',
      payment_method: 'Card',
      expense_date: new Date().toISOString().split('T')[0],
      is_necessary: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  budgets: [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      category: 'Food',
      amount: 2000,
      period: 'monthly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      category: 'Entertainment',
      amount: 1000,
      period: 'monthly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      category: 'Gaming',
      amount: 500,
      period: 'monthly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      category: 'Transport',
      amount: 1500,
      period: 'monthly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000005',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      category: 'Shopping',
      amount: 1200,
      period: 'monthly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  savings_goals: [
    {
      id: 'f0000000-0000-0000-0000-000000000001',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Buy new headphones',
      target_amount: 5000,
      current_amount: 2750,
      deadline: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      description: 'Wireless noise-cancelling headphones for studying',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'f0000000-0000-0000-0000-000000000002',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Summer Coding Camp',
      target_amount: 8000,
      current_amount: 4500,
      deadline: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
      description: 'Weekend robotics and coding workshop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'f0000000-0000-0000-0000-000000000003',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Emergency Fun Fund',
      target_amount: 2000,
      current_amount: 1500,
      deadline: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      description: 'Backup pocket money for unexpected plans',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
});

let devStore = getInitialSeedData();

const resetDevStore = () => {
  devStore = getInitialSeedData();
  return devStore;
};

module.exports = {
  getDevStore: () => devStore,
  resetDevStore
};
