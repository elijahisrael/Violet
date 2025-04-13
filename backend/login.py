from flask import Flask, request, jsonify
import os, json, uuid, instaloader

base_dir = os.path.dirname(os.path.abspath(__file__))
user_data_dir = os.path.join(base_dir, "..", "user_data")
sessions = {}


app = Flask(__name__)

@app.route('/login', methods=['POST'])
def inst_login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
    session_id = str(uuid.uuid4())
    user_dir = os.path.join(user_data_dir, session_id)
    os.makedirs(user_dir, exist_ok=True)
    loader = instaloader.Instaloader(dirname_pattern=user_dir, download_pictures=False, download_videos=False, compress_json=False)
    
    try:
        loader.login(username, password)
        fetch_and_process(loader, username, session_id)
        return jsonify({"status": "success", "session_id": session_id})
    except instaloader.exceptions.TwoFactorAuthRequiredException:
        sessions[session_id] = {"username": username, "password": password}
        return jsonify({"status": "two_factor_required", "session_id": session_id})
    except instaloader.exceptions.BadCredentialsException:
        return jsonify({"error": "Invalid credentials."}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 403
    
@app.route('/two_factor', methods=['POST'])
def two_factor_auth():
    data = request.get_json()
    session_id, code = data.get('session_id'), data.get('code')
    if session_id not in sessions:
        return jsonify({"error": "Invalid session ID."}), 400
    session = sessions[session_id]
    loader = instaloader.Instaloader(dirname_pattern=os.path.join(user_data_dir, session_id), download_pictures=False, download_videos=False, compress_json=False)
    
    try:
        loader.two_factor_login(session["username"], session["password"], code)
        fetch_and_process(loader, session["username"], session_id)
        return jsonify({"status": "success", "session_id": session_id})
    except Exception:
        return jsonify({"error": "Invalid two-factor authentication code."}), 403

@app.route("/get-summary/<session_id>")
def get_summary(session_id):
    user_dir = os.path.join(user_data_dir, session_id)
    for user in os.listdir(user_dir):
        summary_path = os.path.join(user_dir, user, "summary.json")
        if os.path.exists(summary_path):
            with open(summary_path, "r") as f:
                return jsonify(json.load(f))
            return jsonify({"error": "Summary not found."}), 404
        
def fetch_and_process(loader, username, session_id):
    loader.download_profile(username, profile_pic=False, fast_update=True)
    user_path = os.path.join(user_data_dir, session_id, username)
    os.chdir(user_path)
    os.system("python ../../../backend/preprocess_instagram.py")
    
if __name__ == "__main__":
    app.run(debug=True)