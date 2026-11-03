"""
Deterministic Answer Normalizer for JooPrep Math Engine
Follows Section 5.1 & Section 13/14 of JooPrep v2 Specifications.
- Handles float, fractions (1/2, 0.5, 2/4), signed numbers (-0 -> 0), unicode minus
- Normalizes matrices (e.g. [[1,2],[3,4]], row formats, commas, spaces)
- Normalizes number base strings (hex, octal, binary)
- Normalizes algebraic expressions
"""

import re
import math
from typing import Any, Union, List, Optional

def clean_arabic_symbols(raw: str) -> str:
    """Standardizes Arabic characters, unicode dashes, and commas."""
    if not isinstance(raw, str):
        raw = str(raw)
    s = raw.strip()
    s = s.replace('−', '-').replace('–', '-').replace('—', '-')
    s = s.replace('،', ',')
    # Arabic-Indic digits to standard digits
    arabic_digits = "٠١٢٣٤٥٦٧٨٩"
    for i, d in enumerate(arabic_digits):
        s = s.replace(d, str(i))
    return s

def parse_number(raw: Any) -> Optional[float]:
    """
    Parses a student numeric input into float, handling:
    - standard decimals: 0.5, -3.14
    - fractions: 1/2, -3/4
    - commas as decimal points: 0,5
    - sign variations: -0 -> 0.0
    """
    if raw is None:
        return None
    if isinstance(raw, (int, float)):
        return 0.0 if raw == 0 else float(raw)
    
    s = clean_arabic_symbols(str(raw))
    # Replace comma with dot if it's decimal
    if ',' in s and '/' not in s:
        s = s.replace(',', '.')

    # Fraction check: a / b
    frac_match = re.match(r'^(-?\d+(?:\.\d+)?)\s*/\s*(-?\d+(?:\.\d+)?)$', s)
    if frac_match:
        numerator = float(frac_match.group(1))
        denominator = float(frac_match.group(2))
        if denominator == 0:
            return None
        res = numerator / denominator
        return 0.0 if abs(res) < 1e-12 else res

    # Single number
    num_match = re.match(r'^-?\d+(?:\.\d+)?$', s)
    if num_match:
        val = float(s)
        return 0.0 if abs(val) < 1e-12 else val

    return None

def are_numbers_close(a: float, b: float, tol: float = 1e-5) -> bool:
    """Checks whether two numbers are equal within a strict tolerance."""
    return abs(a - b) <= tol

def parse_matrix(raw: Any) -> Optional[List[List[float]]]:
    """
    Parses matrix inputs in various formats:
    - JSON or nested arrays: [[1, 2], [3, 4]]
    - Semicolon or newline rows: 1 2; 3 4
    - Comma/space separated rows
    """
    if raw is None:
        return None
    if isinstance(raw, list):
        try:
            parsed = []
            for row in raw:
                if isinstance(row, list):
                    parsed_row = [float(parse_number(x)) for x in row]
                    parsed.append(parsed_row)
                elif isinstance(row, (int, float)):
                    # Flat list of 4 or 9 elements
                    parsed.append([float(row)])
                else:
                    return None
            return parsed
        except Exception:
            return None

    s = clean_arabic_symbols(str(raw)).strip()

    # Try json parse if starts with [[
    if s.startswith('[') and s.endswith(']'):
        try:
            import json
            data = json.loads(s)
            if isinstance(data, list):
                return parse_matrix(data)
        except Exception:
            pass

    # Extract bracketed rows e.g. [1, 2], [3, 4]
    bracket_rows = re.findall(r'\[([^\]]+)\]', s)
    if bracket_rows:
        rows_raw = bracket_rows
    else:
        # Split by semicolon or newline
        rows_raw = re.split(r'[;\n]+', s)

    matrix = []
    for r in rows_raw:
        r_clean = r.strip().replace('[', '').replace(']', '')
        if not r_clean:
            continue
        items = re.split(r'[, \t]+', r_clean)
        row_vals = []
        for it in items:
            it = it.strip()
            if not it:
                continue
            num = parse_number(it)
            if num is None:
                return None
            row_vals.append(num)
        if row_vals:
            matrix.append(row_vals)

    if not matrix:
        return None
    row_len = len(matrix[0])
    if any(len(r) != row_len for r in matrix):
        return None
    return matrix

def are_matrices_close(m1: List[List[float]], m2: List[List[float]], tol: float = 1e-5) -> bool:
    """Compares two matrices element by element."""
    if len(m1) != len(m2):
        return False
    for r1, r2 in zip(m1, m2):
        if len(r1) != len(r2):
            return False
        for val1, val2 in zip(r1, r2):
            if not are_numbers_close(val1, val2, tol):
                return False
    return True

def normalize_base_string(raw: Any) -> str:
    """Strips base prefixes (0b, 0x, 0o), spaces, and converts to uppercase."""
    s = clean_arabic_symbols(str(raw)).strip().upper()
    if s.startswith("0X"):
        s = s[2:]
    elif s.startswith("0B"):
        s = s[2:]
    elif s.startswith("0O"):
        s = s[2:]
    return re.sub(r'\s+', '', s)

def compare_answers(student_raw: Any, expected: Any, answer_type: str) -> bool:
    """
    Main dispatch normalizer for comparing student input to ground truth.
    answer_type in ['number', 'fraction', 'matrix', 'baseN', 'expression', 'mcq']
    """
    if student_raw is None or expected is None:
        return False

    if answer_type in ('number', 'fraction'):
        s_num = parse_number(student_raw)
        e_num = parse_number(expected)
        if s_num is not None and e_num is not None:
            return are_numbers_close(s_num, e_num)
        return False

    elif answer_type == 'matrix':
        s_mat = parse_matrix(student_raw)
        e_mat = parse_matrix(expected)
        if s_mat is not None and e_mat is not None:
            return are_matrices_close(s_mat, e_mat)
        return False

    elif answer_type == 'baseN':
        s_norm = normalize_base_string(student_raw)
        e_norm = normalize_base_string(expected)
        return s_norm == e_norm

    elif answer_type == 'mcq':
        s_clean = clean_arabic_symbols(str(student_raw)).strip().lower()
        e_clean = clean_arabic_symbols(str(expected)).strip().lower()
        return s_clean == e_clean

    else:
        # Default string trim comparison
        s_clean = clean_arabic_symbols(str(student_raw)).strip().replace(' ', '')
        e_clean = clean_arabic_symbols(str(expected)).strip().replace(' ', '')
        return s_clean.lower() == e_clean.lower()
