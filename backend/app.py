
import random
import time
from flask import Flask, request, jsonify
import instaloader, os, json, uuid
from flask_cors import CORS
import tempfile
from datetime import datetime
from collections import Counter, defaultdict

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

    
    if code:
        print("Attempting login with 2FA...")
        try:
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

            loader.login(username, password)

        except instaloader.exceptions.TwoFactorAuthRequiredException:
            try:
                
                loader.context.two_factor_login(code)

                loader.save_session_to_file(session_file_path)

                print("2FA Login successful. Fetching data...")
                time.sleep(30)
                fetch_and_process(loader, username)

                if os.path.exists(session_file_path):
                    os.remove(session_file_path)

                return jsonify({"status": "success", "session_id": session_id})

            except Exception as e:
                print("2FA failed:", e)
                return jsonify({"error": f"2FA failed: {e}"}), 403

        except instaloader.exceptions.BadCredentialsException:
            return jsonify({"error": "Invalid username or password."}), 401

        except Exception as e:
            print("Login failed:", e)
            return jsonify({"error": f"Login failed: {e}"}), 403


    else:
        print("Attempting login without 2FA...")
        try:
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

            loader.login(username, password)

        except instaloader.exceptions.TwoFactorAuthRequiredException:
            print("2FA required — saving session.")
            with open(session_file_path, "wb") as f:
                loader.context.save_session_to_file(f)
            return jsonify({"status": "two_factor", "session_id": session_id})

        except instaloader.exceptions.BadCredentialsException:
            return jsonify({"error": "Invalid username or password."}), 401

        except Exception as e:
            print("Login error:", e)
            return jsonify({"error": "Login Failed. Please Try Again."}), 403

        
        loader.save_session_to_file(session_file_path)

        print("Login successful. Fetching and processing data...")
        try:
            fetch_and_process(loader, username)
        except Exception as e:
            print("Fetch or processing failed:", e)
            return jsonify({"error": "Instagram temporarily blocked data access. Please try again later."}), 403

        if os.path.exists(session_file_path):
            os.remove(session_file_path)

        return jsonify({"status": "success", "session_id": session_id})


@app.route("/get-summary/<session_id>")
def get_summary(session_id):
    
    antlr_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "antlr", "summary.json"))
    if os.path.exists(antlr_path):
        with open(antlr_path, "r") as f:
            return jsonify(json.load(f))
    return jsonify({"error": "Summary not found."}), 404
        
def fetch_and_process(loader, username):


    print("Fetching Instagram post metadata without saving individual files...")
    time.sleep(15)
    profile = instaloader.Profile.from_username(loader.context, username)

    result = {
        "followers": profile.followers,
        "following": profile.followees,
        "likes": 0,
        "comments": 0,
        "postDates": [],
        "inactiveFollowers": 0,
        "posts": 0,
        "averageLikes": 0.0,
        "averageComments": 0.0,
        "engagementRate": 0.0,
        "engagementPerMonth": {},
        "engagementPerYear": {},
        "postsPerMonth": {},
        "postsPerYear": {},
        "likesPerMonth": {},
        "likesPerYear": {},
        "commentsPerMonth": {},
        "commentsPerYear": {},
        "inactiveStreak": 0
    }
    
    likesPerMonth = defaultdict(int)
    likesPerYear = defaultdict(int)
    commentsPerMonth = defaultdict(int)
    commentsPerYear = defaultdict(int)
    engagementPerMonth = defaultdict(list)
    engagementPerYear = defaultdict(list)
    
    postDates = []
    prevDate = None
    longestInactive = 0

    for post in profile.get_posts():
        result["likes"] += post.likes
        result["comments"] += post.comments
        result["postDates"].append(int(post.date_utc.timestamp()))
        postDates.append(post.date_utc)
        
        result["posts"] += 1
        
        if prevDate:
            gap = (post.date_utc - prevDate).days
            if gap > longestInactive:
                longestInactive = gap
        prevDate = post.date_utc
        
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

    result["averageLikes"] = round(result["likes"] / result["posts"], 2)
    result["averageComments"] = round(result["comments"] / result["posts"], 2)
    result["inactiveFollowers"] = profile.followers - result["likes"]
    result["engagementRate"] = round((result["likes"] + result["comments"]) / profile.followers * 100, 2)
    
    months = [datetime.fromtimestamp(date).strftime("%Y-%m") for date in result["postDates"]]
    years = [datetime.fromtimestamp(date).strftime("%Y") for date in result["postDates"]]
    
    result["postsPerMonth"] = dict(Counter(months))
    result["postsPerYear"] = dict(Counter(years))
    result["likesPerMonth"] = dict(likesPerMonth)
    result["likesPerYear"] = dict(likesPerYear)
    result["commentsPerMonth"] = dict(commentsPerMonth)
    result["commentsPerYear"] = dict(commentsPerYear)
    result["engagementPerMonth"] = {k: round(sum(v) / len(v), 2) for k, v in engagementPerMonth.items()}
    result["engagementPerYear"] = {k: round(sum(v) / len(v), 2) for k, v in engagementPerYear.items()}
    result["inactiveStreak"] = longestInactive
    
    #Summary.json
    antlr_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "antlr"))
    summary_path = os.path.join(antlr_dir, "summary.json")

    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=4)

    print("Saved optimized summary.json.")
    
   
    antlr_jar = os.path.join(antlr_dir, "antlr-4.13.2-complete.jar")
    class_path = f"{antlr_dir};{antlr_jar}"
    os.chdir(antlr_dir) 

    os.system(f'java -cp "{class_path}" Main "{summary_path}"')

    
if __name__ == "__main__":
    app.run(debug=True)