"""
Step Solver & Hint Ladder Controller for JooPrep Math Engine
"""

from typing import Dict, Any, Optional
from .normalizer import compare_answers
from .classifier import classify_error

class StepSolver:
    @staticmethod
    def evaluate_step(
        step: Dict[str, Any],
        student_answer: Any,
        hint_index: int = 0
    ) -> Dict[str, Any]:
        """
        Evaluates a single step submission:
        - Checks correctness via Answer Normalizer
        - Classifies error patterns if wrong
        - Returns appropriate hint ladder slice
        """
        expected = step.get("expected")
        answer_type = step.get("answerType", "number")
        context = step.get("context", {})
        hints = step.get("hints", [])

        # Check correctness
        is_correct = compare_answers(student_answer, expected, answer_type)

        if is_correct:
            return {
                "correct": True,
                "errorTag": "correct",
                "diagnosis": "إجابة ممتازة! الخطوة صحيحة 100%.",
                "tip": "",
                "nextStepAvailable": True
            }

        # Classify the specific error
        classification = classify_error(student_answer, expected, answer_type, context)

        # Available hint up to hint_index
        active_hint = None
        if hints and 0 <= hint_index < len(hints):
            active_hint = hints[hint_index]

        return {
            "correct": False,
            "errorTag": classification.get("tag", "unknown"),
            "diagnosis": classification.get("diagnosis", "الحسابات غير متطابقة"),
            "tip": classification.get("tip", ""),
            "activeHint": active_hint,
            "totalHints": len(hints),
            "nextStepAvailable": False
        }
