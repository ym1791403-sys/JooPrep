/**
 * JooPrep v2 Client Engine
 * 6 Academic Subjects: Linear Algebra, Calculus, Basic Electric, Physics, English, Arabic Introduction
 * Features:
 * - 4-Choice MCQ Quiz Arena (Practice with instant explanation & Exam with timer & review)
 * - Code Lab & Oral Viva Defense Simulator with 4 Personas
 * - Smart Prep Sheet Generator (10 Trap Questions)
 * - Student Readiness Gauge & Subject Mastery Heatmap
 */

// ----------------- Comprehensive 6-Subject MCQ Question Bank (100% English Exams • Arabic Explanations) -----------------
const SUBJECT_ORDER = [
  'linear_algebra',
  'calculus',
  'basic_electric',
  'physics',
  'english',
  'cs_intro'
];

function getNextSubjectKey(currentSubjectKey) {
  const currentIndex = SUBJECT_ORDER.indexOf(currentSubjectKey);
  if (currentIndex === -1) return SUBJECT_ORDER[0];
  const nextIndex = (currentIndex + 1) % SUBJECT_ORDER.length;
  return SUBJECT_ORDER[nextIndex];
}

window.startNextSubjectQuiz = function() {
  const currentKey = state.activeSubjectKey || state.selectedSubject || 'linear_algebra';
  const nextKey = getNextSubjectKey(currentKey);
  startQuizForSubject(nextKey);
};

const SUBJECTS_DATA = {
  linear_algebra: {
    id: "linear_algebra",
    nameAr: "الجبر الخطي",
    nameEn: "Linear Algebra",
    code: "MATH 101",
    theme: "from-indigo-500 via-blue-600 to-cyan-500",
    borderGlow: "hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]",
    badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    icon: "grid-3x3",
    description: "المحددات، معكوس المصفوفات، العمليات الأولية، فضاء المتجهات، وحل المعادلات الخطية.",
    questions: []
  },
  calculus: {
    id: "calculus",
    nameAr: "التفاضل والتكامل",
    nameEn: "Calculus",
    code: "MATH 102",
    theme: "from-blue-600 via-indigo-600 to-violet-600",
    borderGlow: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)]",
    badgeBg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: "sigma",
    description: "النهايات، قواعد الاشتقاق، تطبيقات التفاضل، التكامل المحدود وغير المحدود، والمساحات.",
    questions: []
  },
  basic_electric: {
    id: "basic_electric",
    nameAr: "الدوائر الكهربية",
    nameEn: "Basic Electric",
    code: "ELEC 101",
    theme: "from-amber-500 via-orange-600 to-yellow-500",
    borderGlow: "hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: "zap",
    description: "قانون أوم، قوانين كيرشوف (KCL & KVL)، تحليل العقد والمش، ونظريات ثيفنن ونورتون.",
    questions: []
  },
  physics: {
    id: "physics",
    nameAr: "الفيزياء الهندسية",
    nameEn: "Physics",
    code: "PHYS 101",
    theme: "from-violet-600 via-purple-600 to-indigo-600",
    borderGlow: "hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]",
    badgeBg: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    icon: "atom",
    description: "الميكانيكا الكلاسيكية، قوانين نيوتن، الشغل والطاقة، الكهرومغناطيسية، والموجات.",
    questions: []
  },
  english: {
    id: "english",
    nameAr: "اللغة الإنجليزية",
    nameEn: "English",
    code: "ENG 101",
    theme: "from-emerald-500 via-teal-600 to-cyan-600",
    borderGlow: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: "book-open",
    description: "المصطلحات الهندسية، القواعد المتقدمة، التراكيب الأكاديمية، ومهارات القراءة التقنية.",
    questions: []
  },
  cs_intro: {
    id: "cs_intro",
    nameAr: "مقدمة علوم الحاسب",
    nameEn: "Introduction to Computer Science",
    code: "CS 101",
    theme: "from-teal-600 via-emerald-600 to-cyan-600",
    borderGlow: "hover:border-teal-500/50",
    badgeBg: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    icon: "cpu",
    description: "المفاهيم الأساسية لعلوم الحاسب، الخوارزميات، تمثيل البيانات والأنظمة الثنائية، شبكات الحاسب، ونظم التشغيل.",
    questions: []
  }
};

// ----------------- Custom Quiz Bank Engine (Zero Defaults • Student Managed) -----------------
function getCustomQuestionsMap() {
  try {
    const raw = localStorage.getItem('jooprep_custom_questions');
    return raw ? JSON.parse(raw) : {};
  } catch(e) {
    return {};
  }
}

function saveCustomQuestionsMap(map) {
  localStorage.setItem('jooprep_custom_questions', JSON.stringify(map));
}

function loadCustomQuestions() {
  const map = getCustomQuestionsMap();
  SUBJECT_ORDER.forEach(key => {
    if (SUBJECTS_DATA[key]) {
      SUBJECTS_DATA[key].questions = Array.isArray(map[key]) ? map[key] : [];
    }
  });
}

function addCustomQuestion(subjectKey, questionObj) {
  const map = getCustomQuestionsMap();
  if (!map[subjectKey]) map[subjectKey] = [];
  map[subjectKey].push(questionObj);
  saveCustomQuestionsMap(map);
  loadCustomQuestions();
  renderSubjectsGrid();
  updateQuizBankCountUI();

  if (state.activeSubjectKey === subjectKey) {
    state.quizQuestions = [...SUBJECTS_DATA[subjectKey].questions];
    startQuizForSubject(subjectKey);
  }
}

function deleteCustomQuestion(subjectKey, questionId) {
  const map = getCustomQuestionsMap();
  if (map[subjectKey]) {
    map[subjectKey] = map[subjectKey].filter(q => q.id !== questionId);
    saveCustomQuestionsMap(map);
    loadCustomQuestions();
    renderSubjectsGrid();
    updateQuizBankCountUI();

    if (state.activeSubjectKey === subjectKey) {
      state.quizQuestions = [...SUBJECTS_DATA[subjectKey].questions];
      startQuizForSubject(subjectKey);
    }
  }
}

function clearSubjectQuestions(subjectKey) {
  const map = getCustomQuestionsMap();
  map[subjectKey] = [];
  saveCustomQuestionsMap(map);
  loadCustomQuestions();
  renderSubjectsGrid();
  updateQuizBankCountUI();

  if (state.activeSubjectKey === subjectKey) {
    startQuizForSubject(subjectKey);
  }
}

function updateQuizBankCountUI() {
  const subKey = state.activeSubjectKey || 'linear_algebra';
  const sub = SUBJECTS_DATA[subKey];
  const count = sub && sub.questions ? sub.questions.length : 0;
  const btnText = document.getElementById('quiz-bank-count-btn');
  if (btnText) {
    btnText.innerText = `بنك الأسئلة (${count})`;
  }
}

// ----------------- Lightweight Floating Toast Feedback -----------------
function showToast(msg, type = 'success') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = type === 'success' 
    ? `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i><span>${msg}</span>` 
    : `<i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i><span>${msg}</span>`;
  toast.className = `fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all duration-300 pointer-events-none transform translate-y-0 opacity-100 ${
    type === 'success' ? 'bg-slate-900 border border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border border-rose-500/50 text-rose-300'
  }`;
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    toast.className = 'fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all duration-300 pointer-events-none transform translate-y-10 opacity-0 bg-slate-900 border border-slate-700 text-slate-300';
  }, 3200);
}

// ----------------- Modal Open / Close Handlers -----------------
window.openAddQuestionModal = function(subKey) {
  const modal = document.getElementById('modal-add-question');
  if (!modal) return;
  const select = document.getElementById('add-q-subject');
  if (select) {
    select.value = subKey || state.activeSubjectKey || 'linear_algebra';
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
};

window.closeAddQuestionModal = function() {
  const modal = document.getElementById('modal-add-question');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleAddQuestionSubmit = function(action = 'start') {
  const subKey = document.getElementById('add-q-subject').value;
  const prompt = document.getElementById('add-q-prompt').value.trim();
  const optA = document.getElementById('add-q-opt-a').value.trim();
  const optB = document.getElementById('add-q-opt-b').value.trim();
  const optC = document.getElementById('add-q-opt-c').value.trim();
  const optD = document.getElementById('add-q-opt-d').value.trim();
  const correctKey = document.getElementById('add-q-correct').value;
  const explanation = document.getElementById('add-q-explanation').value.trim() || 'إجابة صحيحة وفقاً للمفاهيم الأكاديمية المقررة.';

  if (!prompt || !optA || !optB || !optC || !optD) {
    showToast('يرجى ملء نص السؤال وجميع الخيارات الأربعة (A, B, C, D)', 'error');
    return;
  }

  const newQuestion = {
    id: `${subKey}_${Date.now()}`,
    question: prompt,
    options: [
      { key: "A", text: optA },
      { key: "B", text: optB },
      { key: "C", text: optC },
      { key: "D", text: optD }
    ],
    correctKey: correctKey,
    explanation: explanation
  };

  addCustomQuestion(subKey, newQuestion);
  showToast('تمت إضافة السؤال بنجاح إلى بنك الأسئلة!');

  document.getElementById('add-q-prompt').value = '';
  document.getElementById('add-q-opt-a').value = '';
  document.getElementById('add-q-opt-b').value = '';
  document.getElementById('add-q-opt-c').value = '';
  document.getElementById('add-q-opt-d').value = '';
  document.getElementById('add-q-explanation').value = '';

  if (action === 'start') {
    closeAddQuestionModal();
    startQuizForSubject(subKey);
  } else {
    document.getElementById('add-q-prompt').focus();
  }
};

window.openManageQuestionsModal = function() {
  const modal = document.getElementById('modal-manage-questions');
  if (!modal) return;
  const sel = document.getElementById('manage-q-subject-filter');
  if (sel) {
    sel.value = state.activeSubjectKey || 'linear_algebra';
  }
  renderManageQuestionsList();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
};

window.closeManageQuestionsModal = function() {
  const modal = document.getElementById('modal-manage-questions');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.renderManageQuestionsList = function() {
  const sel = document.getElementById('manage-q-subject-filter');
  const subKey = sel ? sel.value : (state.activeSubjectKey || 'linear_algebra');
  const sub = SUBJECTS_DATA[subKey];
  const listContainer = document.getElementById('manage-q-list');
  const countBadge = document.getElementById('manage-q-count-badge');
  if (!listContainer || !sub) return;

  const questions = sub.questions || [];
  if (countBadge) countBadge.innerText = `${questions.length} أسئلة مضافة`;

  if (questions.length === 0) {
    listContainer.innerHTML = `
      <div class="p-8 text-center space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800">
        <i data-lucide="inbox" class="w-10 h-10 text-slate-500 mx-auto"></i>
        <p class="text-sm font-bold text-slate-300">لا توجد أسئلة مضافة في هذه المادة بعد.</p>
        <button type="button" onclick="closeManageQuestionsModal(); openAddQuestionModal('${subKey}');" class="btn-glass-primary px-4 py-2 rounded-xl text-xs font-black">
          + أضف أول سؤال الآن
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  listContainer.innerHTML = '';
  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = "p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 animate-slide-up";
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-2.5">
          <span class="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-black flex items-center justify-center border border-indigo-500/30 flex-shrink-0 mt-0.5">
            ${idx + 1}
          </span>
          <p class="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed font-sans" dir="auto">
            ${q.question}
          </p>
        </div>
        <button type="button" onclick="deleteCustomQuestion('${subKey}', '${q.id}'); renderManageQuestionsList(); showToast('تم حذف السؤال بنجاح', 'error');" class="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-950/60 transition flex-shrink-0" title="حذف السؤال">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 text-[11px] font-sans" dir="ltr">
        ${q.options.map(opt => `
          <div class="px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${opt.key === q.correctKey ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'}">
            <span class="font-mono font-bold ${opt.key === q.correctKey ? 'text-emerald-400' : 'text-slate-500'}">${opt.key}:</span>
            <span class="truncate">${opt.text}</span>
          </div>
        `).join('')}
      </div>

      ${q.explanation ? `
        <div class="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
          <strong class="text-indigo-400">التلميح:</strong> ${q.explanation}
        </div>
      ` : ''}
    `;
    listContainer.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
};

window.handleClearSubjectQuestions = function() {
  const sel = document.getElementById('manage-q-subject-filter');
  const subKey = sel ? sel.value : (state.activeSubjectKey || 'linear_algebra');
  if (confirm('هل أنت متأكد من رغبتك في حذف جميع أسئلة هذه المادة؟')) {
    clearSubjectQuestions(subKey);
    renderManageQuestionsList();
    showToast('تم إفراغ جميع أسئلة المادة بنجاح');
  }
};

window.openImportModal = function() {
  const modal = document.getElementById('modal-import-questions');
  if (!modal) return;
  const sel = document.getElementById('import-q-subject');
  if (sel) {
    sel.value = state.activeSubjectKey || 'linear_algebra';
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
};

window.closeImportModal = function() {
  const modal = document.getElementById('modal-import-questions');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.loadSampleImportTemplate = function() {
  const textarea = document.getElementById('import-json-input');
  if (!textarea) return;
  const sample = [
    {
      "question": "What is the result of 2 + 2?",
      "options": [
        { "key": "A", "text": "3" },
        { "key": "B", "text": "4" },
        { "key": "C", "text": "5" },
        { "key": "D", "text": "6" }
      ],
      "correctKey": "B",
      "explanation": "2 + 2 equals 4 according to standard arithmetic."
    }
  ];
  textarea.value = JSON.stringify(sample, null, 2);
};

window.handleBatchImportSubmit = function() {
  const subKey = document.getElementById('import-q-subject').value;
  const rawText = document.getElementById('import-json-input').value.trim();
  if (!rawText) {
    showToast('يرجى لصق كود الأسئلة في الخانة', 'error');
    return;
  }

  try {
    const list = JSON.parse(rawText);
    if (!Array.isArray(list) || list.length === 0) {
      showToast('يجب أن تكون البيانات عبارة عن قائمة أسئلة (JSON Array)', 'error');
      return;
    }

    let addedCount = 0;
    list.forEach((item, idx) => {
      if (item.question && Array.isArray(item.options) && item.options.length >= 2 && item.correctKey) {
        addCustomQuestion(subKey, {
          id: `${subKey}_${Date.now()}_${idx}`,
          question: item.question,
          options: item.options,
          correctKey: item.correctKey,
          explanation: item.explanation || 'إجابة صحيحة وفقاً للمقرر الأكاديمي.'
        });
        addedCount++;
      }
    });

    closeImportModal();
    showToast(`تم استيراد ${addedCount} سؤال بنجاح!`);
    startQuizForSubject(subKey);
  } catch(err) {
    showToast(`خطأ في صيغة JSON: ${err.message}`, 'error');
  }
};

// ----------------- Global Application State -----------------
const state = {
  activeView: 'dashboard',
  audioEnabled: false,
  user: {
    id: null,
    email: '',
    name: 'طالب حاسبات وهندسة',
    college: 'كلية الحاسبات والمعلومات',
    academic_year: 'الفرقة الأولى',
    quota_used_today_viva: 0,
    daily_quota_viva: 5,
    quota_used_today_prep: 0,
    daily_quota_prep: 10,
    isLoggedIn: false
  },
  
  // Active MCQ Quiz State
  activeSubjectKey: 'linear_algebra',
  quizQuestions: [],
  currentQuestionIndex: 0,
  userAnswers: {}, // questionId -> selectedKey ('A' | 'B' | 'C' | 'D')
  quizMode: 'practice', // 'practice' (instant explanation) | 'exam' (timed + review at end)
  quizTimerInterval: null,
  quizSecondsRemaining: 600, // 10 mins
  quizSubmitted: false,

  // Code & Viva Arena State
  vivaSessionId: null,
  vivaCurrentTurn: 1,
  vivaMaxTurns: 5,
  vivaPersona: 'strict_ta',
  vivaLanguage: 'mixed',
  vivaLevel: 2,
  vivaScores: [],
  allErrors: []
};

// ----------------- Dark Mode Engine (Midnight Navy / Academic Light) -----------------
function applyTheme(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-toggle-icon');

  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    if (icon) {
      icon.setAttribute('data-lucide', 'moon');
      icon.className = 'w-4 h-4 text-indigo-400';
    }
    if (btn) btn.title = 'الوضع الفاتح مفعّل (انقر للتبديل للوضع الكحلي الداكن)';
  } else {
    // Default Flagship: Midnight Navy
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    if (icon) {
      icon.setAttribute('data-lucide', 'sun');
      icon.className = 'w-4 h-4 text-amber-400';
    }
    if (btn) btn.title = 'الوضع الكحلي الداكن مفعّل (انقر للتبديل للوضع الفاتح)';
  }

  if (window.lucide) lucide.createIcons();
}

function initTheme() {
  const savedTheme = localStorage.getItem('jooprep_theme') || 'dark';
  applyTheme(savedTheme);
}

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const nextTheme = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('jooprep_theme', nextTheme);
  applyTheme(nextTheme);
};

window.toggleAudio = function() {};

// ----------------- Initialization -----------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  if (window.lucide) lucide.createIcons();

  loadCustomQuestions();
  initSupabaseClient();
  checkAuthSession();

  renderSubjectsGrid();
  loadUserProfile();
  loadReadinessData();

  // Initial URL Hash page navigation
  const initHash = (window.location.hash || '').replace('#', '');
  if (initHash && ['dashboard', 'quizzes', 'viva', 'prep-sheet', 'error-notebook', 'profile', 'auth'].includes(initHash)) {
    navigate(initHash);
  }

  const codeInput = document.getElementById('viva-code-input');
  if (codeInput) {
    codeInput.addEventListener('input', () => {
      const lines = codeInput.value.split('\n').length;
      document.getElementById('code-line-counter').innerText = `${lines} سطر`;
    });
  }
});

// ----------------- Navigation -----------------
function navigate(viewName) {
  if (viewName === 'auth') {
    window.location.href = '/login.html';
    return;
  }

  // Strict Authentication Guard
  const isLoggedIn = state.user && state.user.isLoggedIn;
  if (!isLoggedIn) {
    if (viewName !== 'landing') {
      showToast('يجب تسجيل الدخول أولاً للوصول إلى هذه الميزة 🔒', 'error');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 750);
      return;
    }
  } else {
    // If logged in and requested landing, redirect to dashboard
    if (viewName === 'landing') {
      viewName = 'dashboard';
    }
  }

  state.activeView = viewName;
  const views = ['landing', 'dashboard', 'quizzes', 'viva', 'prep-sheet', 'error-notebook', 'profile', 'auth'];
  
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const navBtn = document.getElementById(`nav-btn-${v}`);
    const mobBtn = document.getElementById(`mob-nav-${v}`);
    
    if (el) {
      if (v === viewName) {
        el.classList.remove('hidden');
        el.style.display = 'block';
      } else {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    }

    if (navBtn) {
      if (v === viewName) {
        navBtn.className = "nav-link px-4 py-2 rounded-xl transition flex items-center gap-2 text-white bg-indigo-600/20 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 font-bold";
      } else {
        navBtn.className = "nav-link px-4 py-2 rounded-xl transition flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50";
      }
    }

    if (mobBtn) {
      if (v === viewName) {
        mobBtn.className = "flex flex-col items-center gap-1 text-cyan-400 font-black";
      } else {
        mobBtn.className = "flex flex-col items-center gap-1 text-slate-400 hover:text-white";
      }
    }
  });

  // URL Hash Routing so navigation behaves like real distinct pages
  try {
    if (window.location.hash !== `#${viewName}`) {
      history.pushState(null, null, `#${viewName}`);
    }
  } catch(e) {}

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (viewName === 'error-notebook') {
    loadErrorNotebook();
  }

  if (window.lucide) lucide.createIcons();
}
// Handle Browser Back & Forward buttons
window.addEventListener('popstate', () => {
  const hash = (window.location.hash || '').replace('#', '') || (state.user && state.user.isLoggedIn ? 'dashboard' : 'landing');
  if (state.user && state.user.isLoggedIn) {
    if (['dashboard', 'quizzes', 'viva', 'prep-sheet', 'error-notebook', 'profile'].includes(hash)) {
      navigate(hash);
    }
  } else {
    navigate('landing');
  }
});
// ----------------- Audio & Utilities -----------------
function toggleAudio() {
  state.audioEnabled = !state.audioEnabled;
  const icon = document.getElementById('audio-icon');
  if (state.audioEnabled) {
    icon.className = "w-4 h-4 text-emerald-400";
    speakText("تم تفعيل الصوت التفاعلي");
  } else {
    icon.className = "w-4 h-4 text-slate-500";
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
}

function speakText(text) {
  // Voice readout disabled per user request
  return;
}

// ----------------- Render 6 Subjects Grid on Dashboard -----------------
function renderSubjectsGrid() {
  const container = document.getElementById('subjects-grid-container');
  if (!container) return;
  container.innerHTML = '';

  Object.values(SUBJECTS_DATA).forEach(sub => {
    const card = document.createElement('div');
    card.className = `glass-card p-6 transition flex flex-col justify-between group relative overflow-hidden ${sub.borderGlow}`;
    
    card.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.theme} text-white shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 border border-white/20 transition-all duration-300">
            <i data-lucide="${sub.icon}" class="w-6 h-6"></i>
          </div>
          <span class="text-[11px] font-black px-3 py-1 rounded-full ${sub.badgeBg}">
            ${sub.code}
          </span>
        </div>

        <div>
          <h4 class="font-black text-white text-lg tracking-tight group-hover:text-indigo-300 transition">${sub.nameAr}</h4>
          <span class="text-xs text-slate-400 font-mono block">${sub.nameEn}</span>
          <p class="text-xs text-slate-300 mt-2 leading-relaxed">
            ${sub.description}
          </p>
        </div>
      </div>

      <div class="pt-5 mt-4 border-t border-slate-700/50 flex items-center justify-between">
        <span class="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
          <i data-lucide="help-circle" class="w-4 h-4 text-slate-500"></i>
          ${sub.questions.length} كويزات MCQ
        </span>
        <button onclick="startQuizForSubject('${sub.id}')" class="btn-glass-primary px-4 py-2 rounded-xl text-xs font-black shadow-lg transition active:scale-95 flex items-center gap-1.5">
          <span>ابدأ الكويز</span>
          <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  if (window.lucide) lucide.createIcons();
}

// ----------------- 4-Option MCQ Quiz Arena -----------------
window.startQuizWithTopic = function(course, topic) {
  startQuizForSubject(course);
};

function startQuizForSubject(subjectKey) {
  const sub = SUBJECTS_DATA[subjectKey] || SUBJECTS_DATA.linear_algebra;
  state.activeSubjectKey = sub.id;
  state.quizQuestions = [...(sub.questions || [])];
  state.currentQuestionIndex = 0;
  state.userAnswers = {};
  state.quizSubmitted = false;

  const sel = document.getElementById('quiz-course-select');
  if (sel) sel.value = sub.id;

  const titleEl = document.getElementById('quiz-topic-title');
  if (titleEl) titleEl.innerText = `${sub.nameAr} (${sub.nameEn}) — كويز MCQ`;

  navigate('quizzes');
  updateQuizBankCountUI();

  const emptyCard = document.getElementById('quiz-empty-card');
  const problemCard = document.getElementById('quiz-problem-card');
  const successCard = document.getElementById('quiz-success-card');

  if (state.quizQuestions.length === 0) {
    if (emptyCard) emptyCard.classList.remove('hidden');
    if (problemCard) problemCard.classList.add('hidden');
    if (successCard) successCard.classList.add('hidden');
    const emptySubName = document.getElementById('quiz-empty-subject-name');
    if (emptySubName) emptySubName.innerText = `${sub.nameAr} (${sub.nameEn})`;
    stopQuizTimer();
  } else {
    if (emptyCard) emptyCard.classList.add('hidden');
    if (problemCard) problemCard.classList.remove('hidden');
    if (successCard) successCard.classList.add('hidden');

    renderCurrentMCQQuestion();

    if (state.quizMode === 'exam') {
      startQuizTimer();
    } else {
      stopQuizTimer();
    }
  }
}

function handleSubjectSelectChange() {
  const sel = document.getElementById('quiz-course-select');
  if (sel) {
    startQuizForSubject(sel.value);
  }
}

function renderCurrentMCQQuestion() {
  const questions = state.quizQuestions;
  const emptyCard = document.getElementById('quiz-empty-card');
  const problemCard = document.getElementById('quiz-problem-card');

  if (!questions || questions.length === 0) {
    const sub = SUBJECTS_DATA[state.activeSubjectKey] || SUBJECTS_DATA.linear_algebra;
    if (emptyCard) emptyCard.classList.remove('hidden');
    if (problemCard) problemCard.classList.add('hidden');
    const emptySubName = document.getElementById('quiz-empty-subject-name');
    if (emptySubName) emptySubName.innerText = `${sub.nameAr} (${sub.nameEn})`;
    return;
  }
  if (emptyCard) emptyCard.classList.add('hidden');
  if (problemCard) problemCard.classList.remove('hidden');

  const q = questions[state.currentQuestionIndex];
  const total = questions.length;
  const selectedKey = state.userAnswers[q.id];

  document.getElementById('quiz-step-indicator').innerText = `سؤال ${state.currentQuestionIndex + 1} من ${total}`;
  document.getElementById('quiz-step-title').innerText = `اختيار من 4 بدائل (MCQ)`;

  // Question Prompt
  document.getElementById('quiz-step-prompt').innerHTML = formatMathText(q.question);

  // Render 4 Options
  const optionsContainer = document.getElementById('mcq-options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach(opt => {
    const isSelected = selectedKey === opt.key;
    let cardClass = "mcq-option-card flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer select-none";
    let badgeClass = "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition";

    if (state.quizMode === 'practice' && selectedKey) {
      // In practice mode after answering, show colors immediately
      if (opt.key === q.correctKey) {
        cardClass += " bg-emerald-950/40 border-emerald-500/80 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/50";
        badgeClass += " bg-emerald-500 text-white font-black shadow-md";
      } else if (isSelected && opt.key !== q.correctKey) {
        cardClass += " bg-rose-950/40 border-rose-500/80 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/50";
        badgeClass += " bg-rose-500 text-white font-black shadow-md";
      } else {
        cardClass += " bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-50";
        badgeClass += " bg-slate-800 text-slate-400";
      }
    } else {
      // Standard selection mode with Vibrant EdTech Glassmorphism
      if (isSelected) {
        cardClass += " selected-active bg-indigo-950/40 border-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] ring-2 ring-indigo-500/50";
        badgeClass += " bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white font-black shadow-lg scale-105";
      } else {
        cardClass += " bg-slate-900/60 border-slate-700/60 hover:border-indigo-400/50 text-slate-200 hover:bg-slate-800/60";
        badgeClass += " bg-slate-800 text-slate-300 border border-slate-700/80";
      }
    }

    const optEl = document.createElement('div');
    optEl.className = cardClass;
    optEl.onclick = () => selectMCQOption(opt.key);
    optEl.innerHTML = `
      <div class="flex items-center gap-3.5">
        <div class="${badgeClass}">${opt.key}</div>
        <div class="text-sm sm:text-base font-bold">${formatMathText(opt.text)}</div>
      </div>
      <div>
        ${isSelected ? '<i data-lucide="check-circle-2" class="w-5 h-5 text-indigo-400"></i>' : '<div class="w-4 h-4 rounded-full border border-slate-600"></div>'}
      </div>
    `;
    optionsContainer.appendChild(optEl);
  });

  // Practice Mode Explanation Box
  const expBox = document.getElementById('quiz-feedback-box');
  if (state.quizMode === 'practice' && selectedKey) {
    const isCorrect = selectedKey === q.correctKey;
    expBox.classList.remove('hidden');

    if (isCorrect) {
      expBox.className = "rounded-2xl p-5 bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 space-y-2 shadow-2xl backdrop-blur-xl animate-fade-in";
      document.getElementById('quiz-feedback-icon').className = "p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400";
      document.getElementById('quiz-feedback-icon').innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
      document.getElementById('quiz-feedback-title').innerText = "إجابة صحيحة وممتازة! 🎉";
    } else {
      expBox.className = "rounded-2xl p-5 bg-rose-950/40 border border-rose-500/50 text-rose-200 space-y-2 shadow-2xl backdrop-blur-xl animate-fade-in";
      document.getElementById('quiz-feedback-icon').className = "p-2.5 rounded-xl bg-rose-500/20 text-rose-400";
      document.getElementById('quiz-feedback-icon').innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5"></i>`;
      document.getElementById('quiz-feedback-title').innerText = "إجابة غير صحيحة!";
    }

    document.getElementById('quiz-feedback-diagnosis').innerHTML = `<strong>التفسير العلمي:</strong> ${formatMathText(q.explanation)}`;
    document.getElementById('quiz-feedback-tip').innerText = `الإجابة الصحيحة هي: (${q.correctKey})`;
    
    if (state.audioEnabled && isCorrect) speakText("إجابة صحيحة");
  } else {
    expBox.classList.add('hidden');
  }

  // Navigation Buttons
  document.getElementById('prev-q-btn').disabled = state.currentQuestionIndex === 0;
  if (state.currentQuestionIndex === total - 1) {
    document.getElementById('next-q-btn').innerText = "إنهاء الكويز والنتيجة";
  } else {
    document.getElementById('next-q-btn').innerText = "السؤال التالي";
  }

  if (window.lucide) lucide.createIcons();
}

function selectMCQOption(key) {
  const q = state.quizQuestions[state.currentQuestionIndex];
  state.userAnswers[q.id] = key;
  renderCurrentMCQQuestion();
}

function nextMCQQuestion() {
  const total = state.quizQuestions.length;
  if (state.currentQuestionIndex < total - 1) {
    state.currentQuestionIndex++;
    renderCurrentMCQQuestion();
  } else {
    finishMCQQuiz();
  }
}

function prevMCQQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    renderCurrentMCQQuestion();
  }
}

function finishMCQQuiz() {
  state.quizSubmitted = true;
  stopQuizTimer();

  document.getElementById('quiz-problem-card').classList.add('hidden');
  document.getElementById('quiz-success-card').classList.remove('hidden');

  // Calculate score and collect mistake patterns
  let correctCount = 0;
  const questions = state.quizQuestions;
  const wrongQuestions = [];
  questions.forEach(q => {
    if (state.userAnswers[q.id] === q.correctKey) {
      correctCount++;
    } else {
      wrongQuestions.push(q);
    }
  });

  // Record mistakes into error notebook & sync
  wrongQuestions.forEach(q => {
    const errorItem = {
      id: q.id,
      subject: state.activeSubjectKey || 'linear_algebra',
      question: q.question,
      yourAnswer: state.userAnswers[q.id] || "لم تجب (No Answer)",
      correctAnswer: q.correctKey,
      explanation: q.explanation,
      timestamp: new Date().toISOString()
    };
    recordMistakeInNotebook(errorItem);
  });

  // Sync attempt to Supabase database
  syncQuizAttemptToSupabase({
    subject: state.activeSubjectKey || 'linear_algebra',
    correctCount,
    totalQuestions: questions.length,
    percent: Math.round((correctCount / questions.length) * 100),
    answers: state.userAnswers
  });

  // Re-calculate readiness scores dynamically based on the completed attempt
  loadReadinessData();
  loadUserProfile();

  const percent = Math.round((correctCount / questions.length) * 100);
  document.getElementById('quiz-final-score-percent').innerText = `${percent}%`;
  document.getElementById('quiz-final-score-detail').innerText = `أجبت على ${correctCount} من إجمالي ${questions.length} أسئلة بشكل صحيح`;

  if (window.confetti && percent >= 60) {
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  }

  // Update Next Subject Button
  const currentKey = state.activeSubjectKey || state.selectedSubject || 'linear_algebra';
  const nextKey = getNextSubjectKey(currentKey);
  const nextSubject = SUBJECTS_DATA[nextKey];
  const nextBtn = document.getElementById('quiz-next-subject-btn');
  const nextText = document.getElementById('quiz-next-subject-text');
  if (nextText && nextSubject) {
    nextText.innerHTML = `الانتقال إلى كويز: ${nextSubject.nameEn} (${nextSubject.nameAr})`;
  }
  if (nextBtn) {
    nextBtn.onclick = function() {
      startQuizForSubject(nextKey);
    };
  }

  // Render question-by-question review list
  renderQuizReviewList();
}

function renderQuizReviewList() {
  const container = document.getElementById('quiz-review-list');
  if (!container) return;
  container.innerHTML = '';

  state.quizQuestions.forEach((q, idx) => {
    const userChoice = state.userAnswers[q.id] || "لم تجب (No Answer)";
    const isCorrect = userChoice === q.correctKey;

    const div = document.createElement('div');
    div.className = `p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-2.5 ${isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/30 border-rose-500/40 text-rose-200'} backdrop-blur-md`;
    div.innerHTML = `
      <div class="flex items-center justify-between font-bold">
        <span class="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 text-xs font-mono">Question ${idx + 1}</span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${isCorrect ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/25 text-rose-300 border border-rose-500/40'}">
          ${isCorrect ? 'صحيح ✓ Correct' : 'خطأ ✗ Incorrect'}
        </span>
      </div>
      <div class="font-bold text-slate-100 text-left font-sans text-sm sm:text-base leading-relaxed" dir="ltr">
        ${formatMathText(q.question)}
      </div>
      <div class="text-xs text-slate-300 font-sans flex flex-wrap items-center gap-4 text-left" dir="ltr">
        <span>Your Answer: <strong class="${isCorrect ? 'text-emerald-400' : 'text-rose-400'} font-bold">${userChoice}</strong></span>
        <span>Correct Answer: <strong class="text-emerald-400 font-bold">${q.correctKey}</strong></span>
      </div>
      <div class="text-xs text-slate-300 leading-relaxed pt-2.5 border-t border-slate-800/80 text-right space-y-1" dir="rtl">
        <span class="text-indigo-300 font-bold block flex items-center gap-1.5">
          <i data-lucide="book-open" class="w-3.5 h-3.5 text-indigo-400"></i>
          التفسير والحل الرياضي بالعربية:
        </span>
        <div class="leading-relaxed text-slate-200 font-sans">${formatMathText(q.explanation)}</div>
      </div>
    `;
    container.appendChild(div);
  });
  if (window.lucide) lucide.createIcons();
}

function setQuizMode(mode) {
  state.quizMode = mode;
  const pBtn = document.getElementById('mode-btn-practice');
  const eBtn = document.getElementById('mode-btn-exam');
  const timer = document.getElementById('quiz-timer-container');

  if (mode === 'practice') {
    pBtn.className = "px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black shadow-md transition";
    eBtn.className = "px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-white transition font-bold";
    timer.classList.add('hidden');
    timer.classList.remove('flex');
    stopQuizTimer();
  } else {
    eBtn.className = "px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black shadow-md transition";
    pBtn.className = "px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-white transition font-bold";
    timer.classList.remove('hidden');
    timer.classList.add('flex');
    startQuizTimer();
  }
  renderCurrentMCQQuestion();
}

function startQuizTimer() {
  stopQuizTimer();
  state.quizSecondsRemaining = 600;
  const timerEl = document.getElementById('quiz-timer');

  state.quizTimerInterval = setInterval(() => {
    state.quizSecondsRemaining--;
    const mins = Math.floor(state.quizSecondsRemaining / 60);
    const secs = state.quizSecondsRemaining % 60;
    timerEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (state.quizSecondsRemaining <= 0) {
      stopQuizTimer();
      alert("انتهى وقت الامتحان!");
      finishMCQQuiz();
    }
  }, 1000);
}

function stopQuizTimer() {
  if (state.quizTimerInterval) {
    clearInterval(state.quizTimerInterval);
    state.quizTimerInterval = null;
  }
}

function formatMathText(text) {
  if (!text) return "";
  let formatted = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try {
      return `<div class="my-2 py-1">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`;
    } catch (e) {
      return match;
    }
  });

  formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: false, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  return formatted.replace(/\n/g, '<br>');
}

// ----------------- Profile & Real Activity Engine -----------------
function loadUserProfile() {
  const u = state.user;

  // Real daily activity counter (100% computed from actual activity, no mock numbers)
  try {
    const rawVivas = localStorage.getItem('jooprep_viva_history');
    const vivas = rawVivas ? JSON.parse(rawVivas) : [];
    const todayStr = new Date().toISOString().slice(0, 10);
    u.quota_used_today_viva = vivas.filter(v => (v.created_at || '').slice(0, 10) === todayStr).length;

    const rawPreps = localStorage.getItem('jooprep_prep_sheets');
    const preps = rawPreps ? JSON.parse(rawPreps) : [];
    u.quota_used_today_prep = preps.filter(p => (p.created_at || '').slice(0, 10) === todayStr).length;
  } catch(e) {}

  const headerName = document.getElementById('header-user-name');
  if (headerName) headerName.innerText = u.name;

  const profName = document.getElementById('profile-display-name');
  if (profName) profName.innerText = u.name;

  const profCollege = document.getElementById('profile-display-college');
  if (profCollege) profCollege.innerText = u.college;

  const inpName = document.getElementById('profile-input-name');
  if (inpName) inpName.value = u.name;

  const inpCollege = document.getElementById('profile-input-college');
  if (inpCollege) inpCollege.value = u.college;

  const inpYear = document.getElementById('profile-input-year');
  if (inpYear) inpYear.value = u.academic_year;

  const qv = document.getElementById('quota-viva-text');
  if (qv) qv.innerText = `${u.quota_used_today_viva} / ${u.daily_quota_viva}`;

  const qp = document.getElementById('quota-prep-text');
  if (qp) qp.innerText = `${u.quota_used_today_prep} / ${u.daily_quota_prep}`;
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  state.user.name = document.getElementById('profile-input-name').value;
  state.user.college = document.getElementById('profile-input-college').value;
  state.user.academic_year = document.getElementById('profile-input-year').value;
  localStorage.setItem('jooprep_user_session', JSON.stringify(state.user));
  alert("تم حفظ بيانات الملف الشخصي بنجاح!");
  loadUserProfile();
  updateHeaderAuthUI();
  navigate('dashboard');
}

function loadReadinessData() {
  // 1. Get real quiz attempts from localStorage
  let quizAttempts = [];
  try {
    const rawQuizzes = localStorage.getItem('jooprep_quiz_attempts');
    quizAttempts = rawQuizzes ? JSON.parse(rawQuizzes) : [];
  } catch(e) {}

  // 2. Get real viva history from localStorage
  let vivaSessions = [];
  try {
    const rawVivas = localStorage.getItem('jooprep_viva_history');
    vivaSessions = rawVivas ? JSON.parse(rawVivas) : [];
  } catch(e) {}

  // 3. Get real errors from error notebook
  const errors = getStoredErrors();

  const dialDisplay = document.getElementById('readiness-score-display');
  const levelLabel = document.getElementById('readiness-level-label');
  const statusBadge = document.getElementById('readiness-status-badge');
  const circle = document.getElementById('readiness-gauge-circle');
  const qDisplay = document.getElementById('q-score-display');
  const vDisplay = document.getElementById('v-score-display');
  const studyTopics = document.getElementById('study-first-topics');
  const lastAct = document.getElementById('dashboard-last-activity');

  // If no activity at all yet
  if (quizAttempts.length === 0 && vivaSessions.length === 0) {
    if (dialDisplay) dialDisplay.innerText = '0%';
    if (levelLabel) levelLabel.innerText = 'ابدأ أول كويز لقياس مستواك 🚀';
    if (statusBadge) {
      statusBadge.innerText = 'بانتظار أول تقييم (0%)';
      statusBadge.className = 'text-[11px] px-3 py-1 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700';
    }
    if (circle) {
      circle.style.strokeDashoffset = 251.2;
      circle.setAttribute('class', 'text-slate-800 transition-all duration-1000 ease-out');
    }
    if (qDisplay) qDisplay.innerText = '0%';
    if (vDisplay) vDisplay.innerText = '0%';
    if (studyTopics) studyTopics.innerText = 'لم تبدأ أي كويز بعد. اختر مادة من الأسفل وابدأ الكويز لتحليل مستواك وتحديد نقاط الضعف بدقة.';
    if (lastAct) lastAct.innerText = 'لا يوجد نشاط سابق';

    renderHeatmap([
      { key: 'linear_algebra', label: 'Linear Algebra (الجبر الخطي)', avgScore: 0, status: 'لم يُختبر بعد', count: 0 },
      { key: 'calculus', label: 'Calculus (التفاضل والتكامل)', avgScore: 0, status: 'لم يُختبر بعد', count: 0 },
      { key: 'basic_electric', label: 'Basic Electric (الدوائر الكهربية)', avgScore: 0, status: 'لم يُختبر بعد', count: 0 },
      { key: 'physics', label: 'Physics (الفيزياء الهندسية)', avgScore: 0, status: 'لم يُختبر بعد', count: 0 },
      { key: 'english', label: 'English (اللغة الإنجليزية)', avgScore: 0, status: 'لم يُختبر بعد', count: 0 },
      { key: 'cs_intro', label: 'CS Intro (مقدمة في علوم الحاسب)', avgScore: 0, status: 'لم يُختبر بعد', count: 0 }
    ]);
    return;
  }

  // Calculate real Q (Quiz Accuracy Average)
  let qScore = 0;
  if (quizAttempts.length > 0) {
    const qSum = quizAttempts.reduce((acc, curr) => acc + (Number(curr.percentage) || Number(curr.percent) || 0), 0);
    qScore = Math.round(qSum / quizAttempts.length);
  }

  // Calculate real V (Viva Score Average)
  let vScore = 0;
  if (vivaSessions.length > 0) {
    const vSum = vivaSessions.reduce((acc, curr) => acc + (Number(curr.finalScore) || Number(curr.final_score) || 0), 0);
    vScore = Math.round(vSum / vivaSessions.length);
  }

  // Calculate real R (Readiness Index: R = 0.5 * Q + 0.5 * V)
  let rScore = 0;
  if (quizAttempts.length > 0 && vivaSessions.length > 0) {
    rScore = Math.round(0.5 * qScore + 0.5 * vScore);
  } else if (quizAttempts.length > 0) {
    rScore = qScore;
  } else {
    rScore = vScore;
  }

  if (dialDisplay) dialDisplay.innerText = `${rScore}%`;
  if (qDisplay) qDisplay.innerText = quizAttempts.length > 0 ? `${qScore}%` : '0%';
  if (vDisplay) vDisplay.innerText = vivaSessions.length > 0 ? `${vScore}%` : '0%';

  if (circle) {
    const offset = 251.2 - (251.2 * rScore) / 100;
    circle.style.strokeDashoffset = offset;
    if (rScore >= 75) {
      circle.setAttribute('class', 'text-emerald-500 transition-all duration-1000 ease-out');
    } else if (rScore >= 50) {
      circle.setAttribute('class', 'text-amber-500 transition-all duration-1000 ease-out');
    } else {
      circle.setAttribute('class', 'text-rose-500 transition-all duration-1000 ease-out');
    }
  }

  if (statusBadge && levelLabel) {
    if (rScore >= 85) {
      statusBadge.innerText = 'مستوى ممتاز ومستعد للامتحان 🎓';
      statusBadge.className = 'text-[11px] px-3 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      levelLabel.innerText = 'جاهز للامتحان والمناقشة بامتياز';
    } else if (rScore >= 70) {
      statusBadge.innerText = 'مستوى جيد جداً 📈';
      statusBadge.className = 'text-[11px] px-3 py-1 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      levelLabel.innerText = 'مستوى متقدم — واصل التدريب';
    } else if (rScore >= 50) {
      statusBadge.innerText = 'يحتاج لمزيد من التدريب ⚠️';
      statusBadge.className = 'text-[11px] px-3 py-1 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40';
      levelLabel.innerText = 'مستوى متوسط — راجع الأخطاء';
    } else {
      statusBadge.innerText = 'بحاجة لمراجعة مكثفة 🚨';
      statusBadge.className = 'text-[11px] px-3 py-1 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40';
      levelLabel.innerText = 'مستوى أولي — ركز على التوصيات';
    }
  }

  // Calculate Real Subject Heatmap from user's actual attempts
  const subjectsMap = {
    linear_algebra: { label: "Linear Algebra (الجبر الخطي)", total: 0, count: 0 },
    calculus: { label: "Calculus (التفاضل والتكامل)", total: 0, count: 0 },
    basic_electric: { label: "Basic Electric (الدوائر الكهربية)", total: 0, count: 0 },
    physics: { label: "Physics (الفيزياء الهندسية)", total: 0, count: 0 },
    english: { label: "English (اللغة الإنجليزية)", total: 0, count: 0 },
    cs_intro: { label: "CS Intro (مقدمة في علوم الحاسب)", total: 0, count: 0 }
  };

  quizAttempts.forEach(att => {
    if (subjectsMap[att.subject]) {
      subjectsMap[att.subject].total += (Number(att.percentage) || Number(att.percent) || 0);
      subjectsMap[att.subject].count += 1;
    }
  });

  const heatmapItems = Object.keys(subjectsMap).map(key => {
    const s = subjectsMap[key];
    if (s.count === 0) {
      return { key, label: s.label, avgScore: 0, status: 'لم يُختبر بعد', count: 0 };
    }
    const avg = Math.round(s.total / s.count);
    let st = 'يحتاج تركيز 🚨';
    if (avg >= 80) st = 'ممتاز 🎓';
    else if (avg >= 60) st = 'متوسط 📈';
    return { key, label: s.label, avgScore: avg, status: st, count: s.count };
  });

  renderHeatmap(heatmapItems);

  // Real "ذاكر ده الأول" recommendation
  if (studyTopics) {
    if (errors.length > 0) {
      const errorSubjects = [...new Set(errors.map(e => {
        const s = SUBJECTS_DATA[e.subject];
        return s ? `${s.nameEn} (${s.nameAr})` : e.subject;
      }))];
      studyTopics.innerText = `بناءً على أخطائك المسجلة (${errors.length} أخطاء): ننصحك بالتركيز على مراجعة أسئلة: ${errorSubjects.join(' • ')}`;
    } else {
      const attempted = heatmapItems.filter(h => h.count > 0);
      if (attempted.length > 0) {
        attempted.sort((a, b) => a.avgScore - b.avgScore);
        const lowest = attempted[0];
        if (lowest.avgScore < 80) {
          studyTopics.innerText = `أقل معدل أداء حالي لديك هو في مادة ${lowest.label} بنسبة ${lowest.avgScore}%. ننصحك بإعادة حل كويز هذه المادة لرفع الجاهزية.`;
        } else {
          studyTopics.innerText = `أداؤك متميز في كافة المواد التي اختبرتها حتى الآن! يمكنك تجربة محاكي الشفوي لاختبار نفسك في المعمل.`;
        }
      } else {
        studyTopics.innerText = 'اختر مادة من الأسفل وابدأ الكويز لتحليل مستواك وتحديد الموضوعات الأهم للمذاكرة.';
      }
    }
  }

  // Update last activity date
  if (lastAct) {
    const lastQuiz = quizAttempts[0];
    const lastViva = vivaSessions[0];
    let latestDate = null;
    if (lastQuiz && lastQuiz.created_at) latestDate = new Date(lastQuiz.created_at);
    if (lastViva && lastViva.created_at) {
      const vDate = new Date(lastViva.created_at);
      if (!latestDate || vDate > latestDate) latestDate = vDate;
    }
    if (latestDate) {
      lastAct.innerText = latestDate.toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } else {
      lastAct.innerText = 'اليوم';
    }
  }
}

function renderHeatmap(items) {
  const container = document.getElementById('dashboard-heatmap-container');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(item => {
    const bar = document.createElement('div');
    bar.className = "space-y-1.5";
    
    let colorClass = "bg-slate-700";
    let textClass = "text-slate-400";
    if (item.count > 0) {
      if (item.avgScore >= 80) {
        colorClass = "bg-emerald-500";
        textClass = "text-emerald-400";
      } else if (item.avgScore >= 60) {
        colorClass = "bg-amber-500";
        textClass = "text-amber-400";
      } else {
        colorClass = "bg-rose-500";
        textClass = "text-rose-400";
      }
    }

    bar.innerHTML = `
      <div class="flex items-center justify-between text-xs font-bold">
        <span class="text-slate-200">${item.label}</span>
        <span class="${textClass} font-mono">${item.count > 0 ? `${item.avgScore}% (${item.status})` : item.status}</span>
      </div>
      <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div class="h-full ${colorClass} rounded-full transition-all duration-700" style="width: ${item.count > 0 ? item.avgScore : 0}%"></div>
      </div>
    `;
    container.appendChild(bar);
  });
}

// ----------------- Code Lab & Viva Defense Simulator -----------------

// ----------------- Dynamic Code Viva Engine -----------------
function detectCodeLanguage(code) {
  if (/#include|std::|cout|cin|nullptr/.test(code)) return 'C++';
  if (/def\s+|import\s+|elif\s+|print\(|:\s*$/.test(code)) return 'Python';
  if (/public\s+class|System\.out\.println/.test(code)) return 'Java';
  if (/console\.log|const\s+|let\s+|=>/.test(code)) return 'JavaScript';
  if (/#include\s*<stdio\.h>|printf/.test(code)) return 'C';
  return 'الكود المقدم';
}

function generateDynamicVivaQuestions(code, lang) {
  const hasLoops = /for\s*\(|while\s*\(|for\s+\w+\s+in/.test(code);
  const hasPointersOrNew = /new\s+|malloc|\*|\->|delete\s+/.test(code);

  return [
    `أهلاً بك في مناقشة مشروعك بلغة (${lang}). اشرح باختصار البنية العامة للكود، وتدفق التنفيذ من البداية حتى النهاية.`,
    hasLoops
      ? `لاحظت وجود تكرارات (Loops) في الكود؛ ما هو التعقيد الزمني (Time Complexity) للعمليات بدقة (Big-O)؟ وهل هناك مجال لتحسين الأداء؟`
      : `ما هو التعقيد الحسابي (Big-O) للخوارزمية المنفذة؟ وما هو التعقيد المكاني (Space Complexity) الإضافي؟`,
    hasPointersOrNew
      ? `الكود يستخدم مؤشرات أو تخصيصاً ديناميكياً؛ أين تُحجز هذه المتغيرات في الذاكرة (Stack أم Heap)؟ وكيف تضمن تفادي تسريب الذاكرة (Memory Leak)؟`
      : `كيف تتم إدارة الذاكرة ونطاق المتغيرات (Scope & Lifetime) أثناء تشغيل هذا البرنامج؟`,
    `لو أدخل المستخدم مدخلات سالبة أو غير متوقعة أو مصفوفة فارغة (Edge Cases)، كيف يتعامل كودك مع هذه الحالات لتفادي الانهيار (Runtime Error)؟`,
    `لو طُلب منك إعادة بناء هذا الكود ليعمل في نظام موزع يتحمل ملايين العمليات في الثانية، ما هي هياكل البيانات والتقنيات التي ستعتمدها؟`
  ];
}

function insertSampleCode() {
  const sample = `// مشروع شجرة البحث الثنائية وتطبيق خوارزميات الترتيب
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BinarySearchTree {
private:
    Node* root;
    void insertHelper(Node*& node, int val) {
        if (node == nullptr) {
            node = new Node(val);
            return;
        }
        if (val < node->data) insertHelper(node->left, val);
        else insertHelper(node->right, val);
    }

public:
    BinarySearchTree() : root(nullptr) {}
    void insert(int val) {
        insertHelper(root, val);
    }
};

int main() {
    BinarySearchTree bst;
    bst.insert(50);
    bst.insert(30);
    bst.insert(70);
    cout << "Binary Search Tree initialized." << endl;
    return 0;
}`;
  document.getElementById('viva-code-input').value = sample;
  document.getElementById('code-line-counter').innerText = `${sample.split('\n').length} سطر`;
}

function startVivaSession() {
  const code = document.getElementById('viva-code-input').value.trim();
  if (!code) {
    alert("من فضلك الصق كود مشروعك أولاً!");
    return;
  }

  const personaRadio = document.querySelector('input[name="viva-persona"]:checked');
  state.vivaPersona = personaRadio ? personaRadio.value : 'strict_ta';
  state.vivaLanguage = document.getElementById('viva-language-select').value;
  state.vivaLevel = parseInt(document.getElementById('viva-level-select').value, 10);
  
  // Real dynamic analysis of student code
  const lang = detectCodeLanguage(code);
  state.vivaLangName = lang;
  state.vivaQuestionsList = generateDynamicVivaQuestions(code, lang);
  state.vivaCurrentTurn = 1;
  state.vivaScores = [];

  const personaNames = {
    strict_ta: { name: "ممتحن تقني متخصص", avatar: "👨‍🏫", tone: "فحص دقيق للأخطاء الصامتة وحالات الحافة وتسريب الذاكرة", welcome: `أهلاً بك. تم فحص الكود البرمجي المقدم (${lang})، وسنبدأ جلسة المناقشة الآن. يرجى التركيز وتقديم تبريرات علمية وخوارزمية دقيقة.` },
    academic_prof: { name: "أستاذ أكاديمي", avatar: "🎓", tone: "تحليل نظري معمق للتعقيد الحسابي وهياكل البيانات والمفاضلة الخوارزمية", welcome: `مرحباً بك يا مهندس. سنناقش الآن المبادئ العلمية وخوارزميات الكود المكتوب بـ (${lang}) لقياس استيعابك الأكاديمي المكتسب.` },
    friendly_ta: { name: "مدرب تفاعلي", avatar: "🤝", tone: "توجيه تدريجي وإرشادات علمية داعمة", welcome: `أهلاً يا بطل! كودك بلغة (${lang}) جاهز وممتاز. لا تقلق، هدفنا نتدرب معاً على طريقة التفكير العلمي والمناقشة بثقة.` },
    surprise_doc: { name: "لجنة تقييم متقدمة", avatar: "⚡", tone: "سيناريوهات تطبيقية وتحديات معقدة في بيئات الإنتاج", welcome: `أهلاً بك. سنختبر الآن أداء كودك (${lang}) واستقراره تحت ضغط السيناريوهات العملية المعقدة والـ Edge Cases.` }
  };

  const p = personaNames[state.vivaPersona] || personaNames.strict_ta;

  document.getElementById('viva-setup-screen').classList.add('hidden');
  document.getElementById('viva-active-screen').classList.remove('hidden');
  document.getElementById('viva-report-screen').classList.add('hidden');

  document.getElementById('viva-active-avatar').innerText = p.avatar;
  document.getElementById('viva-active-name').innerText = p.name;
  document.getElementById('viva-active-tone').innerText = p.tone;
  document.getElementById('viva-turn-counter').innerText = `دور 1 من ${state.vivaMaxTurns}`;
  document.getElementById('viva-current-score').innerText = `--/10`;

  const stream = document.getElementById('viva-dialogue-stream');
  stream.innerHTML = '';

  addExaminerMessage(p.welcome);
  setTimeout(() => {
    addExaminerQuestion(state.vivaQuestionsList[0], `${lang} — الهيكل العام`);
  }, 900);
}

function addExaminerMessage(msg) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-examiner p-4 sm:p-5 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl border-l-4 border-l-purple-500 shadow-xl animate-fade-in";
  div.innerHTML = `
    <span class="font-black text-purple-400 block mb-1">الممتحن:</span>
    <div class="leading-relaxed">${msg}</div>
  `;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
  if (state.audioEnabled) speakText(msg);
}

function addExaminerQuestion(question, topic) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-examiner p-4 sm:p-5 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl border-l-4 border-l-purple-500 shadow-xl animate-fade-in";
  div.innerHTML = `
    <div class="flex items-center justify-between text-[11px] text-purple-300 mb-2 font-sans">
      <span class="font-black flex items-center gap-1.5"><i data-lucide="help-circle" class="w-3.5 h-3.5"></i>سؤال المناقشة (${state.vivaCurrentTurn}):</span>
      <span class="bg-purple-950/70 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-purple-500/25">${topic || 'فحص الكود'}</span>
    </div>
    <div class="text-white text-sm sm:text-base leading-relaxed">${question}</div>
  `;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
  if (window.lucide) lucide.createIcons();
  if (state.audioEnabled) speakText(question);
}

function addStudentAnswerBubble(answer) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-student p-4 sm:p-5 text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-2xl mr-auto ml-0 border-r-4 border-r-indigo-400 shadow-xl animate-fade-in";
  div.innerHTML = `
    <span class="font-black text-indigo-300 block mb-1">إجابتك:</span>
    <div class="leading-relaxed">${answer}</div>
  `;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
}

function submitVivaTurn() {
  const inputEl = document.getElementById('viva-student-answer');
  const answer = inputEl.value.trim();
  if (!answer) {
    alert("من فضلك اكتب إجابتك أو تبريرك لسؤال الممتحن.");
    return;
  }

  addStudentAnswerBubble(answer);
  inputEl.value = '';

  const thinking = document.getElementById('viva-thinking-indicator');
  thinking.classList.remove('hidden');

  setTimeout(() => {
    thinking.classList.add('hidden');
    
    // Real dynamic scoring of student response based on substantive depth & keywords
    const words = answer.split(/\s+/).filter(Boolean).length;
    const techKeywords = ['big-o', 'stack', 'heap', 'memory', 'leak', 'loop', 'complexity', 'edge case', 'ذاكرة', 'تعقيد', 'مصفوفة', 'حالات حافة', 'كفاءة', 'pointer', 'مؤشر', 'تحسين', 'نطاق', 'دالة', 'خوارزمية', 'استدعاء', 'تزامن'];
    const matchedKeywords = techKeywords.filter(k => answer.toLowerCase().includes(k)).length;

    let turnScore = 5.0;
    let verdict = 'partial';
    let critique = '';
    let missing = [];

    if (words >= 15 && matchedKeywords >= 2) {
      turnScore = 9.5;
      verdict = 'correct';
      critique = 'إجابة متميزة وشاملة! استخدمت المصطلحات التقنية بدقة وفسرت منطق العمل وإدارة الذاكرة.';
    } else if (words >= 8 || matchedKeywords >= 1) {
      turnScore = 7.5;
      verdict = 'partial';
      critique = 'إجابة جيدة ووصلت للفكرة، لكن كان ينقصك توضيح التعقيد الحسابي بدقة وتأثيره على الأداء.';
      missing = ["تأصيل التعقيد الحسابي المباشر", "توضيح معالجة الـ Edge Cases"];
    } else {
      turnScore = 3.5;
      verdict = 'wrong';
      critique = 'إجابة مقتضبة جداً، احرص على استخدام المصطلحات العلمية وتبرير خياراتك البرمجية بالتفصيل.';
      missing = ["الإجابة المباشرة على السؤال", "المصطلحات التقنية المفسرة للحل"];
    }

    const nextQ = state.vivaCurrentTurn < state.vivaMaxTurns ? state.vivaQuestionsList[state.vivaCurrentTurn] : null;

    const evalRes = {
      score: turnScore,
      verdict: verdict,
      critique: critique,
      missing: missing,
      nextQuestion: nextQ,
      topic: `${state.vivaLangName || 'الكود'} — دور ${state.vivaCurrentTurn}`,
      isLastTurn: state.vivaCurrentTurn >= state.vivaMaxTurns
    };

    state.vivaScores.push(evalRes.score);
    renderTurnCritique(evalRes);

    const avg = (state.vivaScores.reduce((a, b) => a + b, 0) / state.vivaScores.length).toFixed(1);
    document.getElementById('viva-current-score').innerText = `${avg}/10`;

    if (evalRes.isLastTurn || !evalRes.nextQuestion) {
      setTimeout(() => finishVivaSession(), 1500);
    } else {
      state.vivaCurrentTurn++;
      document.getElementById('viva-turn-counter').innerText = `دور ${state.vivaCurrentTurn} من ${state.vivaMaxTurns}`;
      setTimeout(() => {
        addExaminerQuestion(evalRes.nextQuestion, evalRes.topic);
      }, 1000);
    }
  }, 800);
}

function renderTurnCritique(evalRes) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  
  let badgeColor = "bg-rose-500/20 text-rose-300 border-rose-500/30";
  let verdictLabel = "إجابة غير مكتملة";
  if (evalRes.verdict === 'correct') {
    badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    verdictLabel = "إجابة مقنعة وممتازة";
  } else if (evalRes.verdict === 'partial') {
    badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
    verdictLabel = "إجابة جزئية";
  }

  let missingHtml = "";
  if (evalRes.missing && evalRes.missing.length > 0) {
    missingHtml = `
      <div class="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <span class="text-rose-400 font-black">نقاط كانت ناقصة في إجابتك:</span>
        <ul class="list-disc list-inside mt-0.5 space-y-0.5">
          ${evalRes.missing.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  div.className = "p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 max-w-2xl space-y-1.5 shadow-md animate-fade-in";
  div.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-bold text-slate-200">تقييم الممتحن للدور:</span>
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badgeColor}">${verdictLabel}</span>
        <span class="font-black text-indigo-400 font-mono">${evalRes.score}/10</span>
      </div>
    </div>
    <p class="leading-relaxed text-slate-200">${evalRes.critique}</p>
    ${missingHtml}
  `;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
}

function finishVivaSession() {
  // Real calculated score from actual scores across turns (No mock/default 82%)
  const avg = state.vivaScores.length > 0 
    ? Math.round((state.vivaScores.reduce((a, b) => a + b, 0) / state.vivaScores.length) * 10)
    : 0;

  const rep = {
    overallScore: avg,
    badge: avg >= 85 ? "جاهز بامتياز للمناقشة 🎓" : (avg >= 65 ? "أداء جيد ومستوى متوسط 📈" : "يحتاج لمزيد من التدريب ⚠️"),
    verdictMessage: avg >= 85
      ? "أداء متميز يعكس استيعابك الكامل لمنطق الكود وتسلسل التنفيذ وكفاءة الخوارزمية."
      : (avg >= 65
          ? "أداء جيد ولديك فهم لآلية عمل الكود، مع الحاجة لتعميق الشرح واستخدام مصطلحات علمية أوضح في الـ Edge Cases."
          : "تحتاج إلى مراجعة أسس إدارة الذاكرة وحساب التعقيد الحسابي بدقة قبل دخول المناقشة الفعلية."),
    strengths: avg >= 65
      ? ["استيعاب منطق الكود وتسلسل التنفيذ", "القدرة على توضيح الهدف من العمليات البرمجية", "استخدام مصطلحات علمية في التبرير"]
      : ["المحاولة والمشاركة في الإجابة عن الأسئلة البرمجية"],
    weaknesses: avg < 85
      ? ["التردد عند السؤال عن التعقيد الحسابي بدقة (Big-O)", "إغفال حالات الحافة (Edge Cases) وإدارة الذاكرة"]
      : [],
    reviewTopics: ["حساب Big-O Notation بدقة", "معالجة حالات الحافة والـ Exceptions", "إدارة الذاكرة ونطاق المتغيرات"]
  };

  document.getElementById('viva-active-screen').classList.add('hidden');
  document.getElementById('viva-report-screen').classList.remove('hidden');

  document.getElementById('report-final-score').innerText = `${rep.overallScore}%`;
  document.getElementById('report-badge').innerText = rep.badge;
  document.getElementById('report-verdict-message').innerText = rep.verdictMessage;

  document.getElementById('report-strengths-list').innerHTML = rep.strengths.map(s => `<li>${s}</li>`).join('');
  document.getElementById('report-weaknesses-list').innerHTML = rep.weaknesses.map(w => `<li>${w}</li>`).join('');
  document.getElementById('report-review-topics').innerHTML = rep.reviewTopics.map(t => 
    `<span class="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">${t}</span>`
  ).join('');

  if (window.confetti && rep.overallScore >= 70) {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  }

  // Sync viva session to Supabase and LocalStorage
  syncVivaSessionToSupabase({
    persona: state.vivaPersona,
    codeSnippet: document.getElementById('viva-code-input') ? document.getElementById('viva-code-input').value : '',
    finalScore: rep.overallScore,
    feedback: rep.verdictMessage
  });

  // Re-calculate real readiness scores and profile quotas immediately!
  loadUserProfile();
  loadReadinessData();
}

function finishVivaSessionEarly() {
  if (confirm("هل تريد إنهاء المناقشة الآن وتوليد التقرير الختامي بالدرجات الحالية؟")) {
    finishVivaSession();
  }
}

function resetVivaToSetup() {
  document.getElementById('viva-setup-screen').classList.remove('hidden');
  document.getElementById('viva-active-screen').classList.add('hidden');
  document.getElementById('viva-report-screen').classList.add('hidden');
}

function toggleSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("خاصية الإدخال الصوتي غير مدعومة في متصفحك الحالي، يمكنك الكتابة في المربع مباشرة.");
    return;
  }
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRec();
  recognition.lang = state.vivaLanguage === 'en' ? 'en-US' : 'ar-EG';
  recognition.interimResults = false;

  const btn = document.getElementById('mic-record-btn');
  btn.className = "p-2.5 rounded-xl bg-rose-600 text-white animate-pulse transition";

  recognition.onresult = (e) => {
    document.getElementById('viva-student-answer').value += ` ${e.results[0][0].transcript}`;
  };
  recognition.onend = () => {
    btn.className = "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition";
  };
  recognition.start();
}

// ----------------- Smart Prep Sheet (10 Trap Questions) -----------------
function loadLatestPrepSheet() {
  const questions = [
    { category: "التعقيد الحسابي (Big-O)", question: "ما هو التعقيد الزمني والمكاني للبرنامج ككل؟", trapReason: "قياس فهم الطالب للتعقيد الحسابي وحساب عدد العمليات بالنسبة لحجم المدخلات N.", modelAnswer: "التعقيد الزمني هو O(N) والمكاني O(1) إضافي ما لم نستخدم مصفوفات ديناميكية." },
    { category: "إدارة الذاكرة (Memory)", question: "أين تُخزن المتغيرات المحلية؟ وما الفرق بين الـ Stack والـ Heap؟", trapReason: "التمييز بين الذاكرة التلقائية (Stack) والذاكرة الديناميكية (Heap).", modelAnswer: "المتغيرات العادية تُحجز على الـ Stack تلقائياً، بينما new تحجز على الـ Heap ويلزم تحريرها بـ delete لتجنب تسريب الذاكرة." },
    { category: "حالات الحافة (Edge Cases)", question: "ماذا يحدث إذا مرر المستخدم مدخلات فارغة أو قيماً سالبة؟", trapReason: "التحقق من قدرة البرنامج على معالجة المدخلات الاستثنائية والحالات الحدية (Edge Cases).", modelAnswer: "يجب وضع فحص حماية (Guard Condition) في بداية الدالة للتحقق من أن القيم سليمة وإرجاع كود خطأ." },
    { category: "المؤشرات (Pointers)", question: "هل قمت بتمرير المعاملات بالقيمة أم بالمرجع؟ ولماذا؟", trapReason: "فهم كفاءة الذاكرة وتكلفة نسخ البيانات الكبيرة عند التمرير.", modelAnswer: "استخدمت Pass by Reference لتجنب إنشاء نسخة مكلفة في الذاكرة وتسريع الأداء مع حماية البيانات بـ const." },
    { category: "هياكل البيانات (Data Structures)", question: "لماذا اخترت هذه البنية بالتحديد دون غيرها؟", trapReason: "قياس الوعي المعماري والمفاضلة بين سرعة البحث والإدراج والاستهلاك المكاني.", modelAnswer: "اخترت هذا الهيكل لأن العمليات تتطلب وصولاً مباشراً بالفهرس O(1)." },
    { category: "البدائل التصميمية (Design)", question: "لو طلبنا منك تحويل الدالة من Recursion إلى Loops عادية، كيف ستفعلها؟", trapReason: "استيعاب ميكانيكية استدعاء الدوال وتجنب فيضان الذاكرة Stack Overflow.", modelAnswer: "سنستخدم حلقة while مع مكدس يدوي لتخزين الحالات لتوفير استهلاك ذاكرة النظام." },
    { category: "الأمان والاستقرار (Sanitization)", question: "كيف يتصرف البرنامج لو أدخل المستخدم نصاً في خانة رقم صحيح؟", trapReason: "معالجة أخطاء الإدخال غير المتوقعة وحماية تدفق البرنامج.", modelAnswer: "يتم التحقق من حالة الإدخال وتطهير الـ buffer وطباعة رسالة توجيهية للمستخدم." },
    { category: "العتاد والكاش (Hardware)", question: "كيف يؤثر ترتيب قراءة عناصر المصفوفة على كفاءة الـ Cache؟", trapReason: "فهم مبدأ المحلية المكانية (Spatial Locality) وكفاءة استغلال ذاكرة التخزين المؤقت Cache.", modelAnswer: "القراءة صفاً صفاً في مصفوفات C++ تستفيد من خطوط الكاش وتقلل الـ Cache Misses." },
    { category: "التوسع (Scalability)", question: "لو تضاعفت كمية البيانات من 1000 عنصر إلى 100 مليون، ما التعديل اللازم؟", trapReason: "القدرة على تصميم خوارزميات تتوسع لمعالجة البيانات الضخمة.", modelAnswer: "سنحتاج لمعالجة متدفقة (Chunking) مع خوارزميات الذاكرة الخارجية والتوزيع المتوازي." },
    { category: "الكود النظيف (Clean Code)", question: "ماذا يعني مبدأ المسؤولية الواحدة (SRP) في دوالك؟", trapReason: "الالتزام بقواعد كتابة الكود النظيف وقابلية الصيانة والتطوير.", modelAnswer: "كل دالة تؤدي مهمة واحدة محددة ومستقلة، وأسماء المتغيرات معبرة ذاتياً (Self-documenting)." }
  ];

  const container = document.getElementById('prep-sheet-questions-container');
  if (!container) return;
  container.innerHTML = '';

  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = "rounded-3xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 space-y-3.5 shadow-xl hover:border-slate-700 transition backdrop-blur-xl animate-fade-in";
    card.innerHTML = `
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <span class="text-xs font-black text-indigo-400 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-xs font-bold border border-indigo-500/30">${idx + 1}</span>
          ${q.category}
        </span>
        <span class="text-[10px] text-slate-500 font-mono">سؤال تقني متقدم</span>
      </div>
      <div><h4 class="font-black text-white text-sm sm:text-base leading-relaxed">${q.question}</h4></div>
      <div class="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
        <strong class="text-amber-400 block mb-1 font-black">🎯 الهدف الأكاديمي من السؤال:</strong>
        ${q.trapReason}
      </div>
      <div class="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
        <strong class="text-emerald-400 block mb-1 font-black">🎯 الإجابة النموذجية الموصى بها:</strong>
        ${q.modelAnswer}
      </div>
    `;
    container.appendChild(card);
  });
}

function generatePrepSheetForCode() {
  const code = document.getElementById('viva-code-input') ? document.getElementById('viva-code-input').value.trim() : '';
  const lang = detectCodeLanguage(code);

  // Log generation in prep sheets history for real daily quota calculation
  try {
    const raw = localStorage.getItem('jooprep_prep_sheets');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({ id: 'prep_' + Date.now(), lang, created_at: new Date().toISOString() });
    localStorage.setItem('jooprep_prep_sheets', JSON.stringify(list.slice(0, 30)));
  } catch(e) {}

  loadLatestPrepSheet();
  loadUserProfile();
  navigate('prep-sheet');
}

// ----------------- Error Notebook -----------------
function getStoredErrors() {
  try {
    const raw = localStorage.getItem('jooprep_error_notebook');
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}

function recordMistakeInNotebook(errItem) {
  try {
    const errors = getStoredErrors();
    const existingIndex = errors.findIndex(e => e.id === errItem.id);
    if (existingIndex >= 0) {
      errors[existingIndex] = errItem;
    } else {
      errors.unshift(errItem);
    }
    localStorage.setItem('jooprep_error_notebook', JSON.stringify(errors.slice(0, 100)));
    syncErrorToSupabase(errItem);
  } catch(e) {
    console.warn('Error recording mistake:', e);
  }
}

function clearAllErrors() {
  if (confirm("هل تريد تفريغ ومسح جميع سجلات دفتر الأخطاء؟")) {
    localStorage.removeItem('jooprep_error_notebook');
    loadErrorNotebook();
  }
}

function loadErrorNotebook() {
  const container = document.getElementById('error-notebook-items-container');
  if (!container) return;

  const errors = getStoredErrors();
  if (!errors || errors.length === 0) {
    container.innerHTML = `
      <div class="glass-card p-8 sm:p-12 text-center space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <i data-lucide="check-circle-2" class="w-7 h-7"></i>
        </div>
        <h4 class="font-black text-white text-base sm:text-lg">دفتر الأخطاء نظيف تماماً! 👏</h4>
        <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          أي أسئلة تخطئ فيها في الكويزات أو مناقشات الشفوي ستُسجل هنا تلقائياً وتتزامن مع قاعدة بيانات Supabase لتعيد مراجعتها وحلها قبل دخول الامتحان.
        </p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = `
    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
      <div class="text-xs font-bold text-slate-300">
        تم رصد <span class="text-rose-400 font-mono font-bold">${errors.length}</span> سؤال يحتاج مراجعة:
      </div>
      <button onclick="clearAllErrors()" class="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        <span>تفريغ السجل</span>
      </button>
    </div>
  `;

  errors.forEach((err, idx) => {
    const subj = SUBJECTS_DATA[err.subject] || { nameEn: err.subject || 'General', nameAr: 'عام' };
    const card = document.createElement('div');
    card.className = "glass-card p-5 space-y-3 border-rose-500/30 bg-rose-950/10";
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            خطأ #${idx + 1}
          </span>
          <span class="text-xs font-bold text-slate-300 font-mono">
            ${subj.nameEn} (${subj.nameAr})
          </span>
        </div>
        <span class="text-[10px] text-slate-500 font-mono">
          ${new Date(err.timestamp || Date.now()).toLocaleDateString('ar-EG')}
        </span>
      </div>
      <div class="font-bold text-slate-100 text-left font-sans text-sm sm:text-base leading-relaxed" dir="ltr">
        ${formatMathText(err.question)}
      </div>
      <div class="flex flex-wrap items-center gap-4 text-xs font-sans text-left" dir="ltr">
        <span>إجابتك المسجلة: <strong class="text-rose-400 font-bold">${err.yourAnswer}</strong></span>
        <span>الإجابة الصحيحة: <strong class="text-emerald-400 font-bold">${err.correctAnswer}</strong></span>
      </div>
      <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed text-right space-y-1" dir="rtl">
        <span class="text-indigo-300 font-bold flex items-center gap-1.5">
          <i data-lucide="help-circle" class="w-3.5 h-3.5 text-indigo-400"></i>
          سبب الخطأ والشرح الأكاديمي:
        </span>
        <div class="leading-relaxed text-slate-200 font-sans">${formatMathText(err.explanation)}</div>
      </div>
    `;
    container.appendChild(card);
  });
  if (window.lucide) lucide.createIcons();
}


// ============================================================================
// Supabase Database & Authentication Engine (صابابا بيز)
// ============================================================================

const SUPABASE_CONFIG = {
  url: "https://orkkywadwtowixbfdnby.supabase.co",
  key: "sb_publishable_Qa9dPkIrUw0zYC5-qEy45w_6khXdv-l"
};

let supabaseClient = null;

function initSupabaseClient() {
  const url = localStorage.getItem('jooprep_supabase_url') || SUPABASE_CONFIG.url;
  const key = localStorage.getItem('jooprep_supabase_key') || SUPABASE_CONFIG.key;

  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log('Supabase connected successfully to:', url);
    } catch(err) {
      console.error('Error creating Supabase client:', err);
      supabaseClient = null;
    }
  }
  return supabaseClient;
}

// ----------------- Auth UI Switching -----------------
function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const regForm = document.getElementById('auth-register-form');
  const loginTabBtn = document.getElementById('auth-tab-btn-login');
  const regTabBtn = document.getElementById('auth-tab-btn-register');
  const title = document.getElementById('auth-main-title');
  const alertEl = document.getElementById('auth-alert');

  if (alertEl) alertEl.classList.add('hidden');

  if (tab === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (regForm) regForm.classList.add('hidden');
    if (loginTabBtn) loginTabBtn.className = 'flex-1 py-2.5 rounded-xl transition font-black bg-blue-600 text-white shadow-md flex items-center justify-center gap-2';
    if (regTabBtn) regTabBtn.className = 'flex-1 py-2.5 rounded-xl transition font-bold text-slate-400 hover:text-white flex items-center justify-center gap-2';
    if (title) title.innerText = 'بوابة تسجيل الدخول والأكاديميا';
  } else {
    if (loginForm) loginForm.classList.add('hidden');
    if (regForm) regForm.classList.remove('hidden');
    if (regTabBtn) regTabBtn.className = 'flex-1 py-2.5 rounded-xl transition font-black bg-blue-600 text-white shadow-md flex items-center justify-center gap-2';
    if (loginTabBtn) loginTabBtn.className = 'flex-1 py-2.5 rounded-xl transition font-bold text-slate-400 hover:text-white flex items-center justify-center gap-2';
    if (title) title.innerText = 'إنشاء حساب طالب جديد';
  }
}

function showAuthAlert(message, type = 'error') {
  const alertEl = document.getElementById('auth-alert');
  if (!alertEl) return;
  alertEl.classList.remove('hidden');
  if (type === 'error') {
    alertEl.className = 'p-3.5 rounded-xl text-xs font-bold space-y-1 bg-rose-950/40 border border-rose-500/40 text-rose-300';
    alertEl.innerHTML = `<div class="flex items-center gap-2"><i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i><span>${message}</span></div>`;
  } else {
    alertEl.className = 'p-3.5 rounded-xl text-xs font-bold space-y-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300';
    alertEl.innerHTML = `<div class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i><span>${message}</span></div>`;
  }
  if (window.lucide) lucide.createIcons();
}

function applyUserSession(userData) {
  state.user = {
    ...state.user,
    ...userData,
    isLoggedIn: true
  };
  localStorage.setItem('jooprep_user_session', JSON.stringify(state.user));
  loadUserProfile();
  updateHeaderAuthUI();
}

function updateHeaderAuthUI() {
  const authBtn = document.getElementById('header-auth-btn');
  const profileGroup = document.getElementById('header-profile-group');
  const nameEl = document.getElementById('header-user-name');
  const avatarEl = document.getElementById('header-user-avatar');

  const navAuth = document.getElementById('nav-authenticated-tabs');
  const navVisitor = document.getElementById('nav-visitor-tabs');
  const mobAuth = document.getElementById('mob-nav-authenticated');
  const mobVisitor = document.getElementById('mob-nav-visitor');

  if (state.user && state.user.isLoggedIn) {
    if (authBtn) authBtn.classList.add('hidden');
    if (profileGroup) profileGroup.classList.remove('hidden');
    if (nameEl) nameEl.innerText = state.user.name || 'طالب الأكاديميا';
    if (avatarEl) {
      const initial = (state.user.name && state.user.name.trim().charAt(0)) || 'ط';
      avatarEl.innerText = initial;
    }

    if (navAuth) navAuth.classList.remove('hidden');
    if (navVisitor) navVisitor.classList.add('hidden');
    if (mobAuth) mobAuth.classList.remove('hidden');
    if (mobVisitor) mobVisitor.classList.add('hidden');
  } else {
    if (authBtn) authBtn.classList.remove('hidden');
    if (profileGroup) profileGroup.classList.add('hidden');

    if (navAuth) navAuth.classList.add('hidden');
    if (navVisitor) navVisitor.classList.remove('hidden');
    if (mobAuth) mobAuth.classList.add('hidden');
    if (mobVisitor) mobVisitor.classList.remove('hidden');
  }
}
async function checkAuthSession() {
  // 1. Check local session storage first
  const stored = localStorage.getItem('jooprep_user_session');
  let hasValidSession = false;
  if (stored) {
    try {
      const u = JSON.parse(stored);
      if (u && u.isLoggedIn) {
        state.user = { ...state.user, ...u, isLoggedIn: true };
        hasValidSession = true;
      }
    } catch(e) {}
  }

  // 2. If Supabase is connected, verify active auth session
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (!error && data && data.session && data.session.user) {
        const suUser = data.session.user;
        applyUserSession({
          id: suUser.id,
          email: suUser.email,
          name: suUser.user_metadata?.full_name || suUser.email.split('@')[0],
          college: suUser.user_metadata?.college || 'كلية الحاسبات والمعلومات',
          academic_year: suUser.user_metadata?.academic_year || 'الفرقة الأولى',
          isLoggedIn: true
        });
        hasValidSession = true;
        if (state.activeView === 'landing' || !state.activeView) {
          navigate('dashboard');
        }
        return;
      }
    } catch(e) {
      console.warn('Supabase auth session check notice:', e);
    }
  }

  updateHeaderAuthUI();

  if (hasValidSession) {
    loadUserProfile();
    if (state.activeView === 'landing' || !state.activeView) {
      navigate('dashboard');
    }
  } else {
    state.user.isLoggedIn = false;
    navigate('landing');
  }
}

window.requireAuthToFeature = function(featureName) {
  showToast(`يجب تسجيل الدخول أولاً للوصول إلى ${featureName} 🔒`, 'error');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 750);
};

window.loginAsDemoGuest = function() {
  applyUserSession({
    id: 'guest_' + Date.now(),
    name: 'طالب هندسة تجريبي',
    email: 'student@jooprep.edu',
    college: 'كلية الحاسبات والمعلومات',
    academic_year: 'الفرقة الأولى',
    isLoggedIn: true
  });
  showToast('مرحباً بك! تم تفعيل وضع الطالب التجريبي بنجاح 🎉');
  navigate('dashboard');
};

window.logoutUser = async function() {
  localStorage.removeItem('jooprep_user_session');
  state.user = {
    id: null,
    email: '',
    name: 'طالب حاسبات وهندسة',
    college: 'كلية الحاسبات والمعلومات',
    academic_year: 'الفرقة الأولى',
    quota_used_today_viva: 0,
    daily_quota_viva: 5,
    quota_used_today_prep: 0,
    daily_quota_prep: 10,
    isLoggedIn: false
  };

  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
    } catch(e) {}
  }

  updateHeaderAuthUI();
  navigate('landing');
  showToast('تم تسجيل الخروج بنجاح 👋');
};


// ----------------- Login Handler -----------------
async function handleAuthLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const submitBtn = document.getElementById('login-submit-btn');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> جاري التحقق من الحساب...';
  }

  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        showAuthAlert(`بيانات الدخول غير صحيحة: ${error.message}`, 'error');
        return;
      }

      if (data && data.user) {
        const suUser = data.user;
        applyUserSession({
          id: suUser.id,
          email: suUser.email,
          name: suUser.user_metadata?.full_name || suUser.email.split('@')[0],
          college: suUser.user_metadata?.college || 'كلية الحاسبات والمعلومات',
          academic_year: suUser.user_metadata?.academic_year || 'الفرقة الأولى',
          isLoggedIn: true
        });
        showAuthAlert('تم تسجيل الدخول بنجاح! مرحباً بعودتك.', 'success');
        setTimeout(() => navigate('dashboard'), 600);
      }
    } else {
      // Local session
      applyUserSession({
        id: 'local_user_' + Date.now(),
        email: email,
        name: email.split('@')[0],
        college: 'كلية الحاسبات والمعلومات',
        academic_year: 'الفرقة الأولى',
        isLoggedIn: true
      });
      showAuthAlert('تم تسجيل الدخول بنجاح!', 'success');
      setTimeout(() => navigate('dashboard'), 600);
    }
  } catch(err) {
    showAuthAlert(`حدث خطأ أثناء الاتصال: ${err.message}`, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i><span>دخول إلى الحساب</span>';
      if (window.lucide) lucide.createIcons();
    }
  }
}

// ----------------- Registration Handler -----------------
async function handleAuthRegister(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const college = document.getElementById('reg-college').value.trim();
  const year = document.getElementById('reg-year').value;
  const password = document.getElementById('reg-password').value;
  const submitBtn = document.getElementById('reg-submit-btn');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> جاري إنشاء الحساب...';
  }

  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            college: college,
            academic_year: year
          }
        }
      });

      if (error) {
        showAuthAlert(`فشل إنشاء الحساب: ${error.message}`, 'error');
        return;
      }

      const userObj = {
        id: (data.user && data.user.id) || ('user_' + Date.now()),
        email: email,
        name: name,
        college: college,
        academic_year: year,
        isLoggedIn: true
      };

      applyUserSession(userObj);
      showAuthAlert('تم إنشاء الحساب بنجاح في قاعدة بيانات Supabase! جاري تحويلك للرئيسية...', 'success');
      setTimeout(() => navigate('dashboard'), 800);
    } else {
      applyUserSession({
        id: 'local_reg_' + Date.now(),
        email: email,
        name: name,
        college: college,
        academic_year: year,
        isLoggedIn: true
      });
      showAuthAlert('تم إنشاء الحساب بنجاح! جاري تحويلك...', 'success');
      setTimeout(() => navigate('dashboard'), 800);
    }
  } catch(err) {
    showAuthAlert(`حدث خطأ غير متوقع: ${err.message}`, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="user-check" class="w-4 h-4"></i><span>إنشاء الحساب ومزامنة البيانات</span>';
      if (window.lucide) lucide.createIcons();
    }
  }
}

// ----------------- Guest Demo Mode Handler -----------------
function handleGuestDemoLogin() {
  applyUserSession({
    id: 'demo_guest_student',
    email: 'guest.student@jooprep.edu',
    name: 'طالب تجريبي — ضيف الأكاديميا',
    college: 'كلية الحاسبات والذكاء الاصطناعي',
    academic_year: 'الفرقة الأولى',
    quota_used_today_viva: 0,
    daily_quota_viva: 10,
    quota_used_today_prep: 0,
    daily_quota_prep: 20,
    isLoggedIn: true
  });
  showAuthAlert('مرحباً بك! تم تفعيل الوضع التجريبي السريع.', 'success');
  setTimeout(() => navigate('dashboard'), 500);
}

// ----------------- Logout Handler -----------------
async function handleAuthLogout() {
  if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج؟")) {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch(e) {}
    }
    localStorage.removeItem('jooprep_user_session');
    state.user.isLoggedIn = false;
    state.user.name = 'طالب حاسبات وهندسة';
    updateHeaderAuthUI();
    loadUserProfile();
    navigate('auth');
  }
}

// ----------------- Supabase Data Sync Handlers -----------------
async function syncQuizAttemptToSupabase(attempt) {
  const attempts = JSON.parse(localStorage.getItem('jooprep_quiz_attempts') || '[]');
  attempts.unshift({ ...attempt, created_at: new Date().toISOString() });
  localStorage.setItem('jooprep_quiz_attempts', JSON.stringify(attempts.slice(0, 50)));

  if (supabaseClient && state.user && state.user.isLoggedIn && state.user.id) {
    try {
      await supabaseClient.from('quiz_attempts').insert([{
        user_id: state.user.id,
        subject: attempt.subject,
        score: attempt.correctCount,
        total_questions: attempt.totalQuestions,
        percentage: attempt.percent,
        answers: attempt.answers || {}
      }]);
    } catch(e) {}
  }
}

async function syncVivaSessionToSupabase(session) {
  const history = JSON.parse(localStorage.getItem('jooprep_viva_history') || '[]');
  history.unshift({ ...session, created_at: new Date().toISOString() });
  localStorage.setItem('jooprep_viva_history', JSON.stringify(history.slice(0, 30)));

  if (supabaseClient && state.user && state.user.isLoggedIn && state.user.id) {
    try {
      await supabaseClient.from('viva_history').insert([{
        user_id: state.user.id,
        persona: session.persona,
        code_snippet: session.codeSnippet || '',
        final_score: session.finalScore || 0,
        feedback: session.feedback || ''
      }]);
    } catch(e) {}
  }
}

async function syncErrorToSupabase(errorItem) {
  if (supabaseClient && state.user && state.user.isLoggedIn && state.user.id) {
    try {
      await supabaseClient.from('error_notebook').insert([{
        user_id: state.user.id,
        subject: errorItem.subject || '',
        question_text: errorItem.question || '',
        student_answer: errorItem.yourAnswer || '',
        correct_answer: errorItem.correctAnswer || '',
        explanation: errorItem.explanation || ''
      }]);
    } catch(e) {}
  }
}


// ----------------- Google (Gmail) OAuth Login -----------------
async function handleGoogleLogin() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        showAuthAlert(`تعذر الاتصال بـ Google: ${error.message}`, 'error');
      }
    } catch(err) {
      showAuthAlert(`حدث خطأ أثناء الاتصال بـ Google: ${err.message}`, 'error');
    }
  } else {
    showAuthAlert('جاري توجيهك إلى تسجيل الدخول عبر Google...', 'success');
  }
}
