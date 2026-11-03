"""
JooPrep Database Layer (SQLite)
Handles persistent storage for:
- Users & profile (College, Year, Quota)
- Quiz Attempts & intermediate step logs
- Viva Sessions & Turns
- Smart Prep Sheets
- Readiness Index records
- Error Notebook
"""

import sqlite3
import json
import os
from datetime import datetime

# Vercel serverless environment allows writing only to /tmp
if os.environ.get("VERCEL") or "/var/task" in os.path.abspath(__file__):
    DB_PATH = "/tmp/jooprep.db"
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), "jooprep.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        college TEXT DEFAULT 'كلية الحاسبات والمعلومات',
        academic_year TEXT DEFAULT 'الفرقة الأولى',
        daily_quota_viva INTEGER DEFAULT 3,
        daily_quota_prep INTEGER DEFAULT 5,
        quota_used_today_viva INTEGER DEFAULT 0,
        quota_used_today_prep INTEGER DEFAULT 0,
        last_quota_reset TEXT,
        created_at TEXT
    )
    """)

    # Quiz Attempts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        uid TEXT,
        course_code TEXT,
        topic TEXT,
        mode TEXT, -- practice, exam, error_notebook
        score REAL,
        total_steps INTEGER,
        correct_steps INTEGER,
        step_results_json TEXT, -- array of {stepId, answer, correct, errorType, hintsUsed}
        created_at TEXT
    )
    """)

    # Viva Sessions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS viva_sessions (
        id TEXT PRIMARY KEY,
        uid TEXT,
        course_code TEXT,
        persona TEXT,
        level INTEGER,
        language TEXT,
        status TEXT, -- in_progress, completed
        score REAL,
        total_turns INTEGER,
        project_map_json TEXT,
        final_report_json TEXT,
        created_at TEXT
    )
    """)

    # Viva Turns
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS viva_turns (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        turn_number INTEGER,
        question TEXT,
        student_answer TEXT,
        score REAL,
        verdict TEXT, -- correct, partial, wrong
        critique TEXT,
        missing_json TEXT,
        topic TEXT,
        difficulty INTEGER,
        created_at TEXT,
        FOREIGN KEY(session_id) REFERENCES viva_sessions(id)
    )
    """)

    # Prep Sheets
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prep_sheets (
        id TEXT PRIMARY KEY,
        uid TEXT,
        course_code TEXT,
        code_snippet TEXT,
        questions_json TEXT,
        created_at TEXT
    )
    """)

    # Error Notebook
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS error_notebook (
        id TEXT PRIMARY KEY,
        uid TEXT,
        course_code TEXT,
        topic TEXT,
        problem_id TEXT,
        problem_title TEXT,
        step_id TEXT,
        error_type TEXT,
        diagnosis_msg TEXT,
        student_answer TEXT,
        expected_answer TEXT,
        resolved INTEGER DEFAULT 0,
        created_at TEXT
    )
    """)

    # Readiness Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS readiness (
        uid TEXT,
        course_code TEXT,
        q_score REAL,
        v_score REAL,
        readiness_score REAL,
        updated_at TEXT,
        PRIMARY KEY (uid, course_code)
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")
