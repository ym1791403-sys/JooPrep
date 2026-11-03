"""
JooPrep Automated Test Suite
Validates Section 11 & Section 17 requirements:
- Math normalizer handles fractions, spaces, Arabic commas, unicode dashes
- Matrix parsing and transpose detection
- Base conversions (reversed remainder trap detection)
- Circuit power sign rules
- Viva Turn evaluation schema conformity
"""

import unittest
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from math_engine.normalizer import parse_number, parse_matrix, normalize_base_string, compare_answers
from math_engine.classifier import classify_error
from math_engine.generator import ProblemEngine
from viva_engine.code_parser import CodeAnalyzer
from viva_engine.evaluator import VivaSessionManager

class TestJooPrepEngine(unittest.TestCase):

    def test_answer_normalizer_numbers_and_fractions(self):
        # Standard decimal
        self.assertEqual(parse_number("0.5"), 0.5)
        # Arabic comma
        self.assertEqual(parse_number("0,5"), 0.5)
        # Fractions
        self.assertEqual(parse_number("1/2"), 0.5)
        self.assertEqual(parse_number("-3/6"), -0.5)
        # Signed negative zero
        self.assertEqual(parse_number("-0"), 0.0)
        # Unicode minus
        self.assertEqual(parse_number("−4"), -4.0)

    def test_answer_normalizer_matrices(self):
        mat1 = parse_matrix("[[1, 2], [3, 4]]")
        mat2 = parse_matrix("1 2; 3 4")
        self.assertIsNotNone(mat1)
        self.assertIsNotNone(mat2)
        self.assertTrue(compare_answers(mat1, mat2, "matrix"))

    def test_classifier_sign_error(self):
        res = classify_error(student_raw=5, expected_raw=-5, answer_type="number")
        self.assertEqual(res["tag"], "sign")
        self.assertIn("الإشارة", res["diagnosis"])

    def test_classifier_forgot_det(self):
        res = classify_error(student_raw=12, expected_raw=4, answer_type="number", context={"det": 3})
        self.assertEqual(res["tag"], "forgot-det")
        self.assertIn("det(A)", res["diagnosis"])

    def test_classifier_reversed_binary(self):
        # Student wrote 001 instead of 100
        res = classify_error(student_raw="001", expected_raw="100", answer_type="baseN")
        self.assertEqual(res["tag"], "reversed-remainder")
        self.assertIn("تحت لفوق", res["diagnosis"])

    def test_circuit_power_sign(self):
        res = classify_error(student_raw=24, expected_raw=-24, answer_type="number", context={"is_power_question": True})
        self.assertEqual(res["tag"], "circuit-power-sign")
        self.assertIn("إشارة القدرة", res["diagnosis"])

    def test_problem_generators(self):
        prob_det = ProblemEngine.generate_linear_algebra_det()
        self.assertIn("steps", prob_det)
        self.assertTrue(len(prob_det["steps"]) >= 3)

        prob_base = ProblemEngine.generate_base_conversion()
        self.assertIn("steps", prob_base)

        prob_circ = ProblemEngine.generate_electric_circuits_power()
        self.assertIn("steps", prob_circ)

    def test_code_analyzer(self):
        sample_cpp = """
        #include <iostream>
        using namespace std;

        int calculateFactorial(int n) {
            if (n <= 1) return 1;
            return n * calculateFactorial(n - 1);
        }

        int main() {
            int* ptr = new int[100];
            cout << calculateFactorial(5) << endl;
            return 0;
        }
        """
        pmap = CodeAnalyzer.analyze_code(sample_cpp)
        self.assertEqual(pmap["language"], "cpp")
        self.assertTrue(any(fn["name"] == "calculateFactorial" for fn in pmap["functions"]))
        self.assertTrue(any("Recursion" in a for a in pmap["algorithms"]))
        self.assertTrue(any("Memory Leak" in r or "حجز ديناميكي" in r for r in pmap["riskPoints"]))

    def test_viva_evaluation_rubric(self):
        pmap = {"functions": [{"name": "computeSum"}], "complexity": "O(N)"}
        eval_res = VivaSessionManager.evaluate_turn(
            student_answer="التعقيد الزمني هو O(N) لأننا نمر على العناصر مرة واحدة والذاكرة O(1) لأن المتغيرات تخزن على الـ Stack ولا يوجد Memory Leak",
            current_question="ما هو التعقيد الزمني والمكاني؟",
            turn_number=1,
            max_turns=3,
            project_map=pmap,
            persona_id="academic_prof",
            language="mixed",
            level=2
        )
        self.assertIn("score", eval_res)
        self.assertIn("verdict", eval_res)
        self.assertGreaterEqual(eval_res["score"], 7.0)
        self.assertIsNotNone(eval_res["nextQuestion"])

if __name__ == "__main__":
    unittest.main()
