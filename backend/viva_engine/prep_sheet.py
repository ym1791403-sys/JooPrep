"""
Smart Prep Sheet Generator for JooPrep (ورقة التحضير الذكية)
Follows Section 6.6 & Section 17 of JooPrep v2 Specifications.
Generates 10 anticipated defense questions with category, trapReason, and modelAnswer.
"""

from typing import Dict, Any, List

class PrepSheetGenerator:
    @staticmethod
    def generate_sheet(project_map: Dict[str, Any], course_code: str = "programming") -> List[Dict[str, Any]]:
        """
        Generates 10 targeted trap questions grounded in the project structure.
        """
        funcs = project_map.get("functions", [])
        primary_fn = funcs[0]["name"] if funcs else "main"
        sec_fn = funcs[1]["name"] if len(funcs) > 1 else primary_fn
        complexity = project_map.get("complexity", "O(N)")
        lang = project_map.get("language", "cpp")

        questions = [
            {
                "id": 1,
                "category": "التعقيد الحسابي (Big-O)",
                "question": f"ما هو التعقيد الزمني (Time Complexity) والمكاني (Space Complexity) للبرنامج ككل وللدالة `{primary_fn}`؟",
                "trapReason": "المعيد يختبر هل حفظت الكود أم تحسب عدد العمليات بالنسبة لحجم المدخلات N، خاصة مع وجود Loops متداخلة.",
                "modelAnswer": f"التعقيد الزمني الإجمالي هو {complexity} لأننا نمر على البيانات في حلقات، والمكاني O(1) إضافي ما عدا المتغيرات المباشرة، إلا إذا تم استخدام مصفوفات ديناميكية فستكون O(N)."
            },
            {
                "id": 2,
                "category": "إدارة الذاكرة (Memory Management)",
                "question": "أين تُخزن المتغيرات المحلية في دالتك؟ وما الفرق بين تخزينها في الـ Stack والـ Heap؟",
                "trapReason": "سؤال كلاسيكي في امتحانات المعمل للتمييز بين الذاكرة التلقائية السريعة (Stack) والمحجوزة ديناميكياً (Heap).",
                "modelAnswer": "المتغيرات العادية تُحجز على الـ Stack تلقائياً وتتحرر فور خروج الدالة من نطاق التنفيذ. أما إذا استخدمنا new أو malloc فيتم الحجز على الـ Heap ويلزم تحريرها يدوياً لتجنب تسريب الذاكرة (Memory Leak)."
            },
            {
                "id": 3,
                "category": "حالات الحافة (Edge Cases)",
                "question": f"ماذا يحدث إذا مرر المستخدم مصفوفة فارغة، أو قيمة سالبة، أو قسّم على صفر في `{sec_fn}`؟",
                "trapReason": "المعيد يريد أن يرى هل فكرت في المدخلات غير المثالية أم افترضت دائماً أن المستخدم ملاك يدخل بيانات صحيحة فقط.",
                "modelAnswer": "يجب وضع فحص حماية (Guard Condition / If check) في بداية الدالة للتحقق من أن الحجم > 0 وأن المقام لا يساوي صفراً، مع إرجاع كود خطأ أو رمي Exception بدلاً من انهيار البرنامج المفاجئ."
            },
            {
                "id": 4,
                "category": "المؤشرات وعناوين الذاكرة (Pointers / References)",
                "question": "هل قمت بتمرير المعاملات بالقيمة (Pass by Value) أم بالمرجع (Pass by Reference)؟ ولماذا؟",
                "trapReason": "معرفة هل الطالب يدرك تكلفة نسخ الكائنات الكبيرة في الذاكرة مقابل تمرير العنوان فقط.",
                "modelAnswer": "استخدمت Pass by Reference (أو const reference) لتجنب إنشاء نسخة جديدة مكلفة في الذاكرة وتسريع الأداء، مع حماية البيانات من التعديل غير المقصود بواسطة const."
            },
            {
                "id": 5,
                "category": "هياكل البيانات (Data Structures)",
                "question": "لماذا اخترت هذه البنية بالتحديد؟ هل فكرت في استخدام Hash Table أو Linked List أو Binary Search Tree؟",
                "trapReason": "اختبار الوعي المعماري؛ إظهار أنك تعرف المفاضلة (Trade-off) بين سرعة البحث (Lookup) وسرعة الإدراج (Insertion).",
                "modelAnswer": "اخترت هذا الهيكل لأن العمليات الأكثر تكراراً تتطلب وصولاً مباشراً بالفهرس O(1). لو كنا نحتاج إدراجاً متكرراً في المنتصف لكانت الـ Linked List خياراً أفضل، ولو كنا نحتاج بحثاً فورياً عن مفاتيح فريدة لفضلنا Hash Table."
            },
            {
                "id": 6,
                "category": "البدائل التصميمية (Design Alternatives)",
                "question": f"لو طلبنا منك تحويل الدالة `{primary_fn}` من الطريقة التكرارية (Iterative) إلى طريقة الاستدعاء الذاتي (Recursive) أو العكس، كيف ستفعلها؟",
                "trapReason": "التأكد من فهم ميكانيكية الـ Call Stack وحساب شرط التوقف (Base Case).",
                "modelAnswer": "في الـ Recursion سنحتاج شرط توقف واضح وصريح (Base Case) لمنع Stack Overflow، بينما الطريقة التكرارية توفر استهلاك ذاكرة المكدس وتكون غالباً أسرع عملياً."
            },
            {
                "id": 7,
                "category": "الأمان والاستقرار (Robustness & Sanitization)",
                "question": "كيف يتصرف البرنامج لو أدخل المستخدم نصاً (String) في خانة تنتظر رقماً صحيحاً (Integer)؟",
                "trapReason": "اختبار تعاملك مع فشل مجرى الإدخال (cin.fail() أو try-except).",
                "modelAnswer": "البرنامج يتعامل مع الإدخال عبر التحقق من حالة Stream Validation أو استخدام try-catch لتنظيف الـ Buffer وطباعة رسالة توجيهية للمستخدم بدلاً من الدخول في حلقة لا نهائية."
            },
            {
                "id": 8,
                "category": "تكامل الأجهزة والعتاد (Hardware & Caching)",
                "question": "كيف يؤثر ترتيب قراءة عناصر المصفوفة (صفاً صفاً مقابل عموداً عموداً) على أداء المعالج وسرعة الكاش (Cache)؟",
                "trapReason": "سؤال تميز يطرحه الدكاترة للطلاب الأوائل لمعرفة فهمهم للـ Spatial Locality.",
                "modelAnswer": "في لغات مثل C++ يتم تخزين المصفوفات ثنائية الأبعاد في الذاكرة بطريقة Row-Major Order؛ لذلك القراءة صفاً صفاً تستفيد من Cache Lines وتقلل الـ Cache Misses فتكون أسرع بكثير من القراءة عموداً عموداً."
            },
            {
                "id": 9,
                "category": "التوسع والأنظمة الكبيرة (Scalability)",
                "question": "لو تضاعفت كمية البيانات من 1000 عنصر إلى 100 مليون عنصر، ما التعديل الجوهري الذي ستجريه؟",
                "trapReason": "معرفة هل لديك نظرة مستقبلية لتجاوز حدود الذاكرة العشوائية (RAM).",
                "modelAnswer": "عند هذا الحجم لا يمكن وضع البيانات كلها في الـ RAM؛ سنحتاج لمعالجة متدفقة (Chunking / Streaming)، وحفظ مؤقت على القرص أو استخدام خوارزميات الذاكرة الخارجية (External Sorting) والتوزيع المتوازي (Multi-threading)."
            },
            {
                "id": 10,
                "category": "التوثيق ومبادئ الكود النظيف (Clean Code)",
                "question": "اشرح دلالة أسماء المتغيرات والدوال، وماذا يعني مبدأ المسؤولية الواحدة (Single Responsibility Principle) هنا؟",
                "trapReason": "التأكد من أن الكود منظم ومقروء وليس مجرد سطور عشوائية تعمل بالصدفة.",
                "modelAnswer": "كل دالة تؤدي مهمة واحدة محددة ومستقلة، وأسماء المتغيرات معبرة عن محتواها (Self-documenting)، مما يسهل اختبار كل وحدة برمجية (Unit Testing) وصيانتها مستقبلاً."
            }
        ]

        return questions
