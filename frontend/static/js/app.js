/**
 * JooPrep v2 Client Application
 * Handles Dashboard, Math Engine UI, Oral Viva Defense Simulator,
 * Smart Prep Sheets, and Error Notebook.
 */

// Global Application State
const state = {
  activeView: 'dashboard',
  theme: 'dark',
  audioEnabled: true,
  user: null,
  
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
  isRecognizingSpeech: false
};

// ----------------- Initialization -----------------

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();

  // Load User Profile & Dashboard Readiness
  loadUserProfile();
  loadReadinessData();

  // Textarea line counter listener
  const codeInput = document.getElementById('viva-code-input');
  if (codeInput) {
    codeInput.addEventListener('input', () => {
      const lines = codeInput.value.split('\n').length;
      document.getElementById('code-line-counter').innerText = `${lines} سطر`;
    });
  }
});

// ----------------- Navigation & View Management -----------------

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

    // Desktop Nav Styling
    if (navBtn) {
      if (v === viewName) {
        navBtn.className = "nav-link px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-2 text-indigo-400 bg-indigo-600/10";
      } else {
        navBtn.className = "nav-link px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-2 text-slate-400 hover:text-slate-200";
      }
    }

    // Mobile Nav Styling
    if (mobBtn) {
      if (v === viewName) {
        mobBtn.className = "flex flex-col items-center gap-1 text-indigo-400 font-bold";
      } else {
        mobBtn.className = "flex flex-col items-center gap-1 hover:text-slate-200";
      }
    }
  });

  // Dynamic View Triggers
  if (viewName === 'dashboard') {
    loadReadinessData();
  } else if (viewName === 'quizzes') {
    if (!state.currentProblem) loadNewProblem();
  } else if (viewName === 'error-notebook') {
    loadErrorNotebook();
  } else if (viewName === 'prep-sheet') {
    loadLatestPrepSheet();
  }

  // Refresh icons
  if (window.lucide) lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------- Theme & Audio Utilities -----------------

function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById('theme-icon');
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    state.theme = 'light';
    icon.setAttribute('data-lucide', 'sun');
  } else {
    html.classList.add('dark');
    state.theme = 'dark';
    icon.setAttribute('data-lucide', 'moon');
  }
  if (window.lucide) lucide.createIcons();
}

function toggleAudio() {
  state.audioEnabled = !state.audioEnabled;
  const icon = document.getElementById('audio-icon');
  if (state.audioEnabled) {
    icon.className = "w-4 h-4 text-emerald-400";
    speakText("تم تفعيل الصوت");
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
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

// ----------------- User Profile -----------------

async function loadUserProfile() {
  try {
    const res = await fetch('/api/user/profile');
    const data = await res.json();
    if (data.success) {
      state.user = data.user;
      document.getElementById('header-user-name').innerText = data.user.name;
      document.getElementById('profile-display-name').innerText = data.user.name;
      document.getElementById('profile-display-college').innerText = data.user.college;
      document.getElementById('profile-input-name').value = data.user.name;
      document.getElementById('profile-input-college').value = data.user.college;
      document.getElementById('profile-input-year').value = data.user.academic_year;
      document.getElementById('quota-viva-text').innerText = `${data.user.quota_used_today_viva} / ${data.user.daily_quota_viva}`;
      document.getElementById('quota-prep-text').innerText = `${data.user.quota_used_today_prep} / ${data.user.daily_quota_prep}`;
    }
  } catch (err) {
    console.error("Profile load error:", err);
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  const name = document.getElementById('profile-input-name').value;
  const college = document.getElementById('profile-input-college').value;
  const year = document.getElementById('profile-input-year').value;

  try {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, college, academic_year: year })
    });
    const data = await res.json();
    if (data.success) {
      alert("تم تحديث بياناتك بنجاح!");
      loadUserProfile();
      navigate('dashboard');
    }
  } catch (err) {
    alert("حدث خطأ أثناء حفظ البيانات.");
  }
}

// ----------------- Dashboard & Readiness Index (Section 7) -----------------

async function loadReadinessData() {
  try {
    const res = await fetch('/api/readiness');
    const data = await res.json();
    if (data.success) {
      const r = data.readiness;
      
      // Update Gauge Circle & Score
      const score = Math.round(r.readinessScore);
      document.getElementById('readiness-score-display').innerText = `${score}%`;
      document.getElementById('readiness-level-label').innerText = r.levelLabel;
      document.getElementById('readiness-status-badge').innerText = r.statusText;
      
      // SVG Circle stroke dash offset (Circumference ~ 251.2)
      const offset = 251.2 - (251.2 * score) / 100;
      document.getElementById('readiness-gauge-circle').style.strokeDashoffset = offset;
      
      if (score >= 75) {
        document.getElementById('readiness-gauge-circle').setAttribute('class', 'text-emerald-500 transition-all duration-1000 ease-out');
      } else if (score >= 50) {
        document.getElementById('readiness-gauge-circle').setAttribute('class', 'text-amber-500 transition-all duration-1000 ease-out');
      } else {
        document.getElementById('readiness-gauge-circle').setAttribute('class', 'text-rose-500 transition-all duration-1000 ease-out');
      }

      // Q and V display
      document.getElementById('q-score-display').innerText = r.qScore ? `${Math.round(r.qScore)}%` : '--';
      document.getElementById('v-score-display').innerText = r.vScore ? `${Math.round(r.vScore)}%` : '--';

      // Study First Callout ("ذاكر ده الأول")
      if (r.studyFirstRecommendations && r.studyFirstRecommendations.length > 0) {
        document.getElementById('study-first-topics').innerText = r.studyFirstRecommendations.join(' • ');
      }

      // Heatmap bars
      renderHeatmap(r.heatmap);
    }
  } catch (err) {
    console.error("Readiness load error:", err);
  }
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
      <div class="flex items-center justify-between text-xs font-semibold">
        <span class="text-slate-200">${item.label}</span>
        <span class="${textClass} font-mono">${Math.round(item.avgScore)}% (${item.status})</span>
      </div>
      <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
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

// ----------------- Step-by-Step Quizzes (Math Engine) -----------------

async function loadNewProblem(topicOverride = null) {
  const course = document.getElementById('quiz-course-select').value;
  let url = `/api/quiz/problem?course=${course}`;
  if (topicOverride) url += `&topic=${topicOverride}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      state.currentProblem = data.problem;
      state.currentStepIndex = 0;
      state.quizStepResults = [];
      state.quizHintsUsed = 0;

      document.getElementById('quiz-topic-title').innerText = data.problem.topicName || "مسألة رياضية";
      
      // Reset UI cards
      document.getElementById('quiz-problem-card').classList.remove('hidden');
      document.getElementById('quiz-success-card').classList.add('hidden');
      document.getElementById('quiz-feedback-box').classList.add('hidden');
      document.getElementById('quiz-hint-box').classList.add('hidden');

      renderCurrentStep();
      if (state.quizMode === 'exam') startExamTimer();
    }
  } catch (err) {
    console.error("Load problem error:", err);
  }
}

function renderCurrentStep() {
  const prob = state.currentProblem;
  if (!prob || !prob.steps) return;

  const step = prob.steps[state.currentStepIndex];
  const total = prob.steps.length;

  document.getElementById('quiz-step-indicator').innerText = `خطوة ${state.currentStepIndex + 1} من ${total}`;
  document.getElementById('quiz-step-title').innerText = step.title;

  // Render Prompt with KaTeX math
  const promptEl = document.getElementById('quiz-step-prompt');
  promptEl.innerHTML = formatMathText(step.prompt);

  // Clear input
  clearStudentInput();

  // Reset Hint Counter
  document.getElementById('hint-level-count').innerText = `0/${step.hints ? step.hints.length : 3}`;
  document.getElementById('quiz-hint-box').classList.add('hidden');
  document.getElementById('quiz-feedback-box').classList.add('hidden');
}

function formatMathText(text) {
  if (!text) return "";
  // Render LaTeX $$...$$
  let formatted = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try {
      return `<div class="my-2 py-1">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`;
    } catch (e) {
      return match;
    }
  });

  // Render LaTeX $...$
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
    pBtn.className = "px-3 py-1.5 rounded-lg bg-indigo-600 text-white transition";
    eBtn.className = "px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition";
    timer.classList.add('hidden');
    timer.classList.remove('flex');
    stopExamTimer();
  } else {
    eBtn.className = "px-3 py-1.5 rounded-lg bg-indigo-600 text-white transition";
    pBtn.className = "px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition";
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
      alert("انتهى وقت الامتحان!");
    }
  }, 1000);
}

function stopExamTimer() {
  if (state.examTimerInterval) {
    clearInterval(state.examTimerInterval);
    state.examTimerInterval = null;
  }
}

// ----------------- Custom Keypad & Matrix Builder (Section 10 & 15) -----------------

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

// ----------------- Submit Step Answer & Diagnosis -----------------

async function submitStepAnswer() {
  const prob = state.currentProblem;
  if (!prob) return;
  const step = prob.steps[state.currentStepIndex];
  const input = document.getElementById('quiz-student-input').value.trim();

  if (!input) {
    showQuizFeedback(false, "من فضلك اكتب إجابتك أولاً.", "استخدم اللوحة السريعة لتسهيل الكتابة.");
    return;
  }

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
    const data = await res.json();
    if (data.success) {
      const result = data.result;

      // Record step result
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
        }, 1200);

      } else {
        showQuizFeedback(false, result.diagnosis, result.tip);
        if (state.audioEnabled) speakText(result.diagnosis);
      }
    }
  } catch (err) {
    console.error("Evaluation error:", err);
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
    box.className = "rounded-xl p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-1";
    icon.className = "p-2 rounded-lg bg-emerald-500/20 text-emerald-400";
    icon.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
    title.innerText = "خطوة صحيحة 100%!";
    diag.innerText = message;
    tipEl.innerText = "";
  } else {
    box.className = "rounded-xl p-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 space-y-1";
    icon.className = "p-2 rounded-lg bg-rose-500/20 text-rose-400";
    icon.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5"></i>`;
    title.innerText = "تشخيص الخطأ:";
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
    // Problem Completed!
    finalizeQuizProblem();
  }
}

async function finalizeQuizProblem() {
  document.getElementById('quiz-problem-card').classList.add('hidden');
  document.getElementById('quiz-success-card').classList.remove('hidden');
  stopExamTimer();

  // Fire celebratory confetti!
  if (window.confetti) {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  }

  // Calculate final score
  const correctCount = state.quizStepResults.filter(r => r.correct).length;
  const total = state.quizStepResults.length;
  const score = Math.round((correctCount / total) * 100);

  // Save attempt to backend
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
    // Refresh readiness index in background
    loadReadinessData();
  } catch (err) {
    console.error("Save attempt error:", err);
  }
}

// ----------------- Hint Ladder (Section 5.1 & 4) -----------------

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

// ----------------- Viva Defense Simulator (Section 6, 11, 16) -----------------

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
    const data = await res.json();
    if (data.success) {
      state.vivaSessionId = data.sessionId;
      state.vivaProjectMap = data.projectMap;

      // Switch Screens
      document.getElementById('viva-setup-screen').classList.add('hidden');
      document.getElementById('viva-active-screen').classList.remove('hidden');
      document.getElementById('viva-report-screen').classList.add('hidden');

      // Update Persona Status
      const persona = data.initialTurn.persona;
      document.getElementById('active-persona-name').innerText = persona.name;
      document.getElementById('active-persona-avatar').innerText = persona.avatar;
      document.getElementById('active-persona-tone').innerText = persona.tone;
      document.getElementById('viva-turn-counter').innerText = `دور 1 من ${state.vivaMaxTurns}`;
      document.getElementById('viva-current-score').innerText = `--/10`;

      // Clear stream and add Welcome Message + Turn 1 Question
      const stream = document.getElementById('viva-dialogue-stream');
      stream.innerHTML = '';

      addExaminerMessage(persona.welcomeMessage);
      setTimeout(() => {
        addExaminerQuestion(data.initialTurn.question, data.initialTurn.topic);
      }, 700);

    }
  } catch (err) {
    console.error("Start viva error:", err);
    alert("حدث خطأ في الاتصال بالسيرفر.");
  } finally {
    startBtn.innerText = "بدء المناقشة الآن";
    startBtn.disabled = false;
  }
}

function addExaminerMessage(text) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-examiner p-4 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl animate-fade-in";
  div.innerHTML = `<span class="font-bold text-purple-400 block mb-1">الممتحن:</span>${text}`;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
}

function addExaminerQuestion(question, topic) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-examiner p-4 text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed max-w-2xl border-l-4 border-l-purple-500 shadow-md animate-fade-in";
  div.innerHTML = `
    <div class="flex items-center justify-between text-[11px] text-purple-300 mb-1.5 font-sans">
      <span class="font-bold flex items-center gap-1.5"><i data-lucide="help-circle" class="w-3.5 h-3.5"></i>سؤال المناقشة (${state.vivaCurrentTurn}):</span>
      <span class="bg-purple-950/60 px-2 py-0.5 rounded text-[10px] font-mono border border-purple-500/20">${topic || 'فحص الكود'}</span>
    </div>
    <div class="text-white">${question}</div>
  `;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
  if (window.lucide) lucide.createIcons();

  if (state.audioEnabled) speakText(question);
}

function addStudentAnswerBubble(answer) {
  const stream = document.getElementById('viva-dialogue-stream');
  const div = document.createElement('div');
  div.className = "viva-bubble-student p-4 text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-2xl mr-auto ml-0 border-r-4 border-r-indigo-400 shadow-md";
  div.innerHTML = `
    <span class="font-bold text-indigo-300 block mb-1">إجابتك:</span>
    <div>${answer}</div>
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

  // Show thinking indicator ("الممتحن بيفكر...")
  const thinking = document.getElementById('viva-thinking-indicator');
  thinking.classList.remove('hidden');

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
    const data = await res.json();
    thinking.classList.add('hidden');

    if (data.success) {
      const evalRes = data.evaluation;
      state.vivaScores.push(evalRes.score);

      // Render Critique & Score Card
      renderTurnCritique(evalRes);

      // Update current score display
      const avg = (state.vivaScores.reduce((a, b) => a + b, 0) / state.vivaScores.length).toFixed(1);
      document.getElementById('viva-current-score').innerText = `${avg}/10`;

      // Check if finished
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
  } catch (err) {
    thinking.classList.add('hidden');
    console.error("Viva turn error:", err);
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
      <div class="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <span class="text-rose-400 font-bold">نقاط كانت ناقصة في إجابتك:</span>
        <ul class="list-disc list-inside mt-0.5">
          ${evalRes.missing.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  div.className = "p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-2xl space-y-1.5 shadow";
  div.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-bold text-slate-200">تقييم الممتحن للدور:</span>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}">${verdictLabel}</span>
        <span class="font-bold text-indigo-400 font-mono">${evalRes.score}/10</span>
      </div>
    </div>
    <p class="leading-relaxed text-slate-300">${evalRes.critique}</p>
    ${missingHtml}
  `;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
}

async function finishVivaSession() {
  try {
    const res = await fetch('/api/viva/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: state.vivaSessionId })
    });
    const data = await res.json();
    if (data.success) {
      renderVivaFinalReport(data.finalReport);
    }
  } catch (err) {
    console.error("Finish viva error:", err);
  }
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

  // Strengths
  const strEl = document.getElementById('report-strengths-list');
  strEl.innerHTML = (rep.strengths || []).map(s => `<li>${s}</li>`).join('');

  // Weaknesses
  const wEl = document.getElementById('report-weaknesses-list');
  wEl.innerHTML = (rep.weaknesses || []).map(w => `<li>${w}</li>`).join('');

  // Review Topics
  const revEl = document.getElementById('report-review-topics');
  revEl.innerHTML = (rep.reviewTopics || []).map(t => 
    `<span class="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">${t}</span>`
  ).join('');

  if (window.confetti && rep.overallScore >= 70) {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  }

  // Reload readiness to reflect viva performance
  loadReadinessData();
}

function resetVivaToSetup() {
  document.getElementById('viva-setup-screen').classList.remove('hidden');
  document.getElementById('viva-active-screen').classList.add('hidden');
  document.getElementById('viva-report-screen').classList.add('hidden');
}

// Optional Voice Recognition via Web Speech API (Section 1)
function toggleSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("خاصية التعرف على الصوت غير مدعومة في متصفحك الحالي، يمكنك الكتابة في المربع مباشرة.");
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

// ----------------- Smart Prep Sheet (Section 6.6) -----------------

async function generatePrepSheetForCode() {
  const code = document.getElementById('viva-code-input').value.trim();
  if (!code) {
    alert("الصق كود مشروعك في قسم الشفوي أولاً لتوليد الأسئلة عليه.");
    navigate('viva');
    return;
  }

  try {
    const res = await fetch('/api/prep-sheet/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    });
    const data = await res.json();
    if (data.success) {
      renderPrepSheetQuestions(data.questions);
      navigate('prep-sheet');
    }
  } catch (err) {
    console.error("Generate prep sheet error:", err);
  }
}

async function loadLatestPrepSheet() {
  try {
    const res = await fetch('/api/prep-sheet/latest');
    const data = await res.json();
    if (data.success && data.sheet) {
      renderPrepSheetQuestions(data.sheet.questions);
    } else {
      // If none generated yet, prompt user or use sample code
      const code = document.getElementById('viva-code-input').value.trim();
      if (code) {
        generatePrepSheetForCode();
      } else {
        insertSampleCode();
        generatePrepSheetForCode();
      }
    }
  } catch (err) {
    console.error("Load latest prep sheet error:", err);
  }
}

function renderPrepSheetQuestions(questions) {
  const container = document.getElementById('prep-sheet-questions-container');
  if (!container) return;
  container.innerHTML = '';

  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = "rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-md hover:border-slate-700 transition";
    card.innerHTML = `
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <span class="text-xs font-bold text-indigo-400 flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center font-mono text-[11px]">${idx + 1}</span>
          ${q.category}
        </span>
        <span class="text-[10px] text-slate-500 font-mono">سؤال فخ متوقع</span>
      </div>
      
      <div>
        <h4 class="font-bold text-white text-sm sm:text-base leading-relaxed">
          ${q.question}
        </h4>
      </div>

      <!-- Trap Reason (سبب الفخ) -->
      <div class="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
        <strong class="text-amber-400 block mb-0.5">⚠️ سبب الفخ (المعيد بيختبر إيه هنا؟):</strong>
        ${q.trapReason}
      </div>

      <!-- Model Answer (الإجابة النموذجية) -->
      <div class="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
        <strong class="text-emerald-400 block mb-0.5">🎯 الإجابة النموذجية الموصى بها:</strong>
        ${q.modelAnswer}
      </div>
    `;
    container.appendChild(card);
  });
}

// ----------------- Error Notebook (Section 4 & 5.3) -----------------

async function loadErrorNotebook() {
  try {
    const res = await fetch('/api/error-notebook');
    const data = await res.json();
    if (data.success) {
      state.allErrors = data.items || [];
      const badge = document.getElementById('nav-error-count');
      if (badge) {
        if (state.allErrors.length > 0) {
          badge.innerText = state.allErrors.length;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
      renderErrorNotebookItems(state.allErrors);
    }
  } catch (err) {
    console.error("Error notebook load error:", err);
  }
}

function renderErrorNotebookItems(items) {
  const container = document.getElementById('error-notebook-items-container');
  if (!container) return;
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
          <i data-lucide="check" class="w-6 h-6"></i>
        </div>
        <h4 class="font-bold text-white text-base">دفتر الأخطاء نظيف تماماً! 👏</h4>
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
    card.className = "rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4";
    
    let errorTagAr = "خطأ حسابي";
    if (item.error_type === 'sign') errorTagAr = "خطأ إشارة (+ / -)";
    else if (item.error_type === 'forgot-det') errorTagAr = "نسيان القسمة على det(A)";
    else if (item.error_type === 'forgot-transpose') errorTagAr = "نسيان تدوير المصفوفة (Transpose)";
    else if (item.error_type === 'reversed-remainder') errorTagAr = "قراءة البواقي بالعكس";
    else if (item.error_type === 'circuit-power-sign') errorTagAr = "إشارة القدرة الممتصة/الموردة";

    card.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-white">${item.problem_title || 'مسألة رياضية'}</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">${errorTagAr}</span>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">${item.diagnosis_msg || 'الحسابات كانت غير مطابقة'}</p>
        <div class="text-[11px] text-slate-500 font-mono" dir="ltr">
          إجابتك السابقة: <span class="text-rose-400">${item.student_answer}</span> &bull; المتوقع: <span class="text-emerald-400">${item.expected_answer}</span>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="retryErrorProblem('${item.course_code}', '${item.topic}')" class="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs transition">
          إعادة الحل الآن
        </button>
        <button onclick="resolveErrorItem('${item.id}')" title="تم إتقان الفكرة وحذفها من الدفتر" class="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition">
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
    b.className = "err-filter-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-semibold";
  });
  event.target.className = "err-filter-btn px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold";

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
    loadErrorNotebook();
  } catch (err) {
    console.error("Resolve error:", err);
  }
}

function retryErrorProblem(course, topic) {
  startQuizWithTopic(course, topic);
}
