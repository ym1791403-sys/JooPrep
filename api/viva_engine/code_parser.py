"""
Code Analyzer & Project Map Extractor for JooPrep Viva Engine
Extracts functions, algorithms, risk points, memory traps, and complexity.
Treats student code purely as DATA (no prompt injection vulnerabilities).
"""

import re
from typing import Dict, Any, List

class CodeAnalyzer:
    @staticmethod
    def analyze_code(code: str, language_hint: str = "auto") -> Dict[str, Any]:
        """
        Parses source code to build a comprehensive Project Map:
        - Functions & Signatures
        - Detected Algorithms & Patterns
        - Vulnerabilities / Risk Points (Null checks, memory management, infinite loops)
        - Big-O Complexity Estimates
        """
        if not code or not code.strip():
            code = "// Empty code provided"

        lines = code.splitlines()
        code_clean = "\n".join(lines[:300])  # Enforce 300 lines limit per spec

        # Detect language
        lang = language_hint
        if lang == "auto":
            if "#include" in code_clean or "std::" in code_clean or "cout" in code_clean:
                lang = "cpp"
            elif "def " in code_clean or "import " in code_clean or ":" in code_clean and "self" in code_clean:
                lang = "python"
            elif "public class" in code_clean or "System.out.println" in code_clean:
                lang = "java"
            else:
                lang = "generic"

        functions = []
        algorithms = []
        risk_points = []
        complexity = "O(N)"

        # 1. Function detection
        if lang == "python":
            func_matches = re.findall(r'def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)', code_clean)
            for name, params in func_matches:
                functions.append({"name": name, "params": params.strip()})
        else: # C++ / Java / JS
            func_matches = re.findall(r'(?:void|int|float|double|bool|string|auto|public|private|static)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)', code_clean)
            for name, params in func_matches:
                if name not in ('if', 'while', 'for', 'switch'):
                    functions.append({"name": name, "params": params.strip()})

        if not functions:
            functions = [{"name": "main", "params": ""}]

        # 2. Algorithm / Patterns detection
        if "for" in code_clean:
            # Check nested loops
            nested_for = len(re.findall(r'for\s*\(.*?\).*{[\s\S]*?for\s*\(', code_clean)) > 0 or \
                         len(re.findall(r'for\s+\w+\s+in.*:\n\s+for\s+', code_clean)) > 0
            if nested_for:
                algorithms.append("حلقات تكرار متداخلة (Nested Loops)")
                complexity = "O(N²)"
            else:
                algorithms.append("معالجة خطية (Linear Iteration)")

        # Recursion check
        for fn in functions:
            fn_name = fn["name"]
            if fn_name != "main" and re.search(r'\b' + fn_name + r'\s*\(', code_clean[code_clean.find(fn_name) + len(fn_name):]):
                algorithms.append(f"دالة استدعاء ذاتي تكراري (Recursion) في `{fn_name}`")
                risk_points.append("احتمالية امتلاء مكدس الذاكرة (Stack Overflow) لو لم يتحقق شرط التوقف Base Case.")

        # Data structure detection
        if any(w in code_clean for w in ['vector', 'list', 'ArrayList', 'append', 'push_back']):
            algorithms.append("مصفوفات ديناميكية (Dynamic Arrays / Vectors)")
        if any(w in code_clean for w in ['node', 'Node', 'next', 'prev', 'head']):
            algorithms.append("قوائم متصلة (Linked List)")
        if any(w in code_clean for w in ['stack', 'push', 'pop']) and "Stack" in code_clean:
            algorithms.append("بنية مكدس (Stack Data Structure)")
        if any(w in code_clean for w in ['queue', 'enqueue', 'dequeue']):
            algorithms.append("طابور انتظار (Queue)")

        # 3. Risk points & vulnerabilities
        if any(w in code_clean for w in ['malloc', 'new ']):
            if not any(w in code_clean for w in ['free', 'delete ']):
                risk_points.append("حجز ديناميكي للذاكرة بدون تحرير صريح (Memory Leak Risk).")
            else:
                risk_points.append("إدارة ذاكرة يدوية (تأكد من عدم وجود Dangling Pointers أو Double Free).")

        if "/" in code_clean or "%" in code_clean:
            risk_points.append("عمليات قسمة أو باقي قسمة بدون التحقق من القسمة على صفر (Divide by Zero).")

        if "[" in code_clean and "]" in code_clean:
            risk_points.append("وصول لعناصر مصفوفة بالمؤشرات (احتمالية خروج عن الحدود Out-of-Bounds Indexing).")

        if not risk_points:
            risk_points.append("التعامل مع المدخلات الشاذة (Edge Cases مثل القوائم الفارغة أو الأرقام السالبة).")

        return {
            "language": lang,
            "lineCount": len(lines),
            "functions": functions,
            "algorithms": algorithms or ["معالجة شرطية وتكرارية متتابعة"],
            "riskPoints": risk_points,
            "complexity": complexity,
            "summary": f"مشروع {lang.upper()} يحتوي على {len(functions)} دوال رئيسية، مع تعقيد زمني متوقع {complexity}."
        }
