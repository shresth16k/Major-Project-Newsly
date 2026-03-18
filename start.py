"""
Newsly Unified Starter
Run this single file to start the entire application.
Access the app at: http://localhost:5173
"""

import subprocess
import sys
import os
import time
import webbrowser
from threading import Thread

def run_flask():
    """Run Flask backend silently"""
    env = os.environ.copy()
    env['FLASK_ENV'] = 'production'
    subprocess.run(
        [sys.executable, 'app.py'],
        env=env,
        stdout=subprocess.DEVNULL,  # Hide Flask output
        stderr=subprocess.DEVNULL
    )

import shutil

def run_vite():
    """Run Vite dev server"""
    os.chdir('newsly-react')
    npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
    
    # Check if npm.cmd is in PATH; if not, fallback to D:\node
    if os.name == 'nt' and not shutil.which('npm.cmd'):
        fallback_path = r'D:\node\npm.cmd'
        if os.path.exists(fallback_path):
            npm_cmd = fallback_path

    subprocess.run([npm_cmd, 'run', 'dev'])

def main():
    print("=" * 50)
    print("🚀 Starting Newsly...")
    print("=" * 50)
    
    # Start Flask in background (hidden)
    flask_thread = Thread(target=run_flask, daemon=True)
    flask_thread.start()
    print("✓ Backend API started")
    
    # Wait for Flask to initialize
    time.sleep(2)
    
    print("✓ Starting frontend...")
    print("")
    print("=" * 50)
    print("🌐 Open: http://localhost:5173")
    print("=" * 50)
    print("")
    
    # Open browser automatically
    time.sleep(3)
    webbrowser.open('http://localhost:5173')
    
    # Run Vite (this blocks)
    run_vite()

if __name__ == '__main__':
    main()
