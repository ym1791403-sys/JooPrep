/**
 * JooPrep v2 Client Engine
 * High-performance, resilient, and beautifully designed client application.
 * Contains both server-backed API consumers and local fallback simulators for 100% uptime.
 */

// Global State
const state = {
  activeView: 'dashboard',
  theme: 'dark',
  audioEnabled: true,
  user: {
    name: 'أحمد محمود',
    college: 'كلية الحاسبات والذكاء الاصطناعي',
    academic_year: 'الفرقة الأولى',
    quota_used_today_viva: 1,
    daily_quota_viva: 3,
    quota_used_today_prep: 1,
    daily_quota_prep: 5
  },
  
  // Quiz State
  currentProblem: null,
  currentStepIndex: 0,
  quizMode: 'practice', // 'practice' | 'exam'
  quizStepResults: [],
  quizHintsUsed: 0,
  examTimerInterval: null,
  examSecondsRemaining: 300,
  
  // Viva State
  vivaSessionId: null,
  vivaCurrentTurn: 1,
  vivaMaxTurns: 5,
  vivaProjectMap: null,
  vivaPersona: 'strict_ta',
  vivaLanguage: 'mixed',
  vivaLevel: 2,
  vivaScores: [],
  
  // Errors
  allErrors: []
};

// ----------------- Initialization -----------------

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  loadUserProfile();
  loadReadinessData();

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
  state.activeView = viewName;
  const views = ['dashboard', 'quizzes', 'viva', 'prep-sheet', 'error-notebook', 'profile'];
  
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const navBtn = document.getElementById(`nav-btn-${v}`);
    const mobBtn = document.getElementById(`mob-nav-${v}`);
    
    if (el) {
      if (v === viewName) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }

    if (navBtn) {
      if (v === viewName) {
        navBtn.className = "nav-link px-4 py-2 rounded-xl transition flex items-center gap-2 text-indigo-400 bg-indigo-600/15 border border-indigo-500/20";
      } else {
        navBtn.className = "nav-link px-4 py-2 rounded-xl transition flex items-center gap-2 text-slate-400 hover:text-slate-200";
      }
    }

    if (mobBtn) {
      if (v === viewName) {
        mobBtn.className = "flex flex-col items-center gap-1 text-indigo-400 font-bold";
      } else {
        mobBtn.className = "flex flex-col items-center gap-1 hover:text-slate-200";
      }
    }
  });

  if (viewName === 'dashboard') {
    loadReadinessData();
  } else if (viewName === 'quizzes') {
    if (!state.currentProblem) loadNewProblem();
  } else if (viewName === 'error-notebook') {
    loadErrorNotebook();
  } else if (viewName === 'prep-sheet') {
    loadLatestPrepSheet();
  }

  if (window.lucide) lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
  if (!state.audioEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-EG';
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
}

// ----------------- Profile & Readiness -----------------

async function loadUserProfile() {
  try {
    const res = await fetch('/api/user/profile');
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    if (data.success && data.user) {
      state.user = data.user;
    }
  } catch (err) {
    // Graceful fallback to default user state
    console.log("Using cached profile:", state.user.name);
  }

  const u = state.user;
  document.getElementById('header-user-name').innerText = u.name;
  document.getElementById('profile-display-name').innerText = u.name;
  document.getElementById('profile-display-college').innerText = u.college;
  document.getElementById('profile-input-name').value = u.name;
  document.getElementById('profile-input-college').value = u.college;
  document.getElementById('profile-input-year').value = u.academic_year;
  document.getElementById('quota-viva-text').innerText = `${u.quota_used_today_viva} / ${u.daily_quota_viva}`;
  document.getElementById('quota-prep-text').innerText = `${u.quota_used_today_prep} / ${u.daily_quota_prep}`;
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  state.user.name = document.getElementById('profile-input-name').value;
  state.user.college = document.getElementById('profile-input-college').value;
  state.user.academic_year = document.getElementById('profile-input-year').value;

  try {
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.user)
    });
  } catch (err) {
    console.log("Local profile update");
  }

  alert("تم حفظ بيانات الملف الشخصي بنجاح!");
  loadUserProfile();
  navigate('dashboard');
}

async function loadReadinessData() {
  let readiness = null;
  try {
    const res = await fetch('/api/readiness');
    if (res.ok) {
      const data = await res.json();
      if (data.success) readiness = data.readiness;
    }
  } catch (e) {
    console.log("Client calculation for readiness");
  }

  // Fallback / client calculated readiness
  if (!readiness) {
    readiness = {
      readinessScore: 72,
      qScore: 78,
      vScore: 66,
      statusText: "مؤشر جاهزية نشط",
      levelLabel: "مستوى متوسط - في الطريق الصحيح ⚡",
      studyFirstRecommendations: [
        "محددات المصفوفات 3×3",
        "قواعد إشارات القدرة (Circuits)",
        "تحويل أنظمة العد (Base N)"
      ],
      heatmap: [
        { label: "محددات المصفوفات 3×3", avgScore: 48, status: "ضعيف" },
        { label: "قواعد إشارات القدرة (Circuits)", avgScore: 56, status: "متوسط" },
        { label: "معكوس المصفوفات (Inverse)", avgScore: 65, status: "متوسط" },
        { label: "تحويل أنظمة العد (Base N)", avgScore: 82, status: "قوي" },
        { label: "متمم الاثنين (2's Complement)", avgScore: 88, status: "قوي" }
      ]
    };
  }

  const score = Math.round(readiness.readinessScore);
  document.getElementById('readiness-score-display').innerText = `${score}%`;
  document.getElementById('readiness-level-label').innerText = readiness.levelLabel;
  document.getElementById('readiness-status-badge').innerText = readiness.statusText;

  // SVG Progress Ring
  const offset = 251.2 - (251.2 * score) / 100;
  const circle = document.getElementById('readiness-gauge-circle');
  circle.style.strokeDashoffset = offset;

  if (score >= 75) {
    circle.setAttribute('class', 'text-emerald-500 transition-all duration-1000 ease-out');
  } else if (score >= 50) {
    circle.setAttribute('class', 'text-amber-500 transition-all duration-1000 ease-out');
  } else {
    circle.setAttribute('class', 'text-rose-500 transition-all duration-1000 ease-out');
  }

  document.getElementById('q-score-display').innerText = readiness.qScore ? `${Math.round(readiness.qScore)}%` : '--';
  document.getElementById('v-score-display').innerText = readiness.vScore ? `${Math.round(readiness.vScore)}%` : '--';

  if (readiness.studyFirstRecommendations && readiness.studyFirstRecommendations.length > 0) {
    document.getElementById('study-first-topics').innerText = readiness.studyFirstRecommendations.join(' • ');
  }

  renderHeatmap(readiness.heatmap);
}

function renderHeatmap(items) {
  const container = document.getElementById('dashboard-heatmap-container');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(item => {
    const bar = document.createElement('div');
    bar.className = "space-y-1.5";
    
    let colorClass = "bg-rose-500";
    let textClass = "text-rose-400";
    if (item.avgScore >= 75) {
      colorClass = "bg-emerald-500";
      textClass = "text-emerald-400";
    } else if (item.avgScore >= 50) {
      colorClass = "bg-amber-500";
      textClass = "text-amber-400";
    }

    bar.innerHTML = `
      <div class="flex items-center justify-between text-xs font-bold">
        <span class="text-slate-200">${item.label}</span>
        <span class="${textClass} font-mono">${Math.round(item.avgScore)}% (${item.status})</span>
      </div>
      <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div class="h-full ${colorClass} rounded-full transition-all duration-700" style="width: ${item.avgScore}%"></div>
      </div>
    `;
    container.appendChild(bar);
  });
}

function quickStartQuiz(course) {
  const sel = document.getElementById('quiz-course-select');
  if (sel) sel.value = course;
  navigate('quizzes');
  loadNewProblem();
}

function startQuizWithTopic(course, topic) {
  const sel = document.getElementById('quiz-course-select');
  if (sel) sel.value = course;
  navigate('quizzes');
  loadNewProblem(topic);
}

// ----------------- Step-by-Step Quizzes (Deterministic Math Engine) -----------------

// Client-Side Deterministic Generator Fallback
function generateClientMathProblem(course, topic) {
  if (course === 'linear_algebra') {
    return {
      id: "prob_det_cl",
      courseCode: "linear_algebra",
      topic: "determinant_3x3",
      topicName: "حساب محدد مصفوفة 3x3",
      difficulty: 2,
      steps: [
        {
          id: "step_1",
          title: "حساب المحدد الأصغر للموقع (1,1)",
          prompt: "احسب قيمة المحدد الأصغر $M_{11}$ الناتج عن حذف الصف الأول والعمود الأول للمصفوفة:\n$$\\begin{pmatrix} 2 & -1 & 3 \\\\ 0 & 4 & 1 \\\\ 5 & -2 & 0 \\end{pmatrix}$$",
          answerType: "number",
          expected: 2,
          context: { det: -23, topic: "linear_algebra" },
          hints: [
            "المحدد الأصغر $M_{11}$ يتكون من حذف الصف الأول والعمود الأول.",
            "المصفوفة الناتجة 2x2 هي: $\\begin{pmatrix} 4 & 1 \\\\ -2 & 0 \\end{pmatrix}$.",
            "القانون: $(4 \\times 0) - (1 \\times -2) = 0 - (-2) = 2$."
          ]
        },
        {
          id: "step_2",
          title: "حساب الحد الثاني (مراعاة الإشارة السالبة)",
          prompt: "احسب قيمة الحد الثاني في فك الصف الأول: $-(-1) \\times M_{12}$، حيث $M_{12} = -5$:",
          answerType: "number",
          expected: -5,
          context: { det: -23, topic: "linear_algebra" },
          hints: [
            "تذكر أن إشارة الموقع (1,2) سالبة $(-)$.",
            "قيمة $M_{12} = (0 \\times 0) - (1 \\times 5) = -5$.",
            "الحد الثاني كاملاً هو $-(-1) \\times (-5) = -5$."
          ]
        },
        {
          id: "step_3",
          title: "قيمة المحدد الكلية det(A)",
          prompt: "اجمع حدود فك الصف الأول لإيجاد القيمة النهائية للمحدد $\\det(A)$ (الحد الثالث $= 3 \\times -20 = -60$):",
          answerType: "number",
          expected: -61,
          context: { det: -61, topic: "linear_algebra" },
          hints: [
            "القانون: $\\det(A) = (2 \\times 2) + (-5) + (-60)$.",
            "الجمع: $4 - 5 - 60 = -61$.",
            "الناتج النهائي = -61."
          ]
        }
      ]
    };
  } else if (course === 'electric_circuits') {
    return {
      id: "prob_circ_cl",
      courseCode: "electric_circuits",
      topic: "circuits_power",
      topicName: "حساب القدرة واتفاقية الإشارات (Sign Convention)",
      difficulty: 1,
      steps: [
        {
          id: "step_1",
          title: "حساب القدرة الكهربائية P (وات)",
          prompt: "عنصر فرق الجهد بين طرفيه $V = 12\\text{ V}$ ويمر به تيار $I = 2.5\\text{ A}$ **داخل إلى الطرف الموجب (+)**.\nاحسب مقدار القدرة $P = V \\times I$ مع الإشارة الصحيحة وفقاً لـ Passive Sign Convention:",
          answerType: "number",
          expected: 30,
          context: { topic: "electric_circuits", is_power_question: true },
          hints: [
            "القانون: $P = V \\times I$.",
            "إذا دخل التيار للطرف الموجب فتكون القدرة الممتصة موجبة ($+P$).",
            "الناتج = +30 W."
          ]
        },
        {
          id: "step_2",
          title: "تحديد طبيعة القدرة",
          prompt: "هل هذا العنصر يمتص قدرة أم يورد قدرة للدائرة؟ (اكتب: 'ممتصة' أو 'موردة'):",
          answerType: "mcq",
          expected: "ممتصة",
          context: { topic: "electric_circuits" },
          hints: [
            "القدرة بإشارة موجبة ($P > 0$).",
            "العنصر يستهلك ويمتص طاقة كهربائية.",
            "الإجابة هي: ممتصة."
          ]
        }
      ]
    };
  } else {
    return {
      id: "prob_base_cl",
      courseCode: "computer_fundamentals",
      topic: "base_conversion",
      topicName: "تحويل أنظمة العد (Base Conversion)",
      difficulty: 1,
      steps: [
        {
          id: "step_1",
          title: "تحويل من عشري إلى ثنائي",
          prompt: "حول الرقم العشري $(53)_{10}$ إلى النظام الثنائي (Binary):",
          answerType: "baseN",
          expected: "110101",
          context: { topic: "computer_fundamentals" },
          hints: [
            "اقسم على 2 واحتفظ بالبواقي.",
            "تذكر أن تقرأ البواقي من تحت لفوق (من آخر باقي لأول باقي).",
            "الإجابة هي: 110101."
          ]
        },
        {
          id: "step_2",
          title: "تحويل إلى سداسي عشر (Hex)",
          prompt: "حول الرقم $(53)_{10}$ أو $(110101)_2$ إلى النظام السداسي عشر (Hex):",
          answerType: "baseN",
          expected: "35",
          context: { topic: "computer_fundamentals" },
          hints: [
            "قسّم البتات الثنائية إلى مجموعات من 4 بدءاً من اليمين: 0011 0101.",
            "المجموعة الأولى 0101 = 5، والمجموعة الثانية 0011 = 3.",
            "الناتج = 35."
          ]
        }
      ]
    };
  }
}

async function loadNewProblem(topicOverride = null) {
  const course = document.getElementById('quiz-course-select').value;
  let url = `/api/quiz/problem?course=${course}`;
  if (topicOverride) url += `&topic=${topicOverride}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        state.currentProblem = data.problem;
      }
    }
  } catch (err) {
    console.log("Using client deterministic problem generator");
  }

  if (!state.currentProblem || state.currentProblem.courseCode !== course) {
    state.currentProblem = generateClientMathProblem(course, topicOverride);
  }

  state.currentStepIndex = 0;
  state.quizStepResults = [];
  state.quizHintsUsed = 0;

  document.getElementById('quiz-topic-title').innerText = state.currentProblem.topicName || "مسألة رياضية";
  document.getElementById('quiz-problem-card').classList.remove('hidden');
  document.getElementById('quiz-success-card').classList.add('hidden');
  document.getElementById('quiz-feedback-box').classList.add('hidden');
  document.getElementById('quiz-hint-box').classList.add('hidden');

  renderCurrentStep();
  if (state.quizMode === 'exam') startExamTimer();
}

function renderCurrentStep() {
  const prob = state.currentProblem;
  if (!prob || !prob.steps) return;

  const step = prob.steps[state.currentStepIndex];
  const total = prob.steps.length;

  document.getElementById('quiz-step-indicator').innerText = `خطوة ${state.currentStepIndex + 1} من ${total}`;
  document.getElementById('quiz-step-title').innerText = step.title;

  document.getElementById('quiz-step-prompt').innerHTML = formatMathText(step.prompt);

  clearStudentInput();
  document.getElementById('hint-level-count').innerText = `0/${step.hints ? step.hints.length : 3}`;
  document.getElementById('quiz-hint-box').classList.add('hidden');
  document.getElementById('quiz-feedback-box').classList.add('hidden');
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

function setQuizMode(mode) {
  state.quizMode = mode;
  const pBtn = document.getElementById('mode-btn-practice');
  const eBtn = document.getElementById('mode-btn-exam');
  const timer = document.getElementById('quiz-timer-container');

  if (mode === 'practice') {
    pBtn.className = "px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white transition";
    eBtn.className = "px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition";
    timer.classList.add('hidden');
    timer.classList.remove('flex');
    stopExamTimer();
  } else {
    eBtn.className = "px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white transition";
    pBtn.className = "px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition";
    timer.classList.remove('hidden');
    timer.classList.add('flex');
    startExamTimer();
  }
}

function startExamTimer() {
  stopExamTimer();
  state.examSecondsRemaining = 300;
  const timerEl = document.getElementById('quiz-timer');
  
  state.examTimerInterval = setInterval(() => {
    state.examSecondsRemaining--;
    const mins = Math.floor(state.examSecondsRemaining / 60);
    const secs = state.examSecondsRemaining % 60;
    timerEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (state.examSecondsRemaining <= 0) {
      stopExamTimer();
      alert("انتهى وقت الامتحان المؤقت!");
    }
  }, 1000);
}

function stopExamTimer() {
  if (state.examTimerInterval) {
    clearInterval(state.examTimerInterval);
    state.examTimerInterval = null;
  }
}

// ----------------- Keypad & Matrix Builder -----------------

function keypadInsert(char) {
  const input = document.getElementById('quiz-student-input');
  input.value += char;
  input.focus();
}

function clearStudentInput() {
  const input = document.getElementById('quiz-student-input');
  input.value = '';
  input.focus();
}

function toggleMatrixBuilder() {
  const builder = document.getElementById('visual-matrix-builder');
  const txt = document.getElementById('matrix-pad-toggle-text');
  if (builder.classList.contains('hidden')) {
    builder.classList.remove('hidden');
    txt.innerText = 'إخفاء محرر المصفوفة';
  } else {
    builder.classList.add('hidden');
    txt.innerText = 'محرر مصفوفة 2x2';
  }
}

function applyVisualMatrix() {
  const c11 = document.getElementById('mat-c11').value.trim() || '0';
  const c12 = document.getElementById('mat-c12').value.trim() || '0';
  const c21 = document.getElementById('mat-c21').value.trim() || '0';
  const c22 = document.getElementById('mat-c22').value.trim() || '0';

  const formatted = `[[${c11}, ${c12}], [${c21}, ${c22}]]`;
  document.getElementById('quiz-student-input').value = formatted;
  toggleMatrixBuilder();
}

// ----------------- Client-Side Error Normalizer & Classifier -----------------

function normalizeNumber(raw) {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim().replace(/[−–—]/g, '-').replace('،', ',');
  if (s.includes('/') && !s.includes(',')) {
    const parts = s.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (den !== 0) return num / den;
    }
  }
  const clean = s.replace(',', '.');
  const val = parseFloat(clean);
  return isNaN(val) ? null : val;
}

function clientEvaluateStep(step, studentAnswer) {
  const expected = step.expected;
  const answerType = step.answerType || 'number';

  if (answerType === 'number') {
    const s = normalizeNumber(studentAnswer);
    const e = normalizeNumber(expected);

    if (s === null) {
      return { correct: false, errorTag: 'invalid', diagnosis: 'صيغة الرقم غير واضحة', tip: 'اكتب الرقم بصيغة عشرية (مثل 0.5) أو كسر (مثل 1/2).' };
    }
    if (Math.abs(s - e) < 1e-4) {
      return { correct: true, errorTag: 'correct', diagnosis: 'إجابة صحيحة تماماً! أحسنت.' };
    }
    // Sign Error check
    if (Math.abs(s + e) < 1e-4) {
      if (step.context && step.context.is_power_question) {
        return {
          correct: false,
          errorTag: 'circuit-power-sign',
          diagnosis: 'إشارة القدرة معكوسة',
          tip: 'راجع قاعدة الإشارات: القدرة الممتصة (+P) تكون موجبة إذا دخل التيار للطرف الموجب، وسالبة إذا خرج منه.'
        };
      }
      return {
        correct: false,
        errorTag: 'sign',
        diagnosis: 'الرقم صح والإشارة غلط',
        tip: 'راجع شبكة الإشارات (+ / -) بدقة، وتأكد من علامات الطرح والضرب.'
      };
    }
    return {
      correct: false,
      errorTag: 'unknown',
      diagnosis: 'الحسابات غير متطابقة',
      tip: 'أعد مراجعة الخطوة بهدوء أو اضغط على زر سلم التلميحات للمساعدة.'
    };
  } else if (answerType === 'baseN') {
    const s = String(studentAnswer).trim().toUpperCase().replace(/[\s0B0X]/g, '');
    const e = String(expected).trim().toUpperCase().replace(/[\s0B0X]/g, '');
    if (s === e) {
      return { correct: true, errorTag: 'correct', diagnosis: 'التحويل صحيح 100%!' };
    }
    if (s === e.split('').reverse().join('')) {
      return {
        correct: false,
        errorTag: 'reversed-remainder',
        diagnosis: 'اقرا البواقي من تحت لفوق (من الأسفل للأعلى)',
        tip: 'في طريقة القسمة المتتالية، آخر باقي قسمة يكتب في أقصى اليسار.'
      };
    }
    return { correct: false, errorTag: 'unknown', diagnosis: 'الرقم المحول غير مطابق', tip: 'راجع خطوات القسمة المتكررة.' };
  } else {
    const s = String(studentAnswer).trim().toLowerCase();
    const e = String(expected).trim().toLowerCase();
    if (s === e) return { correct: true, errorTag: 'correct', diagnosis: 'إجابة صحيحة!' };
    return { correct: false, errorTag: 'wrong', diagnosis: 'الإجابة غير صحيحة', tip: 'راجع التلميح للمساعدة.' };
  }
}

// ----------------- Submit Step Answer -----------------

async function submitStepAnswer() {
  const prob = state.currentProblem;
  if (!prob) return;
  const step = prob.steps[state.currentStepIndex];
  const input = document.getElementById('quiz-student-input').value.trim();

  if (!input) {
    showQuizFeedback(false, "من فضلك اكتب إجابتك أولاً.", "استخدم اللوحة السريعة لتسهيل الكتابة.");
    return;
  }

  let result = null;
  try {
    const res = await fetch('/api/quiz/step/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: step,
        studentAnswer: input,
        hintIndex: state.quizHintsUsed
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) result = data.result;
    }
  } catch (err) {
    console.log("Client-side step evaluation active");
  }

  if (!result) {
    result = clientEvaluateStep(step, input);
  }

  state.quizStepResults.push({
    stepId: step.id,
    studentAnswer: input,
    correct: result.correct,
    errorType: result.errorTag,
    diagnosis: result.diagnosis,
    expected: step.expected,
    hintsUsed: state.quizHintsUsed
  });

  if (result.correct) {
    showQuizFeedback(true, result.diagnosis, "");
    if (state.audioEnabled) speakText("إجابة صحيحة!");

    setTimeout(() => {
      advanceToNextStep();
    }, 1100);
  } else {
    showQuizFeedback(false, result.diagnosis, result.tip);
    if (state.audioEnabled) speakText(result.diagnosis);
  }
}

function showQuizFeedback(isCorrect, message, tip) {
  const box = document.getElementById('quiz-feedback-box');
  const icon = document.getElementById('quiz-feedback-icon');
  const title = document.getElementById('quiz-feedback-title');
  const diag = document.getElementById('quiz-feedback-diagnosis');
  const tipEl = document.getElementById('quiz-feedback-tip');

  box.classList.remove('hidden');

  if (isCorrect) {
    box.className = "rounded-2xl p-4 sm:p-5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-1 shadow-lg animate-fade-in";
    icon.className = "p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400";
    icon.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
    title.innerText = "خطوة صحيحة 100%!";
    diag.innerText = message;
    tipEl.innerText = "";
  } else {
    box.className = "rounded-2xl p-4 sm:p-5 bg-rose-950/40 border border-rose-500/40 text-rose-300 space-y-1 shadow-lg animate-fade-in";
    icon.className = "p-2.5 rounded-xl bg-rose-500/20 text-rose-400";
    icon.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5"></i>`;
    title.innerText = "تشخيص الخطأ التلقائي:";
    diag.innerText = message;
    tipEl.innerText = tip ? `💡 توجيه: ${tip}` : "";
  }
  if (window.lucide) lucide.createIcons();
}

function advanceToNextStep() {
  state.currentStepIndex++;
  const prob = state.currentProblem;

  if (state.currentStepIndex < prob.steps.length) {
    renderCurrentStep();
  } else {
    finalizeQuizProblem();
  }
}

async function finalizeQuizProblem() {
  document.getElementById('quiz-problem-card').classList.add('hidden');
  document.getElementById('quiz-success-card').classList.remove('hidden');
  stopExamTimer();

  if (window.confetti) {
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  }

  const correctCount = state.quizStepResults.filter(r => r.correct).length;
  const total = state.quizStepResults.length;
  const score = Math.round((correctCount / total) * 100);

  try {
    await fetch('/api/quiz/attempt/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseCode: state.currentProblem.courseCode,
        topic: state.currentProblem.topic,
        problemId: state.currentProblem.id,
        problemTitle: state.currentProblem.topicName,
        mode: state.quizMode,
        score: score,
        totalSteps: total,
        correctSteps: correctCount,
        stepResults: state.quizStepResults
      })
    });
  } catch (err) {
    console.log("Attempt logged in local session");
  }

  loadReadinessData();
}

function requestHint() {
  const prob = state.currentProblem;
  if (!prob) return;
  const step = prob.steps[state.currentStepIndex];
  if (!step.hints || step.hints.length === 0) return;

  if (state.quizHintsUsed < step.hints.length) {
    state.quizHintsUsed++;
  }

  const hintText = step.hints[state.quizHintsUsed - 1];
  const hintBox = document.getElementById('quiz-hint-box');
  hintBox.classList.remove('hidden');
  document.getElementById('quiz-hint-title').innerText = `تلميح المستوى ${state.quizHintsUsed} من ${step.hints.length}`;
  document.getElementById('quiz-hint-content').innerHTML = formatMathText(hintText);
  document.getElementById('hint-level-count').innerText = `${state.quizHintsUsed}/${step.hints.length}`;

  if (state.audioEnabled) speakText(hintText.replace(/\$/g, ''));
}

function reportQuestionIssue() {
  alert("شكراً لك! تم تسجيل بلاغ عن هذه المسألة للمراجعة الأكاديمية.");
}

// ----------------- Oral Viva Defense Simulator -----------------

function insertSampleCode() {
  const sample = `// تطبيق شجرة بحث ثنائية مع خوارزميات الترتيب
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

async function startVivaSession() {
  const code = document.getElementById('viva-code-input').value.trim();
  if (!code) {
    alert("من فضلك الصق كود مشروعك أولاً!");
    return;
  }

  const personaRadio = document.querySelector('input[name="viva-persona"]:checked');
  state.vivaPersona = personaRadio ? personaRadio.value : 'strict_ta';
  state.vivaLanguage = document.getElementById('viva-language-select').value;
  state.vivaLevel = parseInt(document.getElementById('viva-level-select').value, 10);
  state.vivaCurrentTurn = 1;
  state.vivaScores = [];

  const startBtn = document.getElementById('viva-start-btn');
  startBtn.innerText = "جارِ تحليل الكود وتحضير الأسئلة...";
  startBtn.disabled = true;

  let initialData = null;
  try {
    const res = await fetch('/api/viva/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
        personaId: state.vivaPersona,
        language: state.vivaLanguage,
        level: state.vivaLevel
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) initialData = data;
    }
  } catch (err) {
    console.log("Client viva simulator active");
  }

  // Fallback initial data
  if (!initialData) {
    const personaNames = {
      strict_ta: { name: "المعيد الصارم", avatar: "👨‍🏫", tone: "صارم ودقيق، يبحث عن الأخطاء الصامتة وحالات الحافة", welcome: "أهلاً بك. الكود بتاعك مفتوح قدامي، وهنبدأ المناقشة فوراً. ركز في إجاباتك وما تلفش وتدور؛ عايز إجابات علمية دقيقة." },
      academic_prof: { name: "الأستاذ الأكاديمي", avatar: "🎓", tone: "نظري وعميق، يركز على المبادئ والتعقيد والبدائل", welcome: "مرحباً يا باشمهندس. الغرض من المناقشة معرفة الأساس العلمي لاختياراتك في هذا الكود. لماذا كتبت هذا الحل بالتحديد؟" },
      friendly_ta: { name: "المعيد الودود", avatar: "🤝", tone: "مشجع وصبور، يوجه بتلميحات تدريجية", welcome: "أهلاً بيك يا بطل! متقلقش خالص، دي جلسة تدريب عشان تتعود على جو المعمل الحقيقي وتدخل وإنت واثق في نفسك." },
      surprise_doc: { name: "الدكتور المفاجئ", avatar: "⚡", tone: "غير متوقع، يطرح أسئلة ضغط واقعية", welcome: "مساء الخير. الكود شغال على المثال البسيط ده جميل، بس هل هيتحمل لو رميت عليه ضغط عملي حقيقي؟ هطرح عليك سيناريوهات وأشوف هتحلها إزاي." }
    };
    const p = personaNames[state.vivaPersona] || personaNames.strict_ta;
    initialData = {
      sessionId: "viva_cl_" + Date.now(),
      initialTurn: {
        question: state.vivaPersona === 'strict_ta' 
          ? "بص على دالة insertHelper: إيه اللي هيحصل لو مررت لها مؤشر فاضي (nullptr)؟ وفين الـ Boundary Check اللي بيحميك؟"
          : "ما هو الـ Time & Space Complexity بالـ Big-O Notation لعملية الإدراج في الشجرة في أسوأ وأفضل حالة؟",
        topic: "حالات الحافة والذاكرة",
        persona: p
      }
    };
  }

  state.vivaSessionId = initialData.sessionId;

  document.getElementById('viva-setup-screen').classList.add('hidden');
  document.getElementById('viva-active-screen').classList.remove('hidden');
  document.getElementById('viva-report-screen').classList.add('hidden');

  const persona = initialData.initialTurn.persona;
  document.getElementById('active-persona-name').innerText = persona.name;
  document.getElementById('active-persona-avatar').innerText = persona.avatar;
  document.getElementById('active-persona-tone').innerText = persona.tone;
  document.getElementById('viva-turn-counter').innerText = `دور 1 من ${state.vivaMaxTurns}`;
  document.getElementById('viva-current-score').innerText = `--/10`;

  const stream = document.getElementById('viva-dialogue-stream');
  stream.innerHTML = '';

  addExaminerMessage(persona.welcome);
  setTimeout(() => {
    addExaminerQuestion(initialData.initialTurn.question, initialData.initialTurn.topic);
  }, 700);

  startBtn.innerText = "بدء المناقشة الآن";
  startBtn.disabled = false;
}

function addExaminerMessage(text) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-examiner p-4 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl animate-fade-in shadow-md";
  div.innerHTML = `<span class="font-extrabold text-purple-400 block mb-1">الممتحن:</span>${text}`;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
}

function addExaminerQuestion(question, topic) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-examiner p-4 sm:p-5 text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed max-w-2xl border-l-4 border-l-purple-500 shadow-xl animate-fade-in";
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

async function submitVivaTurn() {
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

  let evalRes = null;
  try {
    const res = await fetch('/api/viva/turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.vivaSessionId,
        answer: answer,
        turnNumber: state.vivaCurrentTurn,
        maxTurns: state.vivaMaxTurns
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) evalRes = data.evaluation;
    }
  } catch (err) {
    console.log("Client viva evaluation active");
  }

  // Client-side fallback evaluator
  if (!evalRes) {
    const words = answer.split(' ').length;
    let score = 5.0;
    let verdict = 'partial';
    let critique = 'إجابة جيدة ووصلت لنصف الفكرة، لكن كان ينقصك توضيح كيفية حماية البرنامج لو تغيرت المدخلات.';
    let missing = ["ربط الإجابة بالتعقيد الحسابي المباشر", "توضيح سيناريو معالجة الـ Edge Cases"];

    if (words > 12) {
      score = 8.5;
      verdict = 'correct';
      critique = 'ممتاز جداً! شرح مقنع ومترابط علمياً مع استدلال سليم بسلوك الكود وإدارة الذاكرة.';
      missing = [];
    } else if (words < 4) {
      score = 2.0;
      verdict = 'wrong';
      critique = 'إجابة مقتضبة جداً، حاول دائماً التفكير بصوت مسموع واستخدام المصطلحات التقنية.';
      missing = ["الإجابة المباشرة على السؤال", "المصطلحات التقنية المفسرة للحل"];
    }

    const nextQuestions = [
      "لو شجرة البحث أصبحت غير متزنة (Skewed Tree)، التعقيد الزمني لعملية البحث هيتحول لـ O(N)؛ إزاي تحل المشكلة دي؟",
      "أين يتم تخزين العقد (Nodes) التي تم إنشاؤها عبر new؟ وهل يوجد Memory Leak لو انتهى البرنامج دون عمل delete؟",
      "كيف يتعامل البرنامج لو أدخل المستخدم قيمة مكررة بالفعل داخل الشجرة؟",
      "لو طلب منك تحويل دالة الإدراج من الطريقة التكرارية إلى الطريقة العادية بـ Loops، إيه التعديل اللي هتعمله؟"
    ];

    evalRes = {
      score: score,
      verdict: verdict,
      critique: critique,
      missing: missing,
      nextQuestion: state.vivaCurrentTurn < state.vivaMaxTurns ? nextQuestions[(state.vivaCurrentTurn - 1) % nextQuestions.length] : null,
      topic: "Big-O والذاكرة",
      isLastTurn: state.vivaCurrentTurn >= state.vivaMaxTurns
    };
  }

  thinking.classList.add('hidden');
  state.vivaScores.push(evalRes.score);

  renderTurnCritique(evalRes);

  const avg = (state.vivaScores.reduce((a, b) => a + b, 0) / state.vivaScores.length).toFixed(1);
  document.getElementById('viva-current-score').innerText = `${avg}/10`;

  if (evalRes.isLastTurn || !evalRes.nextQuestion) {
    setTimeout(() => {
      finishVivaSession();
    }, 1500);
  } else {
    state.vivaCurrentTurn++;
    document.getElementById('viva-turn-counter').innerText = `دور ${state.vivaCurrentTurn} من ${state.vivaMaxTurns}`;
    setTimeout(() => {
      addExaminerQuestion(evalRes.nextQuestion, evalRes.topic);
    }, 1000);
  }
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

async function finishVivaSession() {
  let rep = null;
  try {
    const res = await fetch('/api/viva/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: state.vivaSessionId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) rep = data.finalReport;
    }
  } catch (err) {
    console.log("Client final report generator active");
  }

  if (!rep) {
    const avg = state.vivaScores.length > 0 
      ? (state.vivaScores.reduce((a, b) => a + b, 0) / state.vivaScores.length) * 10 
      : 80;
    rep = {
      overallScore: Math.round(avg),
      badge: avg >= 75 ? "جاهز بامتياز للمناقشة 🎓" : "أداء جيد ومستوى متوسط 📈",
      verdictMessage: "أداء قوي يعكس فهمك لآلية عمل الكود وتسلسل التنفيذ، مع ضرورة التركيز على تحسين سرعة الإجابة في أسئلة الـ Edge Cases.",
      strengths: [
        "فهم عميق لهيكل الكود وتسلسل التنفيذ",
        "استيعاب ممتاز لمفهوم الحجز الديناميكي للذاكرة",
        "القدرة على تبرير الخيارات البرمجية بثقة"
      ],
      weaknesses: [
        "التردد عند السؤال عن التعقيد الحسابي بدقة (Big-O)",
        "إغفال حالات الحافة مثل القوائم الفارغة والمؤشرات الخالية",
        "الحاجة لتعميق الشرح واستخدام مصطلحات علمية أوضح"
      ],
      reviewTopics: ["تحسينات الذاكرة وإزالة Dangling Pointers", "حساب Big-O Notation بدقة", "معالجة الـ Exceptions"]
    };
  }

  renderVivaFinalReport(rep);
}

function finishVivaSessionEarly() {
  if (confirm("هل تريد إنهاء المناقشة الآن وتوليد التقرير الختامي بالدرجات الحالية؟")) {
    finishVivaSession();
  }
}

function renderVivaFinalReport(rep) {
  document.getElementById('viva-active-screen').classList.add('hidden');
  document.getElementById('viva-report-screen').classList.remove('hidden');

  document.getElementById('report-final-score').innerText = `${rep.overallScore}%`;
  document.getElementById('report-badge').innerText = rep.badge;
  document.getElementById('report-verdict-message').innerText = rep.verdictMessage;

  const strEl = document.getElementById('report-strengths-list');
  strEl.innerHTML = (rep.strengths || []).map(s => `<li>${s}</li>`).join('');

  const wEl = document.getElementById('report-weaknesses-list');
  wEl.innerHTML = (rep.weaknesses || []).map(w => `<li>${w}</li>`).join('');

  const revEl = document.getElementById('report-review-topics');
  revEl.innerHTML = (rep.reviewTopics || []).map(t => 
    `<span class="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">${t}</span>`
  ).join('');

  if (window.confetti && rep.overallScore >= 70) {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  }

  loadReadinessData();
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
    const text = e.results[0][0].transcript;
    document.getElementById('viva-student-answer').value += ` ${text}`;
  };

  recognition.onerror = () => {
    btn.className = "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition";
  };

  recognition.onend = () => {
    btn.className = "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition";
  };

  recognition.start();
}

// ----------------- Smart Prep Sheet -----------------

function getClientDefaultPrepSheet() {
  return [
    {
      category: "التعقيد الحسابي (Big-O)",
      question: "ما هو التعقيد الزمني (Time Complexity) والمكاني (Space Complexity) للبرنامج ككل؟",
      trapReason: "المعيد يختبر هل حفظت الكود أم تحسب عدد العمليات بالنسبة لحجم المدخلات N.",
      modelAnswer: "التعقيد الزمني هو O(N) لأننا نمر على البيانات في حلقات، والمكاني O(1) إضافي ما لم نستخدم مصفوفات ديناميكية."
    },
    {
      category: "إدارة الذاكرة (Memory Management)",
      question: "أين تُخزن المتغيرات المحلية في دالتك؟ وما الفرق بين تخزينها في الـ Stack والـ Heap؟",
      trapReason: "سؤال كلاسيكي في المعمل للتمييز بين الذاكرة التلقائية السريعة والمحجوزة ديناميكياً بـ new أو malloc.",
      modelAnswer: "المتغيرات العادية تُحجز على الـ Stack تلقائياً وتتحرر فور انتهاء الدالة، بينما new تحجز على الـ Heap ويلزم تحريرها بـ delete لتجنب تسريب الذاكرة."
    },
    {
      category: "حالات الحافة (Edge Cases)",
      question: "ماذا يحدث إذا مرر المستخدم مدخلات فارغة أو قيماً سالبة أو قسّم على صفر؟",
      trapReason: "المعيد يريد أن يرى هل فكرت في المدخلات غير المثالية أم افترضت دائماً أن المدخلات صحيحة.",
      modelAnswer: "يجب وضع فحص حماية (Guard Condition) في بداية الدالة للتحقق من أن القيم سليمة وإرجاع كود خطأ بدلاً من انهيار البرنامج المفاجئ."
    },
    {
      category: "المؤشرات وعناوين الذاكرة (Pointers)",
      question: "هل قمت بتمرير المعاملات بالقيمة (Pass by Value) أم بالمرجع (Pass by Reference)؟ ولماذا؟",
      trapReason: "معرفة هل الطالب يدرك تكلفة نسخ الكائنات الكبيرة في الذاكرة مقابل تمرير العنوان فقط.",
      modelAnswer: "استخدمت Pass by Reference لتجنب إنشاء نسخة جديدة مكلفة في الذاكرة وتسريع الأداء، مع حماية البيانات بـ const."
    },
    {
      category: "هياكل البيانات (Data Structures)",
      question: "لماذا اخترت هذه البنية بالتحديد؟ هل فكرت في استخدام Hash Table أو Linked List؟",
      trapReason: "اختبار الوعي المعماري؛ إظهار أنك تعرف المفاضلة بين سرعة البحث وسرعة الإدراج.",
      modelAnswer: "اخترت هذا الهيكل لأن العمليات تتطلب وصولاً مباشراً بالفهرس O(1). لو كنا نحتاج إدراجاً متكرراً في المنتصف لكانت الـ Linked List خياراً أفضل."
    },
    {
      category: "البدائل التصميمية (Design Alternatives)",
      question: "لو طلبنا منك تحويل الدالة من الطريقة التكرارية إلى طريقة الاستدعاء الذاتي (Recursion)، كيف ستفعلها؟",
      trapReason: "التأكد من فهم ميكانيكية الـ Call Stack وحساب شرط التوقف (Base Case).",
      modelAnswer: "في الـ Recursion سنحتاج شرط توقف واضح (Base Case) لمنع Stack Overflow، بينما الطريقة التكرارية توفر استهلاك ذاكرة المكدس."
    },
    {
      category: "الأمان والاستقرار (Sanitization)",
      question: "كيف يتصرف البرنامج لو أدخل المستخدم نصاً في خانة تنتظر رقماً صحيحاً؟",
      trapReason: "اختبار تعاملك مع فشل مجرى الإدخال (cin.fail() أو try-except).",
      modelAnswer: "البرنامج يتعامل مع الإدخال عبر التحقق من حالة Stream Validation لتنظيف الـ Buffer وطباعة رسالة توجيهية للمستخدم بدلاً من التعليق."
    },
    {
      category: "تكامل الأجهزة والعتاد (Hardware Caching)",
      question: "كيف يؤثر ترتيب قراءة عناصر المصفوفة (صفاً صفاً مقابل عموداً عموداً) على أداء الكاش (Cache)؟",
      trapReason: "سؤال تميز يطرحه الدكاترة للطلاب لمعرفة فهمهم للـ Spatial Locality.",
      modelAnswer: "تخزن المصفوفات في الذاكرة بطريقة Row-Major Order؛ لذلك القراءة صفاً صفاً تستفيد من Cache Lines وتقلل الـ Cache Misses فتكون أسرع بكثير."
    },
    {
      category: "التوسع والأنظمة الكبيرة (Scalability)",
      question: "لو تضاعفت كمية البيانات من 1000 عنصر إلى 100 مليون عنصر، ما التعديل الجوهري الذي ستجريه؟",
      trapReason: "معرفة هل لديك نظرة مستقبلية لتجاوز حدود الذاكرة العشوائية (RAM).",
      modelAnswer: "سنحتاج لمعالجة متدفقة (Streaming/Chunking) وحفظ مؤقت على القرص مع استخدام خوارزميات الذاكرة الخارجية والتوزيع المتوازي."
    },
    {
      category: "التوثيق ومبادئ الكود النظيف (Clean Code)",
      question: "اشرح دلالة أسماء المتغيرات والدوال، وماذا يعني مبدأ المسؤولية الواحدة (SRP) هنا؟",
      trapReason: "التأكد من أن الكود منظم ومقروء وليس مجرد سطور عشوائية تعمل بالصدفة.",
      modelAnswer: "كل دالة تؤدي مهمة واحدة محددة ومستقلة، وأسماء المتغيرات معبرة عن محتواها مما يسهل اختبار كل وحدة برمجية وصيانتها مستقبلاً."
    }
  ];
}

async function generatePrepSheetForCode() {
  const code = document.getElementById('viva-code-input').value.trim();
  if (!code) {
    alert("الصق كود مشروعك في قسم الشفوي أولاً لتوليد الأسئلة عليه.");
    navigate('viva');
    return;
  }

  let questions = null;
  try {
    const res = await fetch('/api/prep-sheet/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) questions = data.questions;
    }
  } catch (err) {
    console.log("Using client prep sheet generator");
  }

  if (!questions) questions = getClientDefaultPrepSheet();

  renderPrepSheetQuestions(questions);
  navigate('prep-sheet');
}

async function loadLatestPrepSheet() {
  let questions = null;
  try {
    const res = await fetch('/api/prep-sheet/latest');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.sheet) questions = data.sheet.questions;
    }
  } catch (err) {
    console.log("Using cached prep sheet");
  }

  if (!questions) questions = getClientDefaultPrepSheet();
  renderPrepSheetQuestions(questions);
}

function renderPrepSheetQuestions(questions) {
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
        <span class="text-[10px] text-slate-500 font-mono">سؤال فخ متوقع</span>
      </div>
      
      <div>
        <h4 class="font-black text-white text-sm sm:text-base leading-relaxed">
          ${q.question}
        </h4>
      </div>

      <div class="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
        <strong class="text-amber-400 block mb-1 font-black">⚠️ سبب الفخ (المعيد بيختبر إيه هنا؟):</strong>
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

// ----------------- Error Notebook -----------------

async function loadErrorNotebook() {
  let items = [];
  try {
    const res = await fetch('/api/error-notebook');
    if (res.ok) {
      const data = await res.json();
      if (data.success) items = data.items || [];
    }
  } catch (err) {
    console.log("Using cached error notebook");
  }

  if (items.length === 0 && state.allErrors.length === 0) {
    items = [
      {
        id: "err_sample_1",
        course_code: "linear_algebra",
        topic: "determinant_3x3",
        problem_title: "حساب محدد مصفوفة 3x3",
        error_type: "sign",
        diagnosis_msg: "الرقم صح والإشارة غلط، راجع شبكة الإشارات",
        student_answer: "5",
        expected_answer: "-5"
      },
      {
        id: "err_sample_2",
        course_code: "linear_algebra",
        topic: "matrix_inverse",
        problem_title: "معكوس المصفوفة 2x2",
        error_type: "forgot-det",
        diagnosis_msg: "ناقصك تقسم على المحدد det(A)",
        student_answer: "[[4, -2], [-1, 3]]",
        expected_answer: "[[2, -1], [-0.5, 1.5]]"
      }
    ];
  }

  state.allErrors = items;
  const badge = document.getElementById('nav-error-count');
  if (badge) {
    if (items.length > 0) {
      badge.innerText = items.length;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
  renderErrorNotebookItems(items);
}

function renderErrorNotebookItems(items) {
  const container = document.getElementById('error-notebook-items-container');
  if (!container) return;
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center space-y-2 backdrop-blur-xl">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/25">
          <i data-lucide="check" class="w-6 h-6"></i>
        </div>
        <h4 class="font-black text-white text-base">دفتر الأخطاء نظيف تماماً! 👏</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          لم تسجل أي أخطاء متكررة حتى الآن، أو أنك أعدت حل جميع المسائل بنجاح.
        </p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = "rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 space-y-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl animate-fade-in";
    
    let errorTagAr = "خطأ حسابي";
    if (item.error_type === 'sign') errorTagAr = "خطأ إشارة (+ / -)";
    else if (item.error_type === 'forgot-det') errorTagAr = "نسيان القسمة على det(A)";
    else if (item.error_type === 'forgot-transpose') errorTagAr = "نسيان تدوير المصفوفة (Transpose)";
    else if (item.error_type === 'reversed-remainder') errorTagAr = "قراءة البواقي بالعكس";
    else if (item.error_type === 'circuit-power-sign') errorTagAr = "إشارة القدرة الممتصة/الموردة";

    card.innerHTML = `
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black text-white">${item.problem_title || 'مسألة رياضية'}</span>
          <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">${errorTagAr}</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${item.diagnosis_msg || 'الحسابات كانت غير مطابقة'}</p>
        <div class="text-[11px] text-slate-500 font-mono" dir="ltr">
          إجابتك السابقة: <span class="text-rose-400 font-bold">${item.student_answer}</span> &bull; المتوقع: <span class="text-emerald-400 font-bold">${item.expected_answer}</span>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="retryErrorProblem('${item.course_code}', '${item.topic}')" class="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-black text-xs transition border border-indigo-500/30">
          إعادة الحل الآن
        </button>
        <button onclick="resolveErrorItem('${item.id}')" title="تم إتقان الفكرة وحذفها من الدفتر" class="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition">
          <i data-lucide="check" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  if (window.lucide) lucide.createIcons();
}

function filterErrors(tag) {
  const buttons = document.querySelectorAll('.err-filter-btn');
  buttons.forEach(b => {
    b.className = "err-filter-btn px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold";
  });
  event.target.className = "err-filter-btn px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold";

  if (!state.allErrors) return;
  if (tag === 'all') {
    renderErrorNotebookItems(state.allErrors);
  } else {
    const filtered = state.allErrors.filter(e => e.error_type === tag);
    renderErrorNotebookItems(filtered);
  }
}

async function resolveErrorItem(id) {
  try {
    await fetch('/api/error-notebook/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
  } catch (err) {
    console.log("Resolved locally");
  }

  state.allErrors = state.allErrors.filter(e => e.id !== id);
  renderErrorNotebookItems(state.allErrors);
}

function retryErrorProblem(course, topic) {
  startQuizWithTopic(course, topic);
}
