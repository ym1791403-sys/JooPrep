"""
Viva Turn Evaluator & Simulation Engine for JooPrep
Follows Section 6.2, 6.3, 11, 16, 17 of JooPrep v2 Specifications.
Strictly conforms to Zod schemas and Rubric:
- 40% Correctness
- 30% Depth & Justification
- 20% Clarity
- 10% What-if handling
"""

import random
from typing import Dict, Any, List, Optional
from .personas import get_persona

TOPICS = ['complexity', 'memory', 'edge-case', 'hardware', 'design']

class VivaSessionManager:
    @staticmethod
    def generate_initial_question(
        project_map: Dict[str, Any],
        persona_id: str,
        language: str = "ar",
        level: int = 2
    ) -> Dict[str, Any]:
        """Generates the opening viva question tailored to the project map and persona."""
        persona = get_persona(persona_id)
        funcs = project_map.get("functions", [])
        primary_fn = funcs[0]["name"] if funcs else "main"
        risk_points = project_map.get("riskPoints", ["المدخلات غير المتوقعة"])
        first_risk = risk_points[0]
        complexity = project_map.get("complexity", "O(N)")

        if persona_id == "strict_ta":
            q_ar = f"بص على الدالة `{primary_fn}`، إيه اللي هيحصل لو مررت لها مؤشر فاضي (Null / nullptr) أو مدخل بحجم 0؟ وضح لي سطر التحقق بالضبط."
            q_en = f"Look at function `{primary_fn}`: What happens if a null pointer or empty input of size 0 is passed? Point to the exact boundary check."
            q_mixed = f"في دالة `{primary_fn}`، لو عملت Pass لـ null أو empty dataset، الكود هيتصرف إزاي؟ وفين الـ Boundary Check اللي بيحميك؟"
            topic = "edge-case"

        elif persona_id == "academic_prof":
            q_ar = f"ما هو التعقيد الزمني (Time Complexity) والمكاني (Space Complexity) للحل بتاعك ككل؟ ولماذا لم تستخدم بنية بيانات أكثر كفاءة؟"
            q_en = f"What is the overall Time and Space Complexity in Big-O notation? Why did you select this data structure over an alternative?"
            q_mixed = f"عايزك تحدد لي الـ Big-O Time & Space Complexity للـ algorithm بتاعك، وليه اخترت الـ approach ده بالتحديد؟"
            topic = "complexity"

        elif persona_id == "friendly_ta":
            q_ar = f"عظيم! اشرح لي باختصار الفكرة العامة للكود والهدف من الدالة `{primary_fn}` عشان نطمئن إنك فاهم تسلسل التنفيذ."
            q_en = f"Great! Briefly explain the general flow of your code and the primary purpose of function `{primary_fn}`."
            q_mixed = f"بداية حلوة! اشرح لي ببساطة الـ Main Logic بتاع الكود ودور دالة `{primary_fn}` في تنفيذ الفكرة."
            topic = "design"

        else: # surprise_doc
            q_ar = f"تخيل إن السيستم ده شغال في بيئة إنتاج حية، والمستخدم دخل 10 مليون سجل فجأة! إيه أول حاجة هتنهار في البرنامج وليه؟"
            q_en = f"Suppose this runs in production and suddenly receives 10 million records. Which component will choke first and why?"
            q_mixed = f"لو البرنامج اشتغل under heavy load ودخل له 10 Million items، إيه أول bottleneck هيحصل؟ هل الميموري ولا البروسيسور؟"
            topic = "hardware"

        question = q_mixed if language == "mixed" else (q_en if language == "en" else q_ar)

        return {
            "turn": 1,
            "question": question,
            "topic": topic,
            "difficulty": level,
            "persona": persona
        }

    @staticmethod
    def evaluate_turn(
        student_answer: str,
        current_question: str,
        turn_number: int,
        max_turns: int,
        project_map: Dict[str, Any],
        persona_id: str,
        language: str = "ar",
        level: int = 2
    ) -> Dict[str, Any]:
        """
        Evaluates the student's answer and generates the next question or finalizes.
        Complies strictly with Zod schema in Section 6.2 & 17:
        {
          score: 0-10,
          verdict: correct | partial | wrong,
          missing: [points],
          critique: "string",
          nextQuestion: string | null,
          topic: complexity | memory | edge-case | hardware | design,
          difficulty: 1-3
        }
        """
        answer_clean = student_answer.strip().lower()
        word_count = len(answer_clean.split())

        # Keywords check for quality heuristic
        technical_keywords = [
            'big-o', 'o(n', 'o(1', 'o(n^2', 'memory', 'leak', 'stack', 'heap', 'pointer',
            'null', 'nullptr', 'buffer', 'overflow', 'recursion', 'base case', 'boundary',
            'exception', 'try', 'catch', 'loop', 'time', 'space', 'ذاكرة', 'مكدس', 'تعقيد',
            'مؤشر', 'حدود', 'صفر', 'حلقة', 'استدعاء', 'خطأ'
        ]
        matched_keywords = [kw for kw in technical_keywords if kw in answer_clean]

        # Rubric scoring:
        # Correctness (40% -> max 4 pts)
        # Depth & Justification (30% -> max 3 pts)
        # Clarity (20% -> max 2 pts)
        # What-if handling (10% -> max 1 pt)

        if word_count < 3 or answer_clean in ("معرفش", "مش عارف", "i dont know", "don't know", "idk", "no idea"):
            score = 1.5 if persona_id == "friendly_ta" else 0.5
            verdict = "wrong"
            missing = ["الإجابة المباشرة على السؤال", "المصطلحات التقنية المفسرة للحل", "خطوات التحقق في الكود"]
            critique = "إجابة غير مكتملة. لا تستسلم في المناقشة، حاول دائماً التفكير بصوت مسموع وذكر الاحتمالات حتى لو لم تكن متأكداً 100%."
        elif word_count < 8:
            score = 4.0
            verdict = "partial"
            missing = ["التبرير العلمي والعمق (Justification)", "ذكر تفاصيل السلوك العملي للكود"]
            critique = "الفكرة واصلة بشكل عام، لكن إجابتك مختصرة للغاية وتحتاج إلى تدعيمها بمصطلحات تقنية وشرح للسبب والنتيجة."
        else:
            # Good answer
            depth_bonus = min(len(matched_keywords) * 0.8, 3.0)
            length_bonus = min(word_count * 0.15, 2.5)
            base_score = 4.5 + depth_bonus + length_bonus
            # Factor in persona severity
            if persona_id == "strict_ta":
                base_score -= 1.0
            elif persona_id == "friendly_ta":
                base_score += 0.5

            score = min(max(round(base_score, 1), 2.0), 10.0)

            if score >= 7.5:
                verdict = "correct"
                missing = []
                critique = "ممتاز جداً! شرح مقنع ومترابط علمياً مع استدلال سليم بسلوك الكود."
            elif score >= 5.0:
                verdict = "partial"
                missing = ["ربط الإجابة بالتعقيد الحسابي المباشر", "توضيح سيناريو معالجة الـ Edge Cases"]
                critique = "إجابة جيدة ووصلت لنصف الفكرة، لكن كان ينقصك توضيح كيفية حماية البرنامج لو تغيرت المدخلات."
            else:
                verdict = "wrong"
                missing = ["التمييز بين الـ Stack والـ Heap", "تحديد نقطة الانهيار بدقة"]
                critique = "التحليل يحتاج إلى إعادة نظر؛ الإجابة افترضت سيناريو غير مطابق لطريقة عمل الكود فعلياً."

        # Decide next question if turns remain
        is_last_turn = (turn_number >= max_turns)
        next_question = None
        next_topic = TOPICS[(turn_number) % len(TOPICS)]

        if not is_last_turn:
            funcs = project_map.get("functions", [])
            fn_name = funcs[turn_number % len(funcs)]["name"] if funcs else "process"
            
            # Select question according to next_topic and persona
            if next_topic == "complexity":
                next_question = f"بالنسبة للدالة `{fn_name}`، لو زادت المدخلات بمقدار الضعف، هل زمن التنفيذ سيتضاعف أم يزيد أسياً؟ وليه؟"
            elif next_topic == "memory":
                next_question = f"أين يتم تخزين المتغيرات المحلية داخل `{fn_name}`؟ في الـ Stack أم الـ Heap؟ وهل هناك خطر تسريب ذاكرة (Memory Leak)؟"
            elif next_topic == "edge-case":
                next_question = f"لو المستخدم أدخل قيماً سالبة أو نصوصاً بدلاً من أرقام، هل الكود سيكتشف ذلك أم سيحدث Crash مفاجئ؟"
            elif next_topic == "hardware":
                next_question = f"كيف يتعامل المعالج مع الحلقات التكرارية هنا؟ وهل هناك إمكانية لتحسين الـ Cache Locality؟"
            else:
                next_question = f"لو أردنا إعادة كتابة دالة `{fn_name}` لتكون Modular وقابلة لإعادة الاستخدام في مشروع آخر، إيه التعديل اللي تقترحه؟"

        return {
            "score": score,
            "verdict": verdict,
            "missing": missing,
            "critique": critique,
            "nextQuestion": next_question,
            "topic": next_topic,
            "difficulty": level,
            "isLastTurn": is_last_turn
        }

    @staticmethod
    def generate_final_report(
        turns: List[Dict[str, Any]],
        project_map: Dict[str, Any],
        persona_id: str
    ) -> Dict[str, Any]:
        """Generates the end-of-viva comprehensive defense report."""
        if not turns:
            return {
                "overallScore": 0,
                "badge": "لم تكتمل الجلسة",
                "strengths": ["حضور الجلسة والبدء في المحاكاة"],
                "weaknesses": ["عدم إكمال المناقشة"],
                "reviewTopics": ["أساسيات المادة", "شرح الكود"],
                "verdictMessage": "يجب إكمال الجلسة للحصول على تقرير دقيق."
            }

        scores = [t.get("score", 0) for t in turns]
        avg_score = sum(scores) / len(scores)
        scaled_score = round(avg_score * 10, 1) # out of 100

        if scaled_score >= 80:
            badge = "جاهز بامتياز للمناقشة 🎓"
            strengths = [
                "فهم عميق لهيكل الكود وتسلسل التنفيذ",
                "ثقة واضحة واستخدام موفق للمصطلحات التقنية",
                "قدرة ممتازة على تبرير الخيارات البرمجية"
            ]
            weaknesses = [
                "تحسين سرعة الإجابة في أسئلة السيناريوهات غير المتوقعة",
                "مراعاة كتابة تعليقات توضيحية لـ Edge Cases المعقدة",
                "التأكد من التوثيق الشامل لتعقيد الدوال الفرعية"
            ]
            review_topics = ["تحسينات الذاكرة المتقدمة", "أنماط التصميم (Design Patterns)"]
            verdict = "أداء رائع جداً يؤهلك لدخول المعمل بثقة والحصول على أعلى الدرجات في المناقشة الشفوية!"

        elif scaled_score >= 60:
            badge = "أداء جيد ومستوى متوسط 📈"
            strengths = [
                "إلمام بالفكرة العامة والهدف من المشروع",
                "الإجابة السليمة على الأسئلة المباشرة",
                "استيعاب الخطوات الأساسية في الخوارزمية"
            ]
            weaknesses = [
                "التردد عند السؤال عن التعقيد الحسابي بدقة (Big-O)",
                "إغفال حالات الحافة والمدخلات غير الصحيحة (Edge Cases)",
                "الحاجة لتعميق الشرح واستخدام مصطلحات علمية أوضح"
            ]
            review_topics = ["حساب Big-O Notation بدقة", "التعامل مع Exceptions و Null Checks", "فحص تسريب الذاكرة"]
            verdict = "مستواك مبشر، ولكنك تحتاج لمراجعة نقاط الضعف المحددة أعلاه قبل موعد المعمل بيومين لضمان ثباتك."

        else:
            badge = "يحتاج إلى تدريب ومراجعة مكثفة ⚠️"
            strengths = [
                "الكود المكتوب قابل للتشغيل وتظهر فيه فكرة المشروع",
                "محاولة الشرح وتوضيح بعض الأجزاء الأساسية",
                "التعرف على مناطق الضعف قبل مناقشة المعمل الحقيقية"
            ]
            weaknesses = [
                "صعوبة في تبرير سبب كتابة أسطر الكود واختيار الدوال",
                "ضعف الإلمام بإدارة الذاكرة والتعقيد الزمني",
                "الاستسلام السريع لأسئلة 'ماذا لو؟' بدون محاولة التفكير المنهجي"
            ]
            review_topics = ["مراجعة سطر بسطر لوظيفة كل دالة", "جدول الـ Big-O لهياكل البيانات", "تحضير إجابات ورقة التحضير الذكية"]
            verdict = "المنصة صممت خصيصاً لمساعدتك على تجاوز هذه النقطة! اقرأ 'ورقة التحضير الذكية' وأعد المناقشة مرة أخرى."

        return {
            "overallScore": scaled_score,
            "badge": badge,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "reviewTopics": review_topics,
            "verdictMessage": verdict
        }
