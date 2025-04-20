
from collections import Counter, defaultdict
import random
import time
from flask import Flask, request, jsonify
import instaloader, os, json, uuid
from flask_cors import CORS
import tempfile
from datetime import datetime
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def inst_login():
    data = request.get_json()
    username, password, code = data.get('username'), data.get('password'), data.get('code')
    
    session_id = data.get("session_id")
    if not session_id or not isinstance(session_id, str) or not session_id.strip():
        session_id = str(uuid.uuid4())
        
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
    
    session_file_path = os.path.join(tempfile.gettempdir(), f"{username}_{session_id}.session")
    
    loader = instaloader.Instaloader(
    download_pictures=False,
    download_videos=False,
    download_video_thumbnails=False,
    download_geotags=False,
    compress_json=False,
    save_metadata=True,
    filename_pattern="{target}_{date_utc}",
    post_metadata_txt_pattern=""
    )
    
    try:
            print("Attempting login...")
            loader.login(username, password)
            print("Login Successful but 2FA is disabled. Rejecting.")
            return jsonify({"error": "Please enable Authentication app 2FA in your account to use this service."}), 403

    except instaloader.exceptions.TwoFactorAuthRequiredException:
        if not code:
            print("2FA required.")
            return jsonify({"status": "two_factor", "session_id": session_id})

        try:
            print("Submitting 2FA code...")
            loader.context.two_factor_login(code)

            loader.save_session_to_file(session_file_path)
            print("2FA login successful. Fetching data...")
            fetch_and_process(loader, username)
            os.remove(session_file_path)
            return jsonify({"status": "success", "session_id": session_id})
        
        except Exception as e:
            err_str = str(e).lower()
            if "code is no longer valid" in err_str or "challenge" in err_str:
                print("SMS 2FA detected. Aborting login to avoid re-triggering code.")
                return jsonify({
                    "status": "sms_2fa",
                    "message": "SMS 2FA is not supported. Please use an Authenticator App.",
                    "session_id": session_id
                }), 403
            
            print("2FA failed:", e)
            return jsonify({"error": f"2FA failed: {e}"}), 403

    except instaloader.exceptions.BadCredentialsException:
        return jsonify({"error": "Invalid username or password."}), 401

    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": f"Login Failed: {e}"}), 403

@app.route("/get-summary/<session_id>")
def get_summary(session_id):
    try:
        antlr_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "antlr"))
        summary_path = os.path.join(antlr_dir, "summary.json")
        antlr_jar = os.path.join(antlr_dir, "antlr-4.13.2-complete.jar")
        json_jar = os.path.join(antlr_dir, "json-20230618.jar")
        class_path = f"{antlr_dir};{antlr_jar};{json_jar}"

        result = subprocess.check_output(
            ["java", "-cp", class_path, "Main", summary_path],
            cwd=antlr_dir
        ).decode("utf-8")

        return jsonify(json.loads(result))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
def fetch_and_process(loader, username):

    print("Fetching Instagram post metadata without saving individual files...")
    profile = instaloader.Profile.from_username(loader.context, username)

    result = {
        "followers": profile.followers,
        "following": profile.followees,
        "likes": 0,
        "comments": 0,
        "postDates": [],
        "posts": 0,
        "engagementRate": 0.0,
        "engagementPerMonth": {},
        "engagementPerYear": {},
        "postsPerMonth": {},
        "postsPerYear": {},
        "likesPerMonth": {},
        "likesPerYear": {},
        "commentsPerMonth": {},
        "commentsPerYear": {}
    }
    likesPerMonth = defaultdict(int)
    likesPerYear = defaultdict(int)
    commentsPerMonth = defaultdict(int)
    commentsPerYear = defaultdict(int)
    engagementPerMonth = defaultdict(list)
    engagementPerYear = defaultdict(list)
    
    postDates = []
   
    for post in profile.get_posts():
        result["likes"] += post.likes
        result["comments"] += post.comments
        result["postDates"].append(int(post.date_utc.timestamp()))
        postDates.append(post.date_utc)
        
        result["posts"] += 1
        
        month = post.date_utc.strftime("%Y-%m")
        year = post.date_utc.strftime("%Y")
        
        likesPerMonth[month] += post.likes
        likesPerYear[year] += post.likes
        commentsPerMonth[month] += post.comments
        commentsPerYear[year] += post.comments
        
        engagement = (post.likes + post.comments) / profile.followers * 100 if profile.followers else 0
        engagementPerMonth[month].append(engagement)
        engagementPerYear[year].append(engagement)
         
        time.sleep(random.uniform(0.5, 1.5))  
    
    result["engagementRate"] = round(((result["likes"] + result["comments"]) / result["posts"]) / profile.followers * 100, 2) if profile.followers and result["posts"] else 0.0
        
    months = [datetime.fromtimestamp(date).strftime("%Y-%m") for date in result["postDates"]]
    years = [datetime.fromtimestamp(date).strftime("%Y") for date in result["postDates"]]
    
    result["postsPerMonth"] = dict(Counter(months))
    result["postsPerYear"] = dict(Counter(years))
    result["likesPerMonth"] = dict(likesPerMonth)
    result["likesPerYear"] = dict(likesPerYear)
    result["commentsPerMonth"] = dict(commentsPerMonth)
    result["commentsPerYear"] = dict(commentsPerYear)
    
    result["engagementPerMonth"] = {
    month: round(((likesPerMonth[month] + commentsPerMonth[month]) / (result["postsPerMonth"][month]) / profile.followers) * 100, 2)
    for month in result["postsPerMonth"]
    if result["postsPerMonth"][month] > 0 and profile.followers > 0
    }

    result["engagementPerYear"] = {
        year: round(((likesPerYear[year] + commentsPerYear[year]) / (result["postsPerYear"][year]) / profile.followers) * 100, 2)
        for year in result["postsPerYear"]
        if result["postsPerYear"][year] > 0 and profile.followers > 0
    }     
   
    antlr_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "antlr"))
    summary_path = os.path.join(antlr_dir, "summary.json")

    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=4)

    print("Saved optimized summary.json.")
    
    antlr_jar = os.path.join(antlr_dir, "antlr-4.13.2-complete.jar")
    json_jar = os.path.join(antlr_dir, "json-20230618.jar")
    class_path = f"{antlr_dir};{antlr_jar};{json_jar}"

    os.chdir(antlr_dir) 

    subprocess.run(
    ["java", "-cp", class_path, "Main", summary_path],
    cwd=antlr_dir,
    check=True
    )
    
if __name__ == "__main__":
    app.run(debug=True)