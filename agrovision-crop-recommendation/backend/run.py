"""
Entry point to run AgroVision AI Crop Recommendation Backend.
"""
import sys
import os

# Add the parent directory of backend to sys.path so relative imports work seamlessly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from backend.app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"==================================================")
    print(f" AgroVision AI — Crop Recommendation Backend Service")
    print(f" Running on http://127.0.0.1:{port}")
    print(f"==================================================")
    app.run(host='127.0.0.1', port=port, debug=False)
