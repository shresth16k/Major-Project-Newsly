#!/usr/bin/env python3
"""
Script to start Flask app with ngrok tunnel for temporary public access
"""
import threading
import time
from pyngrok import ngrok
from app import app

def start_flask():
    """Start the Flask application"""
    app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

if __name__ == '__main__':
    # Start Flask in a separate thread
    flask_thread = threading.Thread(target=start_flask, daemon=True)
    flask_thread.start()
    
    # Give Flask a moment to start
    time.sleep(2)
    
    # Create ngrok tunnel
    try:
        # Open a tunnel to port 5000
        public_url = ngrok.connect(5000)
        print(f"\n🌐 Your Flask app is now publicly accessible at:")
        print(f"   {public_url}")
        print(f"\n📋 Share this URL with Gemini or anyone else!")
        print(f"🔒 This tunnel will stay active until you stop this script (Ctrl+C)")
        print(f"\n⚡ Local URL: http://127.0.0.1:5000")
        print(f"🌍 Public URL: {public_url}")
        
        # Keep the script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"\n🛑 Shutting down tunnel...")
            ngrok.disconnect(public_url)
            ngrok.kill()
            
    except Exception as e:
        print(f"❌ Error creating tunnel: {e}")
        print("💡 You might need to sign up for a free ngrok account at https://ngrok.com/")