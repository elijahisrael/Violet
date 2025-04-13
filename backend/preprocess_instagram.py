import json
import os
import re

subdir = [d for d in os.listdir() if os.path.isdir(d)]
if len(subdir) == 1:
    os.chdir(subdir[0])

def get_profile_file():
    for f in os.listdir():
        if re.match(r'^[\w.]+_\d+\.json$', f):
            try:
                with open(f, "r", encoding="utf-8") as file:
                    data = json.load(file)
                    if "node" in data and "edge_followed_by" in data["node"]:
                        return f
            except Exception as e:
                print(f"Error reading {f}: {e}")
    return None

profile_file = get_profile_file()
post_files = [f for f in os.listdir() if f.endswith(".json") and f != profile_file]

result = {
    "followers": 0,
    "following": 0,
    "likes": 0,
    "comments": 0,
    "shares": 0,
    "saves": 0,
    "post_dates": [],
    "captions": []
}

if profile_file:
    with open(profile_file, "r", encoding="utf-8") as f:
        node = json.load(f).get("node", {})
        result["followers"] = node.get("edge_followed_by", {}).get("count", 0)
        result["following"] = node.get("edge_follow", {}).get("count", 0)

# Helper: recursively find all comment_count values
def count_comments_recursive(obj):
    count = 0
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "comment_count" and isinstance(v, int):
                count += v
            else:
                count += count_comments_recursive(v)
    elif isinstance(obj, list):
        for item in obj:
            count += count_comments_recursive(item)
    return count

# Extract data from post files
for filename in post_files:
    try:

        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)
            node = data.get("node", data)
            
            # Likes
            likes = node.get("edge_media_preview_like", {}).get("count", 0)
            result["likes"] += likes
            
            # Timestamp
            if "taken_at_timestamp" in node:
                result["post_dates"].append(node["taken_at_timestamp"])
                
            #Caption
            caption_edges = node.get("edge_media_to_caption", {}).get("edges", [])
            if caption_edges:
                result["captions"].append(caption_edges[0].get("node", {}).get("text", ""))
    except Exception as e:
        print(f"Error processing {filename}: {e}")
        
# Output the summary
with open("summary.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=4)

print("✅ Saved summary.json:")
print(json.dumps(result, indent=4))
