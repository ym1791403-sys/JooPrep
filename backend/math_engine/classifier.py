"""
Error Classifier for JooPrep Math Engine
Follows Section 5.2 and Section 13 of JooPrep v2 Specifications.
Diagnoses student common traps without giving away the full answer immediately.
"""

from typing import Any, Optional, Dict, List
from .normalizer import (
    parse_number,
    are_numbers_close,
    parse_matrix,
    are_matrices_close,
    normalize_base_string
)

def transpose_matrix(matrix: List[List[float]]) -> List[List[float]]:
    """Transposes a 2D matrix."""
    return [list(row) for row in zip(*matrix)]

def multiply_matrix_scalar(matrix: List[List[float]], scalar: float) -> List[List[float]]:
    """Multiplies each element of a 2D matrix by a scalar."""
    return [[val * scalar for val in row] for row in matrix]

def classify_error(
    student_raw: Any,
    expected_raw: Any,
    answer_type: str,
    context: Optional[Dict[str, Any]] = None
) -> Dict[str, str]:
    """
    Classifies the error into one of the canonical categories:
    - 'correct': Correct answer!
    - 'sign': Inverted sign (+ instead of -, or vice versa)
    - 'forgot-det': Forgot to divide by det(A)
    - 'forgot-transpose': Forgot to transpose the cofactor matrix
    - 'reversed-remainder': Reading remainders from top to bottom
    - 'circuit-power-sign': Inverted absorbed/supplied convention
    - 'unknown': General calculation mismatch
    
    Returns a dict: {'tag': tag, 'diagnosis': message, 'tip': helpful hint}
    """
    if context is None:
        context = {}

    # 1. Numeric / Fraction checks
    if answer_type in ('number', 'fraction'):
        s_val = parse_number(student_raw)
        e_val = parse_number(expected_raw)

        if s_val is None:
            return {
                "tag": "invalid-format",
                "diagnosis": "صيغة الرقم غير واضحة",
                "tip": "اكتب الرقم بصيغة عشرية (مثلاً 0.5) أو كسر اعتيادي (مثلاً 1/2)."
            }

        # Check if exactly correct
        if e_val is not None and are_numbers_close(s_val, e_val):
            return {
                "tag": "correct",
                "diagnosis": "إجابة صحيحة تماماً! أحسنت.",
                "tip": ""
            }

        # Check if circuit power sign error
        if context.get("topic") == "electric_circuits" or context.get("is_power_question"):
            if e_val is not None and are_numbers_close(s_val, -e_val):
                return {
                    "tag": "circuit-power-sign",
                    "diagnosis": "إشارة القدرة غير صحيحة",
                    "tip": "راجع قاعدة الإشارات: القدرة الممتصة (+P) تكون موجبة إذا دخل التيار من الطرف الموجب، وسالبة (-P) إذا كانت موردة."
                }

        # Check generic sign error
        if e_val is not None and are_numbers_close(s_val, -e_val):
            return {
                "tag": "sign",
                "diagnosis": "الرقم صح والإشارة غلط",
                "tip": "راجع شبكة الإشارات (+ / -) بدقة، وتأكد من علامات الطرح والضرب."
            }

        # Check forgot-det in scalar context (e.g. cramer's rule or single element)
        det = context.get("det")
        if det and e_val is not None and are_numbers_close(s_val, e_val * det):
            return {
                "tag": "forgot-det",
                "diagnosis": "ناقصك تقسم على المحدد det(A)",
                "tip": f"تذكر أن القيمة النهائية تقسم على قيمة المحدد الأصلي ({det})."
            }

        return {
            "tag": "unknown",
            "diagnosis": "الحسابات غير متطابقة",
            "tip": "أعد مراجعة الخطوة بهدوء أو اضغط على زر سلم التلميحات للمساعدة."
        }

    # 2. Matrix checks
    elif answer_type == 'matrix':
        s_mat = parse_matrix(student_raw)
        e_mat = parse_matrix(expected_raw)

        if s_mat is None:
            return {
                "tag": "invalid-format",
                "diagnosis": "صيغة المصفوفة غير صحيحة",
                "tip": "استخدم لوحة إدخال المصفوفة المدمجة لتسهيل الكتابة."
            }

        if e_mat and are_matrices_close(s_mat, e_mat):
            return {
                "tag": "correct",
                "diagnosis": "المصفوفة صحيحة تماماً!",
                "tip": ""
            }

        # Check transpose mistake
        if e_mat:
            e_transposed = transpose_matrix(e_mat)
            if are_matrices_close(s_mat, e_transposed):
                return {
                    "tag": "forgot-transpose",
                    "diagnosis": "المرافقات محتاجة تبديل الصفوف بالأعمدة (Transpose)",
                    "tip": "المصفوفة الملحقة Adj(A) هي مدوّر مصفوفة المرافقات (الصف الأول يصبح العمود الأول)."
                }

        # Check forgot-det in matrix inverse
        det = context.get("det")
        if det and e_mat:
            adj = multiply_matrix_scalar(e_mat, det)
            if are_matrices_close(s_mat, adj):
                return {
                    "tag": "forgot-det",
                    "diagnosis": "نسيان القسمة على المحدد det(A)",
                    "tip": f"حسبت مصفوفة المرافقات أو الملحقة بنجاح، لكن باقي قسمة كل عنصر على المحدد det(A) = {det}."
                }
            adj_transposed = transpose_matrix(adj)
            if are_matrices_close(s_mat, adj_transposed):
                return {
                    "tag": "forgot-det-and-transpose",
                    "diagnosis": "نسيان التحويل Transpose والقسمة على المحدد",
                    "tip": "ناقصك تدوير المصفوفة (Transpose) ثم قسمة كل عنصر على قيمة المحدد."
                }

        # Check sign error on entire matrix
        if e_mat:
            neg_e = multiply_matrix_scalar(e_mat, -1.0)
            if are_matrices_close(s_mat, neg_e):
                return {
                    "tag": "sign",
                    "diagnosis": "إشارات عناصر المصفوفة معكوسة بالكامل",
                    "tip": "راجع قاعدة إشارات المرافقات: (+ - +) / (- + -) / (+ - +)."
                }

        return {
            "tag": "unknown",
            "diagnosis": "أرقام المصفوفة غير مطابقة",
            "tip": "راجع حسابات المرافقات والمحددات الصغرى (Minors) لكل عنصر."
        }

    # 3. Base Conversion checks
    elif answer_type == 'baseN':
        s_norm = normalize_base_string(student_raw)
        e_norm = normalize_base_string(expected_raw)

        if s_norm == e_norm:
            return {
                "tag": "correct",
                "diagnosis": "التحويل صحيح 100%!",
                "tip": ""
            }

        # Check reverse reading trap (e.g. read top to bottom instead of bottom to top)
        if s_norm == e_norm[::-1] and len(e_norm) > 1:
            return {
                "tag": "reversed-remainder",
                "diagnosis": "اقرا البواقي من تحت لفوق (من الأسفل للأعلى)",
                "tip": "في التحويل بطريقة القسمة المتتالية، آخر باقي قسمة هو الـ Most Significant Bit ويكتب في أقصى اليسار."
            }

        return {
            "tag": "unknown",
            "diagnosis": "الرقم المحول غير مطابق",
            "tip": "راجع خطوات القسمة المتكررة وتجميع البواقي."
        }

    # 4. MCQ or General
    else:
        s_clean = str(student_raw).strip().lower()
        e_clean = str(expected_raw).strip().lower()
        if s_clean == e_clean:
            return {
                "tag": "correct",
                "diagnosis": "إجابة صحيحة!",
                "tip": ""
            }
        return {
            "tag": "wrong",
            "diagnosis": "الإجابة المختارة غير صحيحة",
            "tip": "فكر في المفهوم النظري للسؤال أو راجع التلميح."
        }
