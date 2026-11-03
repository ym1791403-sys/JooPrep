"""
JooPrep Backend Application (Flask REST API)
Provides full API for:
- Step-by-Step Quizzes (Deterministic Math Engine)
- Oral Viva Defense Simulator (Personas & Rubrics)
- Smart Prep Sheet Generator
- Readiness Index & Topic Heatmap
- Error Notebook
"""

import os
import sys
import json
import uuid

# Set UTF-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
from datetime import datetime, date
from flask import Flask, request, jsonify, send_from_directory

from database import init_db, get_db
from math_engine import ProblemEngine, StepSolver
from viva_engine import CodeAnalyzer, PERSONAS, get_persona, VivaSessionManager, PrepSheetGenerator
from readiness import ReadinessCalculator

# Initialize Flask app
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
app = Flask(__name__, static_folder=os.path.join(FRONTEND_DIR, "static"), template_folder=FRONTEND_DIR)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

# Initialize database
init_db()

# Default Demo User ID
DEMO_UID = "user_fcaistudent_2026"

def get_or_create_user(uid=DEMO_UID):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE uid = ?", (uid,))
    row = cursor.fetchone()
    today_str = date.today().isoformat()

    if not row:
        cursor.execute("""
            INSERT INTO users (uid, name, email, college, academic_year, daily_quota_viva, daily_quota_prep, quota_used_today_viva, quota_used_today_prep, last_quota_reset, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (uid, "أحمد محمود", "ahmed.cs@university.edu.eg", "كلية الحاسبات والذكاء الاصطناعي", "الفرقة الأولى", 3, 5, 0, 0, today_str, datetime.now().isoformat()))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE uid = ?", (uid,))
        row = cursor.fetchone()
    else:
        # Reset daily quota if new day
        if row["last_quota_reset"] != today_str:
            cursor.execute("""
                UPDATE users SET quota_used_today_viva = 0, quota_used_today_prep = 0, last_quota_reset = ?
                WHERE uid = ?
            """, (today_str, uid))
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE uid = ?", (uid,))
            row = cursor.fetchone()

    user_dict = dict(row)
    conn.close()
    return user_dict

# ----------------- User Profile Endpoints -----------------

@app.route("/api/user/profile", methods=["GET"])
def get_profile():
    user = get_or_create_user()
    return jsonify({"success": True, "user": user})

@app.route("/api/user/profile", methods=["POST"])
def update_profile():
    data = request.json or {}
    name = data.get("name", "طالب حاسبات")
    college = data.get("college", "كلية الحاسبات والمعلومات")
    academic_year = data.get("academic_year", "الفرقة الأولى")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users SET name = ?, college = ?, academic_year = ? WHERE uid = ?
    """, (name, college, academic_year, DEMO_UID))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "تم تحديث الملف الشخصي بنجاح"})

# ----------------- Quiz Endpoints (Deterministic Math Engine) -----------------

@app.route("/api/quiz/problem", methods=["GET"])
def get_quiz_problem():
    course = request.args.get("course", "linear_algebra")
    topic = request.args.get("topic")
    problem = ProblemEngine.get_problem(course, topic)
    return jsonify({"success": True, "problem": problem})

@app.route("/api/quiz/step/evaluate", methods=["POST"])
def evaluate_quiz_step():
    data = request.json or {}
    step = data.get("step", {})
    student_answer = data.get("studentAnswer")
    hint_index = data.get("hintIndex", 0)

    result = StepSolver.evaluate_step(step, student_answer, hint_index)
    return jsonify({"success": True, "result": result})

@app.route("/api/quiz/attempt/save", methods=["POST"])
def save_quiz_attempt():
    data = request.json or {}
    course_code = data.get("courseCode", "linear_algebra")
    topic = data.get("topic", "determinant_3x3")
    mode = data.get("mode", "practice")
    score = float(data.get("score", 0.0))
    total_steps = int(data.get("totalSteps", 1))
    correct_steps = int(data.get("correctSteps", 0))
    step_results = data.get("stepResults", [])
    problem_title = data.get("problemTitle", "مسألة رياضية")

    attempt_id = f"att_{uuid.uuid4().hex[:8]}"
    created_at = datetime.now().isoformat()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO quiz_attempts (id, uid, course_code, topic, mode, score, total_steps, correct_steps, step_results_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (attempt_id, DEMO_UID, course_code, topic, mode, score, total_steps, correct_steps, json.dumps(step_results), created_at))

    # Log mistakes to Error Notebook
    for res in step_results:
        if not res.get("correct") and res.get("errorType") not in ("correct", "invalid-format"):
            err_id = f"err_{uuid.uuid4().hex[:8]}"
            cursor.execute("""
                INSERT INTO error_notebook (id, uid, course_code, topic, problem_id, problem_title, step_id, error_type, diagnosis_msg, student_answer, expected_answer, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                err_id, DEMO_UID, course_code, topic,
                data.get("problemId", "prob"),
                problem_title,
                res.get("stepId", "step"),
                res.get("errorType", "unknown"),
                res.get("diagnosis", ""),
                str(res.get("studentAnswer", "")),
                str(res.get("expected", "")),
                created_at
            ))

    conn.commit()
    conn.close()

    return jsonify({"success": True, "attemptId": attempt_id})

# ----------------- Viva Defense Endpoints -----------------

@app.route("/api/viva/personas", methods=["GET"])
def get_personas():
    return jsonify({"success": True, "personas": list(PERSONAS.values())})

@app.route("/api/viva/start", methods=["POST"])
def start_viva():
    data = request.json or {}
    code = data.get("code", "")
    persona_id = data.get("personaId", "strict_ta")
    level = int(data.get("level", 2))
    language = data.get("language", "mixed")
    course_code = data.get("courseCode", "programming")

    # Analyze student code safely as data
    project_map = CodeAnalyzer.analyze_code(code)

    # Initial opening question
    initial_turn = VivaSessionManager.generate_initial_question(project_map, persona_id, language, level)

    session_id = f"viva_{uuid.uuid4().hex[:8]}"
    created_at = datetime.now().isoformat()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO viva_sessions (id, uid, course_code, persona, level, language, status, score, total_turns, project_map_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'in_progress', 0.0, 0, ?, ?)
    """, (session_id, DEMO_UID, course_code, persona_id, level, language, json.dumps(project_map), created_at))

    # Save first turn question
    turn_id = f"turn_{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO viva_turns (id, session_id, turn_number, question, difficulty, topic, created_at)
        VALUES (?, ?, 1, ?, ?, ?, ?)
    """, (turn_id, session_id, initial_turn["question"], level, initial_turn["topic"], created_at))

    # Increment quota
    cursor.execute("""
        UPDATE users SET quota_used_today_viva = quota_used_today_viva + 1 WHERE uid = ?
    """, (DEMO_UID,))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "sessionId": session_id,
        "projectMap": project_map,
        "initialTurn": initial_turn
    })

@app.route("/api/viva/turn", methods=["POST"])
def submit_viva_turn():
    data = request.json or {}
    session_id = data.get("sessionId")
    student_answer = data.get("answer", "")
    turn_number = int(data.get("turnNumber", 1))
    max_turns = int(data.get("maxTurns", 5))

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM viva_sessions WHERE id = ?", (session_id,))
    session = cursor.fetchone()

    if not session:
        conn.close()
        return jsonify({"success": False, "error": "الجلسة غير موجودة"}), 404

    project_map = json.loads(session["project_map_json"])
    persona_id = session["persona"]
    language = session["language"]
    level = session["level"]

    # Retrieve current turn question
    cursor.execute("SELECT question FROM viva_turns WHERE session_id = ? AND turn_number = ?", (session_id, turn_number))
    turn_row = cursor.fetchone()
    current_question = turn_row["question"] if turn_row else "سؤال المناقشة"

    # Evaluate turn
    evaluation = VivaSessionManager.evaluate_turn(
        student_answer=student_answer,
        current_question=current_question,
        turn_number=turn_number,
        max_turns=max_turns,
        project_map=project_map,
        persona_id=persona_id,
        language=language,
        level=level
    )

    created_at = datetime.now().isoformat()

    # Update turn in DB
    cursor.execute("""
        UPDATE viva_turns
        SET student_answer = ?, score = ?, verdict = ?, critique = ?, missing_json = ?
        WHERE session_id = ? AND turn_number = ?
    """, (student_answer, evaluation["score"], evaluation["verdict"], evaluation["critique"], json.dumps(evaluation["missing"]), session_id, turn_number))

    # If there is a next question, insert it
    if evaluation.get("nextQuestion"):
        next_turn_id = f"turn_{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO viva_turns (id, session_id, turn_number, question, difficulty, topic, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (next_turn_id, session_id, turn_number + 1, evaluation["nextQuestion"], level, evaluation["topic"], created_at))

    conn.commit()
    conn.close()

    return jsonify({"success": True, "evaluation": evaluation})

@app.route("/api/viva/finish", methods=["POST"])
def finish_viva():
    data = request.json or {}
    session_id = data.get("sessionId")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM viva_sessions WHERE id = ?", (session_id,))
    session = cursor.fetchone()

    if not session:
        conn.close()
        return jsonify({"success": False, "error": "الجلسة غير موجودة"}), 404

    cursor.execute("SELECT * FROM viva_turns WHERE session_id = ? AND student_answer IS NOT NULL", (session_id,))
    turns = [dict(r) for r in cursor.fetchall()]

    project_map = json.loads(session["project_map_json"])
    persona_id = session["persona"]

    final_report = VivaSessionManager.generate_final_report(turns, project_map, persona_id)

    # Update session status
    cursor.execute("""
        UPDATE viva_sessions
        SET status = 'completed', score = ?, total_turns = ?, final_report_json = ?
        WHERE id = ?
    """, (final_report["overallScore"], len(turns), json.dumps(final_report), session_id))

    conn.commit()
    conn.close()

    return jsonify({"success": True, "finalReport": final_report})

# ----------------- Smart Prep Sheet Endpoints -----------------

@app.route("/api/prep-sheet/generate", methods=["POST"])
def generate_prep_sheet():
    data = request.json or {}
    code = data.get("code", "")
    course_code = data.get("courseCode", "programming")

    project_map = CodeAnalyzer.analyze_code(code)
    questions = PrepSheetGenerator.generate_sheet(project_map, course_code)

    sheet_id = f"prep_{uuid.uuid4().hex[:8]}"
    created_at = datetime.now().isoformat()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO prep_sheets (id, uid, course_code, code_snippet, questions_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (sheet_id, DEMO_UID, course_code, code[:1500], json.dumps(questions), created_at))

    # Increment quota
    cursor.execute("""
        UPDATE users SET quota_used_today_prep = quota_used_today_prep + 1 WHERE uid = ?
    """, (DEMO_UID,))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "sheetId": sheet_id,
        "projectMap": project_map,
        "questions": questions
    })

@app.route("/api/prep-sheet/latest", methods=["GET"])
def get_latest_prep_sheet():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM prep_sheets WHERE uid = ? ORDER BY created_at DESC LIMIT 1", (DEMO_UID,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": True, "sheet": None})

    sheet = dict(row)
    sheet["questions"] = json.loads(sheet["questions_json"])
    return jsonify({"success": True, "sheet": sheet})

# ----------------- Readiness Index Endpoint -----------------

@app.route("/api/readiness", methods=["GET"])
def get_readiness():
    conn = get_db()
    cursor = conn.cursor()

    # Get quiz attempts
    cursor.execute("SELECT * FROM quiz_attempts WHERE uid = ? ORDER BY created_at ASC", (DEMO_UID,))
    quiz_attempts = [dict(r) for r in cursor.fetchall()]

    # Get completed viva sessions
    cursor.execute("SELECT * FROM viva_sessions WHERE uid = ? AND status = 'completed' ORDER BY created_at ASC", (DEMO_UID,))
    viva_sessions = [dict(r) for r in cursor.fetchall()]

    conn.close()

    readiness_data = ReadinessCalculator.calculate(quiz_attempts, viva_sessions)
    return jsonify({"success": True, "readiness": readiness_data})

# ----------------- Error Notebook Endpoints -----------------

@app.route("/api/error-notebook", methods=["GET"])
def get_error_notebook():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM error_notebook WHERE uid = ? ORDER BY created_at DESC", (DEMO_UID,))
    items = [dict(r) for r in cursor.fetchall()]
    conn.close()

    # Group by error_type
    grouped = {}
    for item in items:
        err = item["error_type"]
        if err not in grouped:
            grouped[err] = []
        grouped[err].append(item)

    return jsonify({"success": True, "items": items, "grouped": grouped})

@app.route("/api/error-notebook/resolve", methods=["POST"])
def resolve_error():
    data = request.json or {}
    item_id = data.get("id")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE error_notebook SET resolved = 1 WHERE id = ? AND uid = ?", (item_id, DEMO_UID))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "تم حل الخطأ بنجاح"})

# ----------------- Frontend & Static Serving -----------------

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def static_files(path):
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, "index.html")

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 JooPrep Platform (v2) Backend is starting...")
    print("📍 Local URL: http://localhost:5000")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=False)
