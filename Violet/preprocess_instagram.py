import json
import os

# Input files
post_files = ["Prom.json", "Loading 20%.json", "3hree musketeers.json"]
profile_file = "ig1.eli_15886891709.json"

# Aggregated results
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

# Extract followers/following
if os.path.exists(profile_file):
    with open(profile_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        if "node" in data:
            node = data["node"]
            result["following"] = node.get("edge_follow", {}).get("count", 0)
            result["followers"] = node.get("edge_followed_by", {}).get("count", 0)

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
    if not os.path.exists(filename):
        continue

    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
        if isinstance(data, dict):
            data = [data]

        for post in data:
            node = post.get("node", post)

            # Likes
            likes = node.get("edge_media_preview_like", {}).get("count", 0)
            result["likes"] += likes

            # Comments (recursive fallback)
            result["comments"] += count_comments_recursive(node)

            # Timestamp
            if "taken_at_timestamp" in node:
                result["post_dates"].append(node["taken_at_timestamp"])

            # Caption
            if "edge_media_to_caption" in node:
                edges = node["edge_media_to_caption"].get("edges", [])
                if edges:
                    result["captions"].append(edges[0].get("node", {}).get("text", ""))

# Output the summary
with open("summary.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=4)

print("✅ Saved summary.json:")
print(json.dumps(result, indent=4))
