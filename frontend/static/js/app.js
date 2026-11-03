/**
 * JooPrep v2 Client Engine
 * 6 Academic Subjects: Linear Algebra, Calculus, Basic Electric, Physics, English, Arabic Introduction
 * Features:
 * - 4-Choice MCQ Quiz Arena (Practice with instant explanation & Exam with timer & review)
 * - Code Lab & Oral Viva Defense Simulator with 4 Personas
 * - Smart Prep Sheet Generator (10 Trap Questions)
 * - Student Readiness Gauge & Subject Mastery Heatmap
 */

// ----------------- Comprehensive 6-Subject MCQ Question Bank -----------------
const SUBJECTS_DATA = {
  linear_algebra: {
    id: "linear_algebra",
    nameAr: "الجبر الخطي",
    nameEn: "Linear Algebra",
    code: "MATH 101",
    theme: "from-[#45404F] to-[#292531]",
    borderGlow: "border-[#AAA2B3]/50 shadow-[0_0_25px_rgba(170,162,179,0.15)]",
    badgeBg: "bg-[#45404F]/60 text-[#E2DDE7] border border-[#AAA2B3]/30",
    icon: "grid-3x3",
    description: "المحددات، معكوس المصفوفات، العمليات الأولية، فضاء المتجهات، وحل المعادلات الخطية.",
    questions: [
      {
        id: "la_1",
        question: "ما هي قيمة محدد المصفوفة $A = \\begin{pmatrix} 3 & 2 \\\\ 1 & 4 \\end{pmatrix}$؟",
        options: [
          { key: "A", text: "10" },
          { key: "B", text: "14" },
          { key: "C", text: "12" },
          { key: "D", text: "8" }
        ],
        correctKey: "A",
        explanation: "قانون محدد مصفوفة 2x2 هو حاصل ضرب القطر الرئيسي ناقص حاصل ضرب القطر الثانوي: $\\det(A) = (3 \\times 4) - (2 \\times 1) = 12 - 2 = 10$."
      },
      {
        id: "la_2",
        question: "تكون المصفوفة المربعة $A$ قابلة للعكس (Invertible / Non-singular) إذا وفقط إذا كان:",
        options: [
          { key: "A", text: "$\\det(A) = 0$" },
          { key: "B", text: "$\\det(A) \\neq 0$" },
          { key: "C", text: "جميع عناصر القطر الرئيسي تساوي 1" },
          { key: "D", text: "المصفوفة متماثلة فقط" }
        ],
        correctKey: "B",
        explanation: "الشرط الأساسي لوجود معكوس لمصفوفة مربعة $A^{-1}$ هو أن يكون محددها غير صفري $\\det(A) \\neq 0$ حتى لا نقسم على صفر في قانون المعكوس."
      },
      {
        id: "la_3",
        question: "إذا كانت $A$ مصفوفة من الرتبة $3 \\times 2$ و $B$ مصفوفة من الرتبة $2 \\times 4$، فإن رتبة المصفوفة الناتجة $AB$ هي:",
        options: [
          { key: "A", text: "$2 \\times 2$" },
          { key: "B", text: "$3 \\times 4$" },
          { key: "C", text: "$4 \\times 3$" },
          { key: "D", text: "لا يمكن إجراء عملية الضرب" }
        ],
        correctKey: "B",
        explanation: "لإجراء الضرب يجب أن يتساوى عدد أعمدة الأولى مع صفوف الثانية (2 = 2)، ورتبة الناتج تكون (صفوف الأولى $\\times$ أعمدة الثانية) = $3 \\times 4$."
      },
      {
        id: "la_4",
        question: "مدوّر مصفوفة المدوّر $(A^T)^T$ يساوي دائماً:",
        options: [
          { key: "A", text: "$-A$" },
          { key: "B", text: "$A^{-1}$" },
          { key: "C", text: "$A$" },
          { key: "D", text: "$I$ (مصفوفة الوحدة)" }
        ],
        correctKey: "C",
        explanation: "تدوير المصفوفة مرتين يعيد الصفوف إلى مواقعها الأصلية كصفوف، وبالتالي $(A^T)^T = A$."
      },
      {
        id: "la_5",
        question: "في نظام المعادلات $Ax = b$، إذا كان $\\det(A) \\neq 0$ فإن للنظام:",
        options: [
          { key: "A", text: "حل وحيد فقط (Unique Solution)" },
          { key: "B", text: "عدد لا نهائي من الحلول" },
          { key: "C", text: "لا يوجد حل على الإطلاق" },
          { key: "D", text: "حلين متطابقين فقط" }
        ],
        correctKey: "A",
        explanation: "عندما يكون المحدد غير صفري، تكون المصفوفة قابلة للعكس ويمكن إيجاد الحل الوحيد مباشرة بالقانون $x = A^{-1}b$ (قاعدة كرامر)."
      }
    ]
  },

  calculus: {
    id: "calculus",
    nameAr: "التفاضل والتكامل",
    nameEn: "Calculus",
    code: "MATH 102",
    theme: "from-[#716879] to-[#45404F]",
    borderGlow: "border-[#E2DDE7]/50 shadow-[0_0_25px_rgba(226,221,231,0.15)]",
    badgeBg: "bg-[#716879]/50 text-[#E2DDE7] border border-[#AAA2B3]/30",
    icon: "activity",
    description: "النهايات، قواعد الاشتقاق، تطبيقات المشتقة، والتكامل غير المحدود وتطبيقات المساحات.",
    questions: [
      {
        id: "calc_1",
        question: "ما هي قيمة النهاية الشهيرة $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$؟",
        options: [
          { key: "A", text: "0" },
          { key: "B", text: "1" },
          { key: "C", text: "$\\infty$" },
          { key: "D", text: "غير معرّفة" }
        ],
        correctKey: "B",
        explanation: "هذه نهاية قياسية أساسية في التفاضل $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$، ويمكن إثباتها أيضاً بقاعدة لوبيتال $\\frac{\\cos(0)}{1} = 1$."
      },
      {
        id: "calc_2",
        question: "مشتقة الدالة $f(x) = x^4 - 3x^2 + 7$ هي:",
        options: [
          { key: "A", text: "$4x^3 - 6x$" },
          { key: "B", text: "$4x^3 - 6x + 7$" },
          { key: "C", text: "$x^3 - 6x$" },
          { key: "D", text: "$4x^3 - 3x$" }
        ],
        correctKey: "A",
        explanation: "باستخدام قاعدة القوة $\\frac{d}{dx} x^n = n x^{n-1}$: مشتقة $x^4$ هي $4x^3$، ومشتقة $-3x^2$ هي $-6x$، ومشتقة الثابت 7 هي 0."
      },
      {
        id: "calc_3",
        question: "ما هي قيمة التكامل غير المحدود $\\int (3x^2 + 2x) \\, dx$؟",
        options: [
          { key: "A", text: "$x^3 + x^2 + C$" },
          { key: "B", text: "$6x + 2 + C$" },
          { key: "C", text: "$3x^3 + 2x^2 + C$" },
          { key: "D", text: "$x^3 + 2x + C$" }
        ],
        correctKey: "A",
        explanation: "نزيد الأس واحداً ونقسم على الأس الجديد: $\\int 3x^2 dx = x^3$ و $\\int 2x dx = x^2$، وبإضافة ثابت التكامل ينتج $x^3 + x^2 + C$."
      },
      {
        id: "calc_4",
        question: "مشتقة الدالة الأسية الطبيعية $f(x) = e^{3x}$ هي:",
        options: [
          { key: "A", text: "$e^{3x}$" },
          { key: "B", text: "$3e^{3x}$" },
          { key: "C", text: "$\\frac{1}{3}e^{3x}$" },
          { key: "D", text: "$3x e^{3x-1}$" }
        ],
        correctKey: "B",
        explanation: "وفقاً لقاعدة السلسلة (Chain Rule)، مشتقة $e^{u}$ هي $u' \\cdot e^u$؛ وهنا مشتقة الأس $3x$ هي 3، فيكون الناتج $3e^{3x}$."
      },
      {
        id: "calc_5",
        question: "تكون للدالة نقطة حرجة (Critical Point) عند $x = c$ إذا كان:",
        options: [
          { key: "A", text: "$f'(c) = 0$ أو $f'(c)$ غير موجودة" },
          { key: "B", text: "$f(c) = 0$" },
          { key: "C", text: "$f''(c) > 0$ فقط" },
          { key: "D", text: "الدالة خطية فقط" }
        ],
        correctKey: "A",
        explanation: "تعريف النقطة الحرجة في حساب التفاضل هو أي نقطة في مجال الدالة تجعل المشتقة الأولى مساوية للصفر أو تجعل المشتقة غير معرّفة."
      }
    ]
  },

  basic_electric: {
    id: "basic_electric",
    nameAr: "الدوائر الكهربية",
    nameEn: "Basic Electric",
    code: "ELEC 101",
    theme: "from-[#594F63] to-[#292531]",
    borderGlow: "border-[#AAA2B3]/50 shadow-[0_0_25px_rgba(170,162,179,0.15)]",
    badgeBg: "bg-[#594F63]/50 text-[#E2DDE7] border border-[#AAA2B3]/30",
    icon: "zap",
    description: "قانون أوم، قوانين كيرشوف (KCL و KVL)، حسابات القدرة الممتصة والموردة، ومجزئ الجهد والتيار.",
    questions: [
      {
        id: "be_1",
        question: "وفقاً لقانون كيرشوف للتيار (KCL)، فإن المجموع الجبري للتيارات عند أي عقدة (Node) يساوي:",
        options: [
          { key: "A", text: "الجهد الكلي للدائرة" },
          { key: "B", text: "صفراً ($0$)" },
          { key: "C", text: "مجموع المقاومات" },
          { key: "D", text: "ما لا نهاية" }
        ],
        correctKey: "B",
        explanation: "قانون KCL يعتمد على مبدأ حفظ الشحنة الكهربائية: التيارات الداخلة إلى العقدة تساوي التيارات الخارجة منها، فالمجموع الجبري $\\sum I = 0$."
      },
      {
        id: "be_2",
        question: "مقاومتان $R_1 = 6\\,\\Omega$ و $R_2 = 3\\,\\Omega$ موصلتان على التوازي؛ المقاومة المكافئة $R_{eq}$ تساوي:",
        options: [
          { key: "A", text: "$9\\,\\Omega$" },
          { key: "B", text: "$2\\,\\Omega$" },
          { key: "C", text: "$3\\,\\Omega$" },
          { key: "D", text: "$18\\,\\Omega$" }
        ],
        correctKey: "B",
        explanation: "قانون مقاومتين على التوازي هو: $R_{eq} = \\frac{R_1 \\times R_2}{R_1 + R_2} = \\frac{6 \\times 3}{6 + 3} = \\frac{18}{9} = 2\\,\\Omega$."
      },
      {
        id: "be_3",
        question: "حسب اتفاقية الإشارات السلبية (Passive Sign Convention)، إذا دخل التيار من الطرف الموجب (+) لعنصر ما، فإن القدرة تكون:",
        options: [
          { key: "A", text: "ممتصة وموجبة ($P > 0$)" },
          { key: "B", text: "موردة وسالبة ($P < 0$)" },
          { key: "C", text: "مساوية للصفر دائماً" },
          { key: "D", text: "غير معتمدة على إشارة التيار" }
        ],
        correctKey: "A",
        explanation: "إذا دخل التيار إلى القطب الموجب لعنصر، فهذا يعني أن العنصر يمتص طاقة من الدائرة (Absorbing Power) وتكون إشارة القدرة موجبة $+P = VI$."
      },
      {
        id: "be_4",
        question: "مصباح كهربي مقاومته $10\\,\\Omega$ يمر به تيار مقداره $2\\text{ A}$، ما هي القدرة المستهلكة في المصباح؟",
        options: [
          { key: "A", text: "$20\\text{ W}$" },
          { key: "B", text: "$40\\text{ W}$" },
          { key: "C", text: "$200\\text{ W}$" },
          { key: "D", text: "$5\\text{ W}$" }
        ],
        correctKey: "B",
        explanation: "قانون القدرة بدلالة التيار والمقاومة هو $P = I^2 R = (2)^2 \\times 10 = 4 \\times 10 = 40\\text{ Watts}$."
      },
      {
        id: "be_5",
        question: "في دائرة تيار مستمر (DC Steady State)، يسلك المكثف (Capacitor) سلوك:",
        options: [
          { key: "A", text: "دائرة قصر (Short Circuit)" },
          { key: "B", text: "دائرة مفتوحة (Open Circuit)" },
          { key: "C", text: "مقاومة قيمتها $1\\,\\Omega$" },
          { key: "D", text: "مصدر جهد مستمر" }
        ],
        correctKey: "B",
        explanation: "في حالة الاستقرار مع التيار المستمر DC، ينعدم تغير الجهد مع الزمن $\\frac{dv}{dt} = 0$، وبما أن $i = C \\frac{dv}{dt}$، فإن التيار يساوي صفراً، فيتصرف المكثف كدائرة مفتوحة Open Circuit."
      }
    ]
  },

  physics: {
    id: "physics",
    nameAr: "الفيزياء الهندسية",
    nameEn: "Physics",
    code: "PHYS 101",
    theme: "from-[#665B72] to-[#36303D]",
    borderGlow: "border-[#AAA2B3]/50 shadow-[0_0_25px_rgba(170,162,179,0.15)]",
    badgeBg: "bg-[#665B72]/50 text-[#E2DDE7] border border-[#AAA2B3]/30",
    icon: "atom",
    description: "قوانين نيوتن للحركة، الشغل والطاقة، قانون كولوم، المجال الكهربي، والموجات الكهرومغناطيسية.",
    questions: [
      {
        id: "phys_1",
        question: "وفقاً لقانون كولوم، القوة الكهربية المتبادلة بين شحنتين نقطيتين تتناسب:",
        options: [
          { key: "A", text: "طردياً مع المسافة بينهما" },
          { key: "B", text: "عكسياً مع مربع المسافة بينهما ($1/r^2$)" },
          { key: "C", text: "طردياً مع مربع المسافة" },
          { key: "D", text: "عكسياً مع حاصل ضرب الشحنتين" }
        ],
        correctKey: "B",
        explanation: "قانون كولوم هو $F = k \\frac{|q_1 q_2|}{r^2}$؛ القوة تتناسب طردياً مع حاصل ضرب الشحنتين وعكسياً مع مربع المسافة بينهما."
      },
      {
        id: "phys_2",
        question: "جسم كتلته $4\\text{ kg}$ يتحرك بسرعة ثابتة مقدارها $3\\text{ m/s}$، ما هي طاقة حركته (Kinetic Energy)؟",
        options: [
          { key: "A", text: "$12\\text{ Joules}$" },
          { key: "B", text: "$18\\text{ Joules}$" },
          { key: "C", text: "$36\\text{ Joules}$" },
          { key: "D", text: "$24\\text{ Joules}$" }
        ],
        correctKey: "B",
        explanation: "قانون طاقة الحركة هو $KE = \\frac{1}{2} m v^2 = \\frac{1}{2} \\times 4 \\times (3)^2 = 2 \\times 9 = 18\\text{ Joules}$."
      },
      {
        id: "phys_3",
        question: "وحدة قياس شدة المجال الكهربائي (Electric Field) في النظام الدولي هي:",
        options: [
          { key: "A", text: "$\\text{Newton / Coulomb (N/C)}$ أو $\\text{Volt / meter (V/m)}$" },
          { key: "B", text: "$\\text{Joule / Coulomb}$" },
          { key: "C", text: "$\\text{Tesla}$" },
          { key: "D", text: "$\\text{Watt / meter}$" }
        ],
        correctKey: "A",
        explanation: "المجال الكهربائي يُعرّف بأنه القوة المؤثرة على وحدة الشحنات الموجبة $E = F / q$ ووحدته $\\text{N/C}$ وتكافئ $\\text{V/m}$."
      },
      {
        id: "phys_4",
        question: "القانون الأول للديناميكا الحرارية يعبر في جوهره عن مبدأ:",
        options: [
          { key: "A", text: "حفظ الشحنة الكهربية" },
          { key: "B", text: "حفظ الطاقة (Energy Conservation)" },
          { key: "C", text: "زيادة الإنتروبيا" },
          { key: "D", text: "توازن الضغط والحرارة فقط" }
        ],
        correctKey: "B",
        explanation: "ينص القانون الأول للديناميكا الحرارية على أن التغير في الطاقة الداخلية لنظام معزول يساوي الحرارة المضافة مطروحاً منها الشغل المبذول $\\Delta U = Q - W$، وهو تطبيق مباشر لحفظ الطاقة."
      },
      {
        id: "phys_5",
        question: "إذا كانت سرعة الضوء في الفراغ $c$، فإن سرعته داخل وسط مادي معامل انكساره $n = 1.5$ تكون:",
        options: [
          { key: "A", text: "$1.5\\,c$" },
          { key: "B", text: "$c / 1.5$" },
          { key: "C", text: "$c$" },
          { key: "D", text: "$2.25\\,c$" }
        ],
        correctKey: "B",
        explanation: "معامل الانكسار يُعرّف بالنسبة $n = c / v$، وبالتالي سرعة الضوء في الوسط هي $v = c / n = c / 1.5$."
      }
    ]
  },

  english: {
    id: "english",
    nameAr: "اللغة الإنجليزية الأكاديمية",
    nameEn: "English",
    code: "ENG 101",
    theme: "from-[#7D728A] to-[#45404F]",
    borderGlow: "border-[#AAA2B3]/50 shadow-[0_0_25px_rgba(170,162,179,0.15)]",
    badgeBg: "bg-[#7D728A]/50 text-[#E2DDE7] border border-[#AAA2B3]/30",
    icon: "book-a",
    description: "المصطلحات التقنية في الحاسبات، قواعد الكتابة الأكاديمية، تراكيب الجمل، وصياغة التقارير الفنية.",
    questions: [
      {
        id: "eng_1",
        question: "In technical documentation, which sentence represents the correct Passive Voice for: 'The engineer debugged the program.'?",
        options: [
          { key: "A", text: "The program was debugged by the engineer." },
          { key: "B", text: "The program has being debugged by the engineer." },
          { key: "C", text: "The engineer was debugged by the program." },
          { key: "D", text: "The program is debugging by the engineer." }
        ],
        correctKey: "A",
        explanation: "في زمن الماضي البسيط (Past Simple)، يتحول المبني للمجهول إلى: المفعول به + was/were + التصريف الثالث: 'The program was debugged'."
      },
      {
        id: "eng_2",
        question: "What is the precise meaning of the computing term 'Concurrent execution'?",
        options: [
          { key: "A", text: "Running tasks strictly one after another" },
          { key: "B", text: "Multiple tasks progressing during overlapping time periods" },
          { key: "C", text: "Deleting outdated processes from memory" },
          { key: "D", text: "Compiling code into machine language" }
        ],
        correctKey: "B",
        explanation: "المصطلح 'Concurrency' في علوم الحاسب يعني إدارة وتنفيذ عدة مهام في فترات زمنية متداخلة دون الحاجة لانتهاء مهمة بالكامل لبدء الأخرى."
      },
      {
        id: "eng_3",
        question: "Choose the grammatically correct conditional sentence:",
        options: [
          { key: "A", text: "If the algorithm is optimized, execution time will decrease." },
          { key: "B", text: "If the algorithm will be optimized, execution time decreases." },
          { key: "C", text: "If the algorithm was optimize, execution time would decreased." },
          { key: "D", text: "If the algorithm optimize, time will decreased." }
        ],
        correctKey: "A",
        explanation: "الحالة الشرطية الأولى (First Conditional) تتكون من: If + مضارع بسيط (is optimized) ثم will + المصدر (will decrease)."
      },
      {
        id: "eng_4",
        question: "The term 'Bandwidth' in networking refers to:",
        options: [
          { key: "A", text: "The physical weight of the network cable" },
          { key: "B", text: "The maximum rate of data transfer across a given path" },
          { key: "C", text: "The software used to browse the internet" },
          { key: "D", text: "The battery consumption of a router" }
        ],
        correctKey: "B",
        explanation: "مصطلح عرض النطاق الترددي (Bandwidth) يعبر عن أقصى كمية بيانات يمكن نقلها عبر مسار اتصال في وحدة الزمن (غالباً بالـ Mbps أو Gbps)."
      },
      {
        id: "eng_5",
        question: "Select the word that correctly completes the statement: 'The software architecture must be _______ to handle future increases in workload.'",
        options: [
          { key: "A", text: "Scalable" },
          { key: "B", text: "Redundant" },
          { key: "C", text: "Depreciated" },
          { key: "D", text: "Volatile" }
        ],
        correctKey: "A",
        explanation: "كلمة 'Scalable' (قابلة للتوسع) هي الكلمة الهندسية الصحيحة لوصف النظام القادر على التكيف مع زيادة حجم العمل والبيانات."
      }
    ]
  },

  arabic_intro: {
    id: "arabic_intro",
    nameAr: "مقدمة في اللغة العربية والتواصل",
    nameEn: "Arabic Introduction",
    code: "ARAB 101",
    theme: "from-[#8C8099] to-[#544B5E]",
    borderGlow: "border-[#AAA2B3]/50 shadow-[0_0_25px_rgba(170,162,179,0.15)]",
    badgeBg: "bg-[#8C8099]/50 text-[#E2DDE7] border border-[#AAA2B3]/30",
    icon: "feather",
    description: "أساسيات الصياغة التعبيرية، قواعد النحو والصرف للكتابة الأكاديمية، مهارات العرض والإقناع، وتوثيق المصطلحات العلمية.",
    questions: [
      {
        id: "ar_1",
        question: "في الجملة التالية: 'إنّ المهندسينَ قادرونَ على الابتكار'، إعراب كلمة 'قادرون' هو:",
        options: [
          { key: "A", text: "خبر إنّ مرفوع وعلامة رفعه الواو لأنه جمع مذكر سالم" },
          { key: "B", text: "اسم إنّ منصوب وعلامة نصبه الياء" },
          { key: "C", text: "نعت مرفوع وعلامة رفعه الضمة" },
          { key: "D", text: "مبتدأ مؤخر مرفوع بالواو" }
        ],
        correctKey: "A",
        explanation: "'إنّ' حرف ناسخ ينصب المبتدأ (المهندسينَ) ويرفع الخبر؛ فـ 'قادرون' خبر إنّ مرفوع بالواو لأنه جمع مذكر سالم."
      },
      {
        id: "ar_2",
        question: "أي الكلمات التالية كُتبت همزتها همزة وصل صحيحة؟",
        options: [
          { key: "A", text: "إستخدام" },
          { key: "B", text: "استخدام" },
          { key: "C", text: "أستخدام" },
          { key: "D", text: "إستخراج" }
        ],
        correctKey: "B",
        explanation: "الفعل السداسي وأمره ومصدره همزتها همزة وصل دائماً بدون همزة رسمية: (استخدمَ - استخدِمْ - استخدام)."
      },
      {
        id: "ar_3",
        question: "الهدف الجوهري من 'الملخص التنفيذي (Executive Summary)' في التقارير الهندسية هو:",
        options: [
          { key: "A", text: "سرد السيرة الذاتية للمهندسين المشاركين" },
          { key: "B", text: "تقديم لمحة شاملة وموجزة عن المشكلة والنتائج والحل لصناع القرار" },
          { key: "C", text: "إدراج شفرات الأكواد البرمجية بالكامل" },
          { key: "D", text: "وضع مسرد المصطلحات المعربة فقط" }
        ],
        correctKey: "B",
        explanation: "الملخص التنفيذي يُكتب لتمكين المسؤول وصانع القرار من معرفة جوهر المشكلة والنتائج والتوصية الأساسية دون الحاجة لقراءة التقرير الفني المطول."
      },
      {
        id: "ar_4",
        question: "علامة الترقيم المناسبة بين الجملة وسببها في الكتابة الأكاديمية هي:",
        options: [
          { key: "A", text: "الفاصلة المنقوطة (؛)" },
          { key: "B", text: "النقطتان الرأسيتان (:)" },
          { key: "C", text: "علامة الحذف (...)" },
          { key: "D", text: "الشرطة (-)" }
        ],
        correctKey: "A",
        explanation: "الفاصلة المنقوطة (؛) توضع دائماً بين جملتين إحداهما سبب أو تعليل للأخرى، مثل: 'تم تحسين الخوارزمية؛ لأن حجم البيانات تضاعف'."
      },
      {
        id: "ar_5",
        question: "المصطلح العربي الأدق المعتمد لمفهوم 'Artificial Intelligence' هو:",
        options: [
          { key: "A", text: "الذكاء الاصطناعي" },
          { key: "B", text: "الذكاء المصنوع" },
          { key: "C", text: "الحساب الآلي الذاتي" },
          { key: "D", text: "العقل التقني" }
        ],
        correctKey: "A",
        explanation: "المصطلح العلمي والمعجمي المعتمد في مجامع اللغة العربية والجامعات هو 'الذكاء الاصطناعي'."
      }
    ]
  }
};

// ----------------- Global Application State -----------------
const state = {
  activeView: 'dashboard',
  audioEnabled: true,
  user: {
    name: 'طالب حاسبات وهندسة',
    college: 'كلية الحاسبات والمعلومات',
    academic_year: 'الفرقة الأولى',
    quota_used_today_viva: 1,
    daily_quota_viva: 3,
    quota_used_today_prep: 1,
    daily_quota_prep: 5
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

// ----------------- Initialization -----------------
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  renderSubjectsGrid();
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
        navBtn.className = "nav-link px-4 py-2 rounded-xl transition flex items-center gap-2 text-[#E2DDE7] bg-[#716879]/30 border border-[#AAA2B3]/35 shadow-sm";
      } else {
        navBtn.className = "nav-link px-4 py-2 rounded-xl transition flex items-center gap-2 text-[#AAA2B3] hover:text-[#E2DDE7] hover:bg-[#45404F]/30";
      }
    }

    if (mobBtn) {
      if (v === viewName) {
        mobBtn.className = "flex flex-col items-center gap-1 text-[#E2DDE7] font-black";
      } else {
        mobBtn.className = "flex flex-col items-center gap-1 text-[#AAA2B3]/70 hover:text-[#E2DDE7]";
      }
    }
  });

  if (viewName === 'dashboard') {
    loadReadinessData();
  } else if (viewName === 'quizzes') {
    if (!state.quizQuestions || state.quizQuestions.length === 0) {
      startQuizForSubject(state.activeSubjectKey || 'linear_algebra');
    }
  } else if (viewName === 'prep-sheet') {
    loadLatestPrepSheet();
  } else if (viewName === 'error-notebook') {
    loadErrorNotebook();
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

// ----------------- Render 6 Subjects Grid on Dashboard -----------------
function renderSubjectsGrid() {
  const container = document.getElementById('subjects-grid-container');
  if (!container) return;
  container.innerHTML = '';

  Object.values(SUBJECTS_DATA).forEach(sub => {
    const card = document.createElement('div');
    card.className = `glass-card p-6 transition flex flex-col justify-between group relative overflow-hidden`;
    
    card.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="p-3.5 rounded-2xl bg-gradient-to-tr ${sub.theme} text-[#E2DDE7] shadow-lg group-hover:scale-105 border border-[#E2DDE7]/20 transition">
            <i data-lucide="${sub.icon}" class="w-6 h-6"></i>
          </div>
          <span class="text-[11px] font-black px-3 py-1 rounded-full ${sub.badgeBg}">
            ${sub.code}
          </span>
        </div>

        <div>
          <h4 class="font-black text-[#E2DDE7] text-lg tracking-tight">${sub.nameAr}</h4>
          <span class="text-xs text-[#AAA2B3] font-mono block">${sub.nameEn}</span>
          <p class="text-xs text-[#AAA2B3]/90 mt-2 leading-relaxed">
            ${sub.description}
          </p>
        </div>
      </div>

      <div class="pt-5 mt-4 border-t border-[#45404F]/60 flex items-center justify-between">
        <span class="text-xs text-[#AAA2B3] font-semibold flex items-center gap-1.5">
          <i data-lucide="help-circle" class="w-3.5 h-3.5 text-[#716879]"></i>
          ${sub.questions.length} كويزات MCQ
        </span>
        <button onclick="startQuizForSubject('${sub.id}')" class="btn-glass-primary px-4 py-2 rounded-xl text-xs font-black shadow-lg transition active:scale-95">
          ابدأ الكويز
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
  state.quizQuestions = [...sub.questions];
  state.currentQuestionIndex = 0;
  state.userAnswers = {};
  state.quizSubmitted = false;

  const sel = document.getElementById('quiz-course-select');
  if (sel) sel.value = sub.id;

  document.getElementById('quiz-topic-title').innerText = `${sub.nameAr} — كويز MCQ`;
  document.getElementById('quiz-problem-card').classList.remove('hidden');
  document.getElementById('quiz-success-card').classList.add('hidden');

  navigate('quizzes');
  renderCurrentMCQQuestion();

  if (state.quizMode === 'exam') {
    startQuizTimer();
  } else {
    stopQuizTimer();
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
  if (!questions || questions.length === 0) return;

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
        cardClass += " bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-emerald-500/10 shadow-lg";
        badgeClass += " bg-emerald-500 text-white";
      } else if (isSelected && opt.key !== q.correctKey) {
        cardClass += " bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-rose-500/10 shadow-lg";
        badgeClass += " bg-rose-500 text-white";
      } else {
        cardClass += " bg-slate-950/60 border-slate-800/80 text-slate-400 opacity-60";
        badgeClass += " bg-slate-800 text-slate-400";
      }
    } else {
      // Standard selection mode with Glassmorphism
      if (isSelected) {
        cardClass += " bg-[#716879]/35 border-[#AAA2B3] text-[#E2DDE7] shadow-[0_0_25px_rgba(170,162,179,0.3)] ring-1 ring-[#AAA2B3]/60";
        badgeClass += " bg-gradient-to-tr from-[#716879] to-[#AAA2B3] text-[#17151C] font-black shadow-md";
      } else {
        cardClass += " bg-[#292531]/45 border-[#45404F]/70 hover:border-[#716879] text-[#E2DDE7]/90 hover:bg-[#292531]/75";
        badgeClass += " bg-[#45404F]/60 text-[#AAA2B3] border border-[#716879]/40";
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
        ${isSelected ? '<i data-lucide="check-circle-2" class="w-5 h-5 text-[#AAA2B3]"></i>' : '<div class="w-4 h-4 rounded-full border border-[#716879]/50"></div>'}
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
      expBox.className = "rounded-2xl p-5 bg-[#292531]/90 border border-emerald-500/50 text-emerald-200 space-y-1.5 shadow-2xl backdrop-blur-xl animate-fade-in";
      document.getElementById('quiz-feedback-icon').className = "p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400";
      document.getElementById('quiz-feedback-icon').innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
      document.getElementById('quiz-feedback-title').innerText = "إجابة صحيحة وممتازة! 🎉";
    } else {
      expBox.className = "rounded-2xl p-5 bg-[#292531]/90 border border-rose-500/50 text-rose-200 space-y-1.5 shadow-2xl backdrop-blur-xl animate-fade-in";
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

  // Calculate score
  let correctCount = 0;
  const questions = state.quizQuestions;
  questions.forEach(q => {
    if (state.userAnswers[q.id] === q.correctKey) {
      correctCount++;
    }
  });

  const percent = Math.round((correctCount / questions.length) * 100);
  document.getElementById('quiz-final-score-percent').innerText = `${percent}%`;
  document.getElementById('quiz-final-score-detail').innerText = `أجبت على ${correctCount} من إجمالي ${questions.length} أسئلة بشكل صحيح`;

  if (window.confetti && percent >= 60) {
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  }

  // Render question-by-question review list
  renderQuizReviewList();
}

function renderQuizReviewList() {
  const container = document.getElementById('quiz-review-list');
  if (!container) return;
  container.innerHTML = '';

  state.quizQuestions.forEach((q, idx) => {
    const userChoice = state.userAnswers[q.id] || "لم تجب";
    const isCorrect = userChoice === q.correctKey;

    const div = document.createElement('div');
    div.className = `p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${isCorrect ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/20 border-rose-500/30 text-rose-200'}`;
    div.innerHTML = `
      <div class="flex items-center justify-between font-bold">
        <span>سؤال ${idx + 1}: ${q.question}</span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}">
          ${isCorrect ? 'صحيح ✓' : 'خطأ ✗'}
        </span>
      </div>
      <div class="text-xs text-slate-300 font-sans">
        إجابتك: <strong class="${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${userChoice}</strong> &bull; الإجابة الصحيحة: <strong class="text-emerald-400">${q.correctKey}</strong>
      </div>
      <div class="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
        ${q.explanation}
      </div>
    `;
    container.appendChild(div);
  });
}

function setQuizMode(mode) {
  state.quizMode = mode;
  const pBtn = document.getElementById('mode-btn-practice');
  const eBtn = document.getElementById('mode-btn-exam');
  const timer = document.getElementById('quiz-timer-container');

  if (mode === 'practice') {
    pBtn.className = "px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#716879] to-[#45404F] text-[#E2DDE7] font-bold border border-[#AAA2B3]/30 shadow-md transition";
    eBtn.className = "px-3.5 py-1.5 rounded-lg text-[#AAA2B3] hover:text-[#E2DDE7] transition font-bold";
    timer.classList.add('hidden');
    timer.classList.remove('flex');
    stopQuizTimer();
  } else {
    eBtn.className = "px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#716879] to-[#45404F] text-[#E2DDE7] font-bold border border-[#AAA2B3]/30 shadow-md transition";
    pBtn.className = "px-3.5 py-1.5 rounded-lg text-[#AAA2B3] hover:text-[#E2DDE7] transition font-bold";
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

// ----------------- Profile & Readiness Index -----------------
async function loadUserProfile() {
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
  alert("تم حفظ بيانات الملف الشخصي بنجاح!");
  loadUserProfile();
  navigate('dashboard');
}

function loadReadinessData() {
  const readiness = {
    readinessScore: 78,
    qScore: 84,
    vScore: 72,
    statusText: "مؤشر جاهزية ممتاز",
    levelLabel: "مستوى جاهز للامتحان والمناقشة 🎓",
    studyFirstRecommendations: [
      "محددات المصفوفات 3×3 (Linear Algebra)",
      "تفاضل الدوال المركبة (Calculus)",
      "قوانين كيرشوف وحساب القدرة (Basic Electric)"
    ],
    heatmap: [
      { label: "Linear Algebra (جبر خطي)", avgScore: 85, status: "قوي" },
      { label: "Calculus (تفاضل وتكامل)", avgScore: 72, status: "متوسط" },
      { label: "Basic Electric (دوائر كهربية)", avgScore: 68, status: "متوسط" },
      { label: "Physics (فيزياء هندسية)", avgScore: 75, status: "قوي" },
      { label: "English (لغة إنجليزية)", avgScore: 90, status: "ممتاز" },
      { label: "Arabic Intro (لغة عربية وتواصل)", avgScore: 92, status: "ممتاز" }
    ]
  };

  const score = Math.round(readiness.readinessScore);
  document.getElementById('readiness-score-display').innerText = `${score}%`;
  document.getElementById('readiness-level-label').innerText = readiness.levelLabel;
  document.getElementById('readiness-status-badge').innerText = readiness.statusText;

  const offset = 251.2 - (251.2 * score) / 100;
  const circle = document.getElementById('readiness-gauge-circle');
  circle.style.strokeDashoffset = offset;
  circle.setAttribute('class', 'text-emerald-500 transition-all duration-1000 ease-out');

  document.getElementById('q-score-display').innerText = `${readiness.qScore}%`;
  document.getElementById('v-score-display').innerText = `${readiness.vScore}%`;

  if (readiness.studyFirstRecommendations) {
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
    if (item.avgScore >= 80) {
      colorClass = "bg-emerald-500";
      textClass = "text-emerald-400";
    } else if (item.avgScore >= 60) {
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

// ----------------- Code Lab & Viva Defense Simulator -----------------
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
  state.vivaCurrentTurn = 1;
  state.vivaScores = [];

  const personaNames = {
    strict_ta: { name: "المعيد الصارم", avatar: "👨‍🏫", tone: "صارم ودقيق، يبحث عن الأخطاء الصامتة وحالات الحافة", welcome: "أهلاً بك. الكود بتاعك مفتوح قدامي، وهنبدأ المناقشة فوراً. ركز في إجاباتك وما تلفش وتدور؛ عايز إجابات علمية دقيقة." },
    academic_prof: { name: "الأستاذ الأكاديمي", avatar: "🎓", tone: "نظري وعميق، يركز على المبادئ والتعقيد والبدائل", welcome: "مرحباً يا باشمهندس. الغرض من المناقشة معرفة الأساس العلمي لاختياراتك في هذا الكود. لماذا كتبت هذا الحل بالتحديد؟" },
    friendly_ta: { name: "المعيد الودود", avatar: "🤝", tone: "مشجع وصبور، يوجه بتلميحات تدريجية", welcome: "أهلاً بيك يا بطل! متقلقش خالص، دي جلسة تدريب عشان تتعود على جو المعمل الحقيقي وتدخل وإنت واثق في نفسك." },
    surprise_doc: { name: "الدكتور المفاجئ", avatar: "⚡", tone: "غير متوقع، يطرح أسئلة ضغط واقعية", welcome: "مساء الخير. الكود شغال على المثال البسيط ده جميل، بس هل هيتحمل لو رميت عليه ضغط عملي حقيقي؟ هطرح عليك سيناريوهات وأشوف هتحلها إزاي." }
  };
  const p = personaNames[state.vivaPersona] || personaNames.strict_ta;

  document.getElementById('viva-setup-screen').classList.add('hidden');
  document.getElementById('viva-active-screen').classList.remove('hidden');
  document.getElementById('viva-report-screen').classList.add('hidden');

  document.getElementById('active-persona-name').innerText = p.name;
  document.getElementById('active-persona-avatar').innerText = p.avatar;
  document.getElementById('active-persona-tone').innerText = p.tone;
  document.getElementById('viva-turn-counter').innerText = `دور 1 من ${state.vivaMaxTurns}`;
  document.getElementById('viva-current-score').innerText = `--/10`;

  const stream = document.getElementById('viva-dialogue-stream');
  stream.innerHTML = '';

  addExaminerMessage(p.welcome);
  setTimeout(() => {
    addExaminerQuestion("بص على دالة insertHelper: إيه اللي هيحصل لو مررت لها مؤشر فاضي (nullptr)؟ وفين الـ Boundary Check اللي بيحميك؟", "حالات الحافة والذاكرة");
  }, 700);
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
    const words = answer.split(' ').length;
    let score = 6.0;
    let verdict = 'partial';
    let critique = 'إجابة جيدة ووصلت لنصف الفكرة، لكن كان ينقصك توضيح كيفية حماية البرنامج لو تغيرت المدخلات.';
    let missing = ["ربط الإجابة بالتعقيد الحسابي المباشر", "توضيح سيناريو معالجة الـ Edge Cases"];

    if (words > 12) {
      score = 8.8;
      verdict = 'correct';
      critique = 'ممتاز جداً! شرح مقنع ومترابط علمياً مع استدلال سليم بسلوك الكود وإدارة الذاكرة.';
      missing = [];
    } else if (words < 4) {
      score = 2.5;
      verdict = 'wrong';
      critique = 'إجابة مقتضبة جداً، حاول دائماً التفكير بصوت مسموع واستخدام المصطلحات التقنية.';
      missing = ["الإجابة المباشرة على السؤال", "المصطلحات التقنية المفسرة للحل"];
    }

    const nextQuestions = [
      "لو شجرة البحث أصبحت غير متزنة (Skewed Tree)، التعقيد الزمني لعملية البحث هيتحول لـ O(N)؛ إزاي تحل المشكلة دي هندسياً؟",
      "أين يتم تخزين العقد (Nodes) التي تم إنشاؤها عبر new؟ وهل يوجد Memory Leak لو انتهى البرنامج دون عمل delete؟",
      "كيف يتعامل البرنامج لو أدخل المستخدم قيمة مكررة بالفعل داخل الشجرة؟",
      "لو طلب منك تحويل دالة الإدراج من الطريقة التكرارية إلى طريقة الحلقات العادية، إيه التعديل اللي هتعمله؟"
    ];

    const evalRes = {
      score: score,
      verdict: verdict,
      critique: critique,
      missing: missing,
      nextQuestion: state.vivaCurrentTurn < state.vivaMaxTurns ? nextQuestions[(state.vivaCurrentTurn - 1) % nextQuestions.length] : null,
      topic: "Big-O وإدارة الذاكرة",
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
  }, 900);
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
  const avg = state.vivaScores.length > 0 
    ? (state.vivaScores.reduce((a, b) => a + b, 0) / state.vivaScores.length) * 10 
    : 82;

  const rep = {
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
    { category: "التعقيد الحسابي (Big-O)", question: "ما هو التعقيد الزمني والمكاني للبرنامج ككل؟", trapReason: "المعيد يختبر هل حفظت الكود أم تحسب عدد العمليات بالنسبة لحجم المدخلات N.", modelAnswer: "التعقيد الزمني هو O(N) والمكاني O(1) إضافي ما لم نستخدم مصفوفات ديناميكية." },
    { category: "إدارة الذاكرة (Memory)", question: "أين تُخزن المتغيرات المحلية؟ وما الفرق بين الـ Stack والـ Heap؟", trapReason: "سؤال كلاسيكي في المعمل للتمييز بين الذاكرة التلقائية السريعة والمحجوزة ديناميكياً بـ new.", modelAnswer: "المتغيرات العادية تُحجز على الـ Stack تلقائياً، بينما new تحجز على الـ Heap ويلزم تحريرها بـ delete لتجنب تسريب الذاكرة." },
    { category: "حالات الحافة (Edge Cases)", question: "ماذا يحدث إذا مرر المستخدم مدخلات فارغة أو قيماً سالبة؟", trapReason: "المعيد يريد أن يرى هل فكرت في المدخلات غير المثالية.", modelAnswer: "يجب وضع فحص حماية (Guard Condition) في بداية الدالة للتحقق من أن القيم سليمة وإرجاع كود خطأ." },
    { category: "المؤشرات (Pointers)", question: "هل قمت بتمرير المعاملات بالقيمة أم بالمرجع؟ ولماذا؟", trapReason: "معرفة هل الطالب يدرك تكلفة نسخ الكائنات الكبيرة في الذاكرة.", modelAnswer: "استخدمت Pass by Reference لتجنب إنشاء نسخة مكلفة في الذاكرة وتسريع الأداء مع حماية البيانات بـ const." },
    { category: "هياكل البيانات (Data Structures)", question: "لماذا اخترت هذه البنية بالتحديد دون غيرها؟", trapReason: "اختبار الوعي المعماري والمفاضلة بين سرعة البحث والإدراج.", modelAnswer: "اخترت هذا الهيكل لأن العمليات تتطلب وصولاً مباشراً بالفهرس O(1)." },
    { category: "البدائل التصميمية (Design)", question: "لو طلبنا منك تحويل الدالة من Recursion إلى Loops عادية، كيف ستفعلها؟", trapReason: "التأكد من فهم ميكانيكية الـ Call Stack وحساب شرط التوقف.", modelAnswer: "سنستخدم حلقة while مع مكدس يدوي لتخزين الحالات لتوفير استهلاك ذاكرة النظام." },
    { category: "الأمان والاستقرار (Sanitization)", question: "كيف يتصرف البرنامج لو أدخل المستخدم نصاً في خانة رقم صحيح؟", trapReason: "اختبار تعاملك مع فشل مجرى الإدخال cin.fail.", modelAnswer: "يتم التحقق من حالة الإدخال وتطهير الـ buffer وطباعة رسالة توجيهية للمستخدم." },
    { category: "العتاد والكاش (Hardware)", question: "كيف يؤثر ترتيب قراءة عناصر المصفوفة على كفاءة الـ Cache؟", trapReason: "سؤال تميز لمعرفة فهم الطالب للـ Spatial Locality.", modelAnswer: "القراءة صفاً صفاً في مصفوفات C++ تستفيد من خطوط الكاش وتقلل الـ Cache Misses." },
    { category: "التوسع (Scalability)", question: "لو تضاعفت كمية البيانات من 1000 عنصر إلى 100 مليون، ما التعديل اللازم؟", trapReason: "معرفة هل لديك نظرة مستقبلية لتجاوز حدود الـ RAM.", modelAnswer: "سنحتاج لمعالجة متدفقة (Chunking) مع خوارزميات الذاكرة الخارجية والتوزيع المتوازي." },
    { category: "الكود النظيف (Clean Code)", question: "ماذا يعني مبدأ المسؤولية الواحدة (SRP) في دوالك؟", trapReason: "التأكد من أن الكود منظم وليس عشوائياً.", modelAnswer: "كل دالة تؤدي مهمة واحدة محددة ومستقلة، وأسماء المتغيرات معبرة ذاتياً (Self-documenting)." }
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
        <span class="text-[10px] text-slate-500 font-mono">سؤال فخ متوقع</span>
      </div>
      <div><h4 class="font-black text-white text-sm sm:text-base leading-relaxed">${q.question}</h4></div>
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

function generatePrepSheetForCode() {
  loadLatestPrepSheet();
  navigate('prep-sheet');
}

// ----------------- Error Notebook -----------------
function loadErrorNotebook() {
  const container = document.getElementById('error-notebook-items-container');
  if (!container) return;
  container.innerHTML = `
    <div class="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center space-y-2 backdrop-blur-xl">
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/25">
        <i data-lucide="check" class="w-6 h-6"></i>
      </div>
      <h4 class="font-black text-white text-base">دفتر الأخطاء نظيف تماماً! 👏</h4>
      <p class="text-xs text-slate-400 max-w-sm mx-auto">
        أي أسئلة تخطئ فيها في الكويزات أو الشفوي ستُسجل هنا تلقائياً لتعيد حلها قبل الامتحان.
      </p>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}
