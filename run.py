"""
JooPrep Launcher
Starts the Flask server hosting both the REST API backend and the Frontend SPA.
"""

import sys
import os

# Set UTF-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Ensure backend directory is in python search path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("=" * 65)
    print(">> JooPrep Platform (v2) is running successfully!")
    print(f">> Open in browser: http://localhost:{port}")
    print("=" * 65)
    app.run(host="0.0.0.0", port=port, debug=False)
