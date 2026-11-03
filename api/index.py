import sys
import os

# Ensure current directory is in sys.path so all local modules load seamlessly
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from app import app

# Vercel Serverless WSGI callable
# Exported as 'app'
