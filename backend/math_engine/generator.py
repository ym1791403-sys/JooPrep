"""
Problem Generator & Deterministic Step Solver for JooPrep
Follows Section 5.1 & Section 17 of JooPrep v2 Specifications.
Generates mathematically controlled problems with zero AI hallucination.
"""

import random
import uuid
from typing import Dict, Any, List

def det_2x2(m: List[List[float]]) -> float:
    return m[0][0] * m[1][1] - m[0][1] * m[1][0]

def det_3x3(m: List[List[float]]) -> float:
    a, b, c = m[0]
    d, e, f = m[1]
    g, h, i = m[2]
    return (
        a * (e * i - f * h) -
        b * (d * i - f * g) +
        c * (d * h - e * g)
    )

def cofactor_3x3(m: List[List[float]]) -> List[List[float]]:
    cofactors = []
    for r in range(3):
        row = []
        for c in range(3):
            # submatrix
            sub = [
                [m[i][j] for j in range(3) if j != c]
                for i in range(3) if i != r
            ]
            sign = 1 if (r + c) % 2 == 0 else -1
            row.append(sign * det_2x2(sub))
        cofactors.append(row)
    return cofactors

def transpose_3x3(m: List[List[float]]) -> List[List[float]]:
    return [[m[j][i] for j in range(3)] for i in range(3)]

class ProblemEngine:
    @staticmethod
    def generate_linear_algebra_det() -> Dict[str, Any]:
        """Generates a 3x3 Determinant step-by-step problem."""
        # Find nice matrix with non-zero determinant between -25 and 25
        while True:
            mat = [[random.randint(-4, 5) for _ in range(3)] for _ in range(3)]
            d = det_3x3(mat)
            if d != 0 and abs(d) <= 30:
                break

        a, b, c = mat[0]
        sub_a = [[mat[1][1], mat[1][2]], [mat[2][1], mat[2][2]]]
        sub_b = [[mat[1][0], mat[1][2]], [mat[2][0], mat[2][2]]]
        sub_c = [[mat[1][0], mat[1][1]], [mat[2][0], mat[2][1]]]

        m_a = det_2x2(sub_a)
        m_b = det_2x2(sub_b)
        m_c = det_2x2(sub_c)

        det_val = round(d, 2)
        prob_id = f"prob_det_{uuid.uuid4().hex[:6]}"

        latex_mat = (
            f"\\begin{{pmatrix}} "
            f"{mat[0][0]} & {mat[0][1]} & {mat[0][2]} \\\\ "
            f"{mat[1][0]} & {mat[1][1]} & {mat[1][2]} \\\\ "
            f"{mat[2][0]} & {mat[2][1]} & {mat[2][2]} "
            f"\\end{{pmatrix}}"
        )

        steps = [
            {
                "id": "step_1",
                "title": "حساب المحدد الأصغر للموقع (1,1)",
                "prompt": f"احسب قيمة المحدد الأصغر $M_{{11}}$ الناتج عن حذف الصف الأول والعمود الأول للمصفوفة:\n$${latex_mat}$$",
                "answerType": "number",
                "expected": m_a,
                "context": {"det": det_val, "topic": "linear_algebra"},
                "hints": [
                    "المحدد الأصغر $M_{11}$ يتكون من حذف الصف الأول والعمود الأول.",
                    f"المصفوفة الناتجة 2x2 هي: $\\begin{{pmatrix}} {sub_a[0][0]} & {sub_a[0][1]} \\\\ {sub_a[1][0]} & {sub_a[1][1]} \\end{{pmatrix}}$.",
                    f"القانون: $({sub_a[0][0]} \\times {sub_a[1][1]}) - ({sub_a[0][1]} \\times {sub_a[1][0]})$. الناتج = {m_a}."
                ]
            },
            {
                "id": "step_2",
                "title": "حساب الحد الثاني (مراعاة الإشارة السالبة)",
                "prompt": f"احسب قيمة الحد الثاني في فك الصف الأول: $-({b}) \\times M_{{12}}$، حيث $M_{{12}}$ هو محدد حذف الصف 1 والعمود 2:",
                "answerType": "number",
                "expected": -b * m_b,
                "context": {"det": det_val, "topic": "linear_algebra"},
                "hints": [
                    "تذكر أن إشارة الموقع (1,2) في شبكة الإشارات سالبة $(-)$.",
                    f"محدد $M_{{12}} = ({sub_b[0][0]} \\times {sub_b[1][1]}) - ({sub_b[0][1]} \\times {sub_b[1][0]}) = {m_b}$.",
                    f"الحد الثاني كاملاً هو $-({b}) \\times ({m_b}) = {-b * m_b}$."
                ]
            },
            {
                "id": "step_3",
                "title": "قيمة المحدد الكلية det(A)",
                "prompt": f"اجمع حدود الفك لحساب القيمة النهائية للمحدد $\\det(A)$:",
                "answerType": "number",
                "expected": det_val,
                "context": {"det": det_val, "topic": "linear_algebra"},
                "hints": [
                    "القانون العام: $\\det(A) = a_{11}C_{11} + a_{12}C_{12} + a_{13}C_{13}$.",
                    f"الحد الثالث هو $({c}) \\times ({m_c}) = {c * m_c}$.",
                    f"الجمع النهائي: $({a * m_a}) + ({-b * m_b}) + ({c * m_c}) = {det_val}$."
                ]
            }
        ]

        return {
            "id": prob_id,
            "courseCode": "linear_algebra",
            "topic": "determinant_3x3",
            "topicName": "حساب محدد مصفوفة 3x3",
            "difficulty": 2,
            "matrix": mat,
            "latexMatrix": latex_mat,
            "steps": steps
        }

    @staticmethod
    def generate_matrix_inverse_2x2() -> Dict[str, Any]:
        """Generates a 2x2 Matrix Inverse problem."""
        while True:
            a = random.randint(-4, 5)
            b = random.randint(-4, 5)
            c = random.randint(-4, 5)
            d = random.randint(-4, 5)
            det = a * d - b * c
            if det in (-2, -1, 1, 2, 3, 4, 5):
                break

        prob_id = f"prob_inv2_{uuid.uuid4().hex[:6]}"
        mat = [[a, b], [c, d]]
        adj = [[d, -b], [-c, a]]
        inv = [[d / det, -b / det], [-c / det, a / det]]

        latex_mat = f"A = \\begin{{pmatrix}} {a} & {b} \\\\ {c} & {d} \\end{{pmatrix}}"

        steps = [
            {
                "id": "step_1",
                "title": "حساب المحدد det(A)",
                "prompt": f"أوجد قيمة محدد المصفوفة $A$:\n$${latex_mat}$$",
                "answerType": "number",
                "expected": det,
                "context": {"det": det, "topic": "linear_algebra"},
                "hints": [
                    "محدد المصفوفة 2x2 هو حاصل ضرب القطر الرئيسي ناقص حاصل ضرب القطر الثانوي.",
                    f"$\\det(A) = ({a} \\times {d}) - ({b} \\times {c})$.",
                    f"الناتج = {det}."
                ]
            },
            {
                "id": "step_2",
                "title": "إيجاد المصفوفة الملحقة Adj(A)",
                "prompt": "أوجد المصفوفة الملحقة $\\text{Adj}(A)$ الناتجة عن تبديل عناصر القطر الرئيسي وعكس إشارات القطر الثانوي:",
                "answerType": "matrix",
                "expected": adj,
                "context": {"det": det, "topic": "linear_algebra"},
                "hints": [
                    "في مصفوفة 2x2: نبدل أماكن عناصر القطر الرئيسي ونعكس إشارات القطر الفرعي.",
                    f"القطر الرئيسي يصبح $[{d}, {a}]$ والقطر الثانوي $[{-b}, {-c}]$.",
                    f"المصفوفة الملحقة: $[[{d}, {-b}], [{-c}, {a}]]$."
                ]
            },
            {
                "id": "step_3",
                "title": "المصفوفة المعكوسة A⁻¹",
                "prompt": f"احسب المعكوس $A^{{-1}} = \\frac{{1}}{{\\det(A)}} \\text{{Adj}}(A)$ (يمكنك إدخال كسور مثل {d}/{det}):",
                "answerType": "matrix",
                "expected": inv,
                "context": {"det": det, "topic": "linear_algebra"},
                "hints": [
                    f"اقسم كل عنصر في المصفوفة الملحقة على المحدد ({det}).",
                    f"العنصر الأول: ${d} / {det}$، العنصر الثاني: ${-b} / {det}$...",
                    f"المعكوس = $[[{round(d/det, 3)}, {round(-b/det, 3)}], [{round(-c/det, 3)}, {round(a/det, 3)}]]]$."
                ]
            }
        ]

        return {
            "id": prob_id,
            "courseCode": "linear_algebra",
            "topic": "matrix_inverse",
            "topicName": "معكوس مصفوفة (Matrix Inverse)",
            "difficulty": 2,
            "matrix": mat,
            "latexMatrix": latex_mat,
            "steps": steps
        }

    @staticmethod
    def generate_base_conversion() -> Dict[str, Any]:
        """Generates a Number Base Conversion problem."""
        dec_num = random.randint(18, 95)
        bin_str = bin(dec_num)[2:]
        hex_str = hex(dec_num)[2:].upper()
        oct_str = oct(dec_num)[2:]
        prob_id = f"prob_base_{uuid.uuid4().hex[:6]}"

        steps = [
            {
                "id": "step_1",
                "title": "تحويل من عشري (Decimal) إلى ثنائي (Binary)",
                "prompt": f"حول الرقم العشري $({dec_num})_{{10}}$ إلى النظام الثنائي (Binary):",
                "answerType": "baseN",
                "expected": bin_str,
                "context": {"topic": "computer_fundamentals"},
                "hints": [
                    "استخدم طريقة القسمة المتتالية على 2 واحتفظ بالبواقي.",
                    "تذكر أن تبدأ بقراءة البواقي من الأسفل إلى الأعلى (من آخر باقي لأول باقي).",
                    f"العدد الثنائي الصحيح هو: {bin_str}."
                ]
            },
            {
                "id": "step_2",
                "title": "تحويل إلى النظام السداسي عشر (Hexadecimal)",
                "prompt": f"حول نفس الرقم $({dec_num})_{{10}}$ أو الثنائي $({bin_str})_2$ إلى سداسي عشر (Hex):",
                "answerType": "baseN",
                "expected": hex_str,
                "context": {"topic": "computer_fundamentals"},
                "hints": [
                    "قسّم الرقم الثنائي إلى مجموعات من 4 بتات بدءاً من اليمين.",
                    "تذكر أن الأرقام 10 إلى 15 تمثل بالحروف A, B, C, D, E, F.",
                    f"الناتج في النظام السداسي عشر هو: {hex_str}."
                ]
            }
        ]

        return {
            "id": prob_id,
            "courseCode": "computer_fundamentals",
            "topic": "base_conversion",
            "topicName": "تحويل أنظمة العد (Base Conversion)",
            "difficulty": 1,
            "steps": steps
        }

    @staticmethod
    def generate_twos_complement() -> Dict[str, Any]:
        """Generates a Two's Complement problem (8-bit)."""
        val = random.randint(15, 60)
        neg_val = -val
        prob_id = f"prob_twos_{uuid.uuid4().hex[:6]}"

        pos_bin = format(val, '08b')
        # Invert bits
        ones_comp = "".join('1' if b == '0' else '0' for b in pos_bin)
        # Add 1
        twos_comp_int = (int(ones_comp, 2) + 1) & 0xFF
        twos_comp_bin = format(twos_comp_int, '08b')

        steps = [
            {
                "id": "step_1",
                "title": "التمثيل الثنائي الموجب (8 بت)",
                "prompt": f"اكتب الرقم الموجب $({val})_{{10}}$ بالنظام الثنائي في 8 بت (8-bit):",
                "answerType": "baseN",
                "expected": pos_bin,
                "context": {"topic": "computer_fundamentals"},
                "hints": [
                    "اكتب الرقم الثنائي وأكمل الأصفار على اليسار حتى يصبح 8 بت.",
                    f"الرقم $({val})_{{10}}$ ثنائياً يحتاج 8 بت.",
                    f"الإجابة هي: {pos_bin}."
                ]
            },
            {
                "id": "step_2",
                "title": "حساب متمم الآحاد (1's Complement)",
                "prompt": f"اعكس بتات الرقم $({pos_bin})_2$ للحصول على متمم الآحاد (1's complement):",
                "answerType": "baseN",
                "expected": ones_comp,
                "context": {"topic": "computer_fundamentals"},
                "hints": [
                    "كل 0 يتحول إلى 1 وكل 1 يتحول إلى 0.",
                    f"عكس البتات لـ {pos_bin}.",
                    f"الإجابة هي: {ones_comp}."
                ]
            },
            {
                "id": "step_3",
                "title": "إضافة 1 للحصول على متمم الاثنين (2's Complement)",
                "prompt": f"أضف 1 إلى متمم الآحاد $({ones_comp})_2$ للحصول على تمثيل $({neg_val})_{{10}}$ بـ 2's complement:",
                "answerType": "baseN",
                "expected": twos_comp_bin,
                "context": {"topic": "computer_fundamentals"},
                "hints": [
                    "اجمع 1 على خانة الآحاد وتذكر الحمل (Carry) إذا كان 1 + 1.",
                    f"الجمع: $({ones_comp})_2 + 1$.",
                    f"الإجابة هي: {twos_comp_bin}."
                ]
            }
        ]

        return {
            "id": prob_id,
            "courseCode": "computer_fundamentals",
            "topic": "twos_complement",
            "topicName": "متمم الاثنين (Two's Complement 8-Bit)",
            "difficulty": 2,
            "steps": steps
        }

    @staticmethod
    def generate_electric_circuits_power() -> Dict[str, Any]:
        """Generates Electric Circuit absorbed/supplied power problem."""
        v = random.choice([6, 12, 15, 20, 24])
        i = random.choice([0.5, 1.0, 1.5, 2.0, 3.0, 4.0])
        # Randomize terminal entry: positive terminal = absorbed (+), negative terminal = supplied (-)
        enters_positive = random.choice([True, False])

        power_abs = (v * i) if enters_positive else -(v * i)
        power_sup = -power_abs

        prob_id = f"prob_circ_{uuid.uuid4().hex[:6]}"
        entry_text = "الطرف الموجب (+)" if enters_positive else "الطرف السالب (-)"
        verdict_str = "ممتصة (Absorbed)" if enters_positive else "موردة (Supplied)"

        steps = [
            {
                "id": "step_1",
                "title": "حساب القدرة الكهربائية P (وات)",
                "prompt": f"عنصر في دائرة كهربائية فرق الجهد بين طرفيه $V = {v}\\text{{ V}}$ ويمر به تيار $I = {i}\\text{{ A}}$ داخل إلى **{entry_text}**.\nاحسب مقدار القدرة $P = V \\times I$ مع الإشارة الصحيحة وفقاً لاتفاقية الإشارات السلبية (Passive Sign Convention):",
                "answerType": "number",
                "expected": power_abs,
                "context": {
                    "topic": "electric_circuits",
                    "is_power_question": True
                },
                "hints": [
                    "القانون: $P = V \\cdot I$.",
                    "وفقاً للـ Passive Sign Convention: إذا دخل التيار إلى الطرف الموجب فالقدرة الممتصة موجبة ($+P$). أما إذا دخل للطرف السالب فتكون سالبة ($-P$).",
                    f"الناتج = {power_abs} W."
                ]
            },
            {
                "id": "step_2",
                "title": "تحديد طبيعة القدرة (ممتصة أم موردة)",
                "prompt": f"هل هذا العنصر يقوم بامتصاص طاقة أم توريدها للشبكة؟ (اختر: 'ممتصة' أو 'موردة'):",
                "answerType": "mcq",
                "expected": "ممتصة" if enters_positive else "موردة",
                "context": {"topic": "electric_circuits"},
                "hints": [
                    "إذا كانت إشارة القدرة $P > 0$ فالعنصر يمتص قدرة (يستهلكها كحمل أو مقاومة).",
                    "إذا كانت $P < 0$ فالعنصر يولد أو يورد طاقة للدائرة (كمصدر جهد أو تيار).",
                    f"الإجابة هي: {verdict_str}."
                ]
            }
        ]

        return {
            "id": prob_id,
            "courseCode": "electric_circuits",
            "topic": "circuits_power",
            "topicName": "حساب القدرة واتفاقية الإشارات (Sign Convention)",
            "difficulty": 1,
            "steps": steps
        }

    @classmethod
    def get_problem(cls, course_code: str, topic: Optional[str] = None) -> Dict[str, Any]:
        """Dispatches to the appropriate problem generator based on course/topic."""
        if course_code == "linear_algebra":
            if topic == "matrix_inverse":
                return cls.generate_matrix_inverse_2x2()
            return cls.generate_linear_algebra_det()

        elif course_code == "computer_fundamentals":
            if topic == "twos_complement":
                return cls.generate_twos_complement()
            return cls.generate_base_conversion()

        elif course_code == "electric_circuits":
            return cls.generate_electric_circuits_power()

        # Default fallback
        return cls.generate_linear_algebra_det()
