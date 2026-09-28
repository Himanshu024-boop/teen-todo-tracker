import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Zap,
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const LESSONS = [
  {
    id: 'needs-vs-wants',
    title: 'Needs vs Wants: The Golden Rule',
    tag: 'Core Concept',
    readTime: '2 min read',
    icon: ShoppingBag,
    summary: 'Mastering the difference between what keeps you going and what brings extra fun.',
    content: [
      'A **Need** is essential for survival, health, and basic daily life — like school bus fare, basic lunch, textbook supplies, and hygiene.',
      'A **Want** is something nice to have that makes life fun or stylish — like brand-new gaming skins, boba tea after school, or cinema popcorn.',
      'A good target for teenagers is the **50-30-20 Rule**: 50% for needs, 30% for fun wants, and 20% stored safely into your savings goal!'
    ],
    quiz: {
      question: 'Which of the following is considered a "Need"?',
      options: ['New gaming mousepad', 'City bus pass to attend school', 'Premium Spotify subscription', 'Trendy sneaker drop'],
      correctIndex: 1,
      explanation: 'Bus fare to school is an essential need to commute to your classes every day!'
    }
  },
  {
    id: 'how-budgets-work',
    title: 'How Budgets Work Without Being Boring',
    tag: 'Budgeting',
    readTime: '3 min read',
    icon: TrendingUp,
    summary: 'A budget isn’t a prison — it’s a permission slip to spend on what you love without feeling guilty.',
    content: [
      'Think of a budget like energy points in a video game. You start the month with a set number of points (your pocket money or allowance).',
      'If you blow all your points in the first 3 days on snacks and gaming, you have zero points left for weekend hangouts with friends!',
      'Setting category budgets gives you a crystal-clear boundary so you never run out before the month is over.'
    ],
    quiz: {
      question: 'What is the real goal of setting a budget?',
      options: [
        'To stop buying anything you enjoy',
        'To have a clear plan so your money lasts the entire month',
        'To impress your bank manager',
        'To keep all your cash under your pillow'
      ],
      correctIndex: 1,
      explanation: 'Budgets ensure your money goes where you want it to, preventing surprise zero-balance emergencies!'
    }
  },
  {
    id: 'small-purchases-add-up',
    title: 'The Micro-Purchase Trap: How ₹50 Adds Up',
    tag: 'Smart Spending',
    readTime: '2 min read',
    icon: Zap,
    summary: 'Why buying a ₹80 snack every single day silently drains ₹2,400 a month.',
    content: [
      'Small purchases look harmless because ₹50 or ₹100 doesn’t feel like a big deal.',
      'However, ₹70 spent every weekday after school equals **₹1,400 per month** or **₹16,800 a year**!',
      'That ₹16,800 could easily pay for noise-cancelling headphones, a summer workshop, or a dream gaming setup.'
    ],
    quiz: {
      question: 'If you spend ₹100 every single day on snacks, how much does that total in a year?',
      options: ['₹3,650', '₹12,000', '₹36,500', '₹8,500'],
      correctIndex: 2,
      explanation: '₹100 x 365 days = ₹36,500! Micro-expenses compound dramatically over time.'
    }
  },
  {
    id: 'saving-goals-hack',
    title: 'How to Set and Smash a Savings Goal',
    tag: 'Goal Setting',
    readTime: '2 min read',
    icon: Sparkles,
    summary: 'Break big scary targets into bite-sized weekly milestones.',
    content: [
      'Want something that costs ₹4,000? Don’t look at the giant ₹4,000 mountain.',
      'Instead, break it into **₹250 per week for 16 weeks**. ₹250 a week is just skipping one takeout meal or saving your spare change!',
      'Always give your goal a clear name, visual picture, and deadline to stay motivated.'
    ],
    quiz: {
      question: 'What is the best way to tackle a big savings target?',
      options: [
        'Wait until you suddenly get lucky',
        'Break it into bite-sized weekly milestones',
        'Borrow money from 5 friends',
        'Give up because it feels too far away'
      ],
      correctIndex: 1,
      explanation: 'Bite-sized weekly targets make even huge goals achievable and manageable.'
    }
  },
  {
    id: 'price-comparison',
    title: 'The 24-Hour Rule & Smart Price Comparisons',
    tag: 'Shopping Savvy',
    readTime: '3 min read',
    icon: ShieldCheck,
    summary: 'The secret weapon against impulse buying and marketing hype.',
    content: [
      'Whenever you want to buy an unplanned item over ₹500, enforce the **24-Hour Rule**: wait 24 hours before pressing buy.',
      'In over 70% of cases, the intense impulse fades by the next day, saving you money for things you genuinely care about.',
      'Always compare student discounts, search for verified promo coupons, and compare online vs offline prices before checking out.'
    ],
    quiz: {
      question: 'What is the "24-Hour Rule" for shopping?',
      options: [
        'Shop only for 24 hours straight during sales',
        'Wait 24 hours before buying non-essential items to curb impulse purchases',
        'Return items within 24 hours',
        'Spend all your money within 24 hours'
      ],
      correctIndex: 1,
      explanation: 'Waiting 24 hours gives your rational brain time to decide if you really want the item.'
    }
  }
];

const Education = () => {
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState({});

  const handleSelectOption = (lessonId, optionIndex) => {
    setQuizAnswers(prev => ({ ...prev, [lessonId]: optionIndex }));
  };

  const handleSubmitQuiz = (lessonId) => {
    setSubmittedQuiz(prev => ({ ...prev, [lessonId]: true }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          Financial Literacy Hub 🎓
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Bite-sized money masterclasses designed for teenagers. Learn smart habits that stick for life.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lessons Navigation */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Money Masterclass Lessons
          </div>

          <div className="space-y-2">
            {LESSONS.map((lesson) => {
              const Icon = lesson.icon;
              const isSelected = selectedLesson.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 shadow-md shadow-brand-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        <span>{lesson.tag}</span>
                        <span>{lesson.readTime}</span>
                      </div>
                      <h4
                        className={`text-xs md:text-sm font-bold truncate ${
                          isSelected
                            ? 'text-brand-900 dark:text-brand-300'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {lesson.title}
                      </h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Lesson Reading & Interactive Quiz */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reading Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                {selectedLesson.tag}
              </span>
              <span className="text-xs text-slate-400">{selectedLesson.readTime}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3">
              {selectedLesson.title}
            </h2>

            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              {selectedLesson.summary}
            </p>

            <div className="space-y-4 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedLesson.content.map((paragraph, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Quick Quiz */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-800/40 border border-brand-200/80 dark:border-brand-900/60 shadow-sm">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              Quick Knowledge Check
            </div>

            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white mb-4">
              {selectedLesson.quiz.question}
            </h3>

            <div className="space-y-2.5 mb-5">
              {selectedLesson.quiz.options.map((option, idx) => {
                const isSelected = quizAnswers[selectedLesson.id] === idx;
                const isSubmitted = submittedQuiz[selectedLesson.id];
                const isCorrect = idx === selectedLesson.quiz.correctIndex;

                let optionStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
                if (isSelected) {
                  optionStyle = 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold';
                }
                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(selectedLesson.id, idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs md:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>

            {!submittedQuiz[selectedLesson.id] ? (
              <button
                disabled={quizAnswers[selectedLesson.id] === undefined}
                onClick={() => handleSubmitQuiz(selectedLesson.id)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-bold text-slate-900 dark:text-white mb-1">
                  {quizAnswers[selectedLesson.id] === selectedLesson.quiz.correctIndex
                    ? '🎉 Spot on! Great financial instinct.'
                    : '💡 Almost! Keep this in mind:'}
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedLesson.quiz.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
