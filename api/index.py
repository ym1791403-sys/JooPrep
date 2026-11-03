import sys
import os
import traceback

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

try:
    from app import app
except Exception as e:
    from flask import Flask
    err_trace = traceback.format_exc()
    app = Flask(__name__)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def error_page(path):
        return f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><title>JooPrep Server Note</title></head>
<body style="background:#070a12;color:#f8fafc;font-family:sans-serif;padding:2rem;">
  <h2 style="color:#f43f5e">تنبيه تشغيل الخادم السحابي</h2>
  <p>جارِ استعادة الاتصال بالقاعدة السحابية:</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:0.75rem;overflow:auto;direction:ltr;">{err_trace}</pre>
</body>
</html>""", 200, {"Content-Type": "text/html; charset=utf-8"}
