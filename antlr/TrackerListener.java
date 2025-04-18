import org.antlr.v4.runtime.tree.ParseTree;
import java.util.*;
import org.json.JSONObject;


public class TrackerListener extends SocialMediaBaseListener {
    int totalFollowers = 0;
    int totalFollowing = 0;
    int totalLikes = 0;
    int totalComments = 0;
    int totalPosts = 0;
    double averageLikes = 0.0;
    double averageComments = 0.0;
    int inactiveFollowers = 0;
    double engagementRate = 0.0;
    int inactiveStreak = 0;
    Map<String, Double> engagementPerMonth = new HashMap<>();
    Map<String, Double> engagementPerYear = new HashMap<>();
    Map<String, Integer> postsPerMonth = new HashMap<>();
    Map<String, Integer> postsPerYear = new HashMap<>();
    Map<String, Integer> likesPerMonth = new HashMap<>();
    Map<String, Integer> likesPerYear = new HashMap<>();
    Map<String, Integer> commentsPerMonth = new HashMap<>();
    Map<String, Integer> commentsPerYear = new HashMap<>();


    @Override
    public void enterPair(SocialMediaParser.PairContext ctx) {
        String key = ctx.STRING().getText().replace("\"", "");
        String value = ctx.value().getText().replace("\"", "");

        try {
            int num = Integer.parseInt(value);

            switch (key) {
                case "followers":
                    totalFollowers = num;
                    break;
                case "following":
                    totalFollowing = num;
                    break;
                case "likes":
                    totalLikes = num;
                    break;
                case "comments":
                    totalComments = num;
                    break;
                case "posts":
                    totalPosts = num;
                    break;
                case "inactiveFollowers":
                    inactiveFollowers = num;
                    break;
                case "averageLikes":
                    averageLikes = Double.parseDouble(value);
                    break;
                case "averageComments":
                    averageComments = Double.parseDouble(value);
                    break;
                case "engagementRate":
                    engagementRate = Double.parseDouble(value);
                    break;
                case "engagementPerMonth":
                    engagementPerMonth = parseJsonMapToDouble(value);
                    break;
                case "engagementPerYear":
                    engagementPerYear = parseJsonMapToDouble(value);
                    break;
                case "postsPerMonth":
                    postsPerMonth = parseJsonMapToInt(value);
                    break;
                case "postsPerYear":
                    postsPerYear = parseJsonMapToInt(value);
                    break;
                case "likesPerMonth":
                    likesPerMonth = parseJsonMapToInt(value);
                    break;
                case "likesPerYear":
                    likesPerYear = parseJsonMapToInt(value);
                    break;
                case "commentsPerMonth":
                    commentsPerMonth = parseJsonMapToInt(value);
                    break;
                case "commentsPerYear":
                    commentsPerYear = parseJsonMapToInt(value);
                    break;
                case "inactiveStreak":
                    inactiveStreak = num;
                    break;
            }
        } catch (NumberFormatException ignored) {}
    }
    
    private Map<String, Double> parseJsonMapToDouble(String json) {
        Map<String, Double> map = new HashMap<>();
        JSONObject obj = new JSONObject(json);
        for (String key : obj.keySet()) {
            map.put(key, obj.getDouble(key));
        }
        return map;
    }

    private Map<String, Integer> parseJsonMapToInt(String json) {
        Map<String, Integer> map = new HashMap<>();
        JSONObject obj = new JSONObject(json);
        for (String key : obj.keySet()) {
            map.put(key, obj.getInt(key));
        }
        return map;
    }

    public void report() {
        JSONObject json = new JSONObject();
        json.put("Total Followers ", totalFollowers);
        json.put("Total Following ", totalFollowing);
        json.put("Total Likes on Posts ", totalLikes);
        json.put("Total Comments ", totalComments);
        json.put("Total Posts ", totalPosts);
        json.put("Average Likes per Post ", averageLikes);
        json.put("Average Comments per Post ",averageComments);
        json.put("Inactive Followers ", inactiveFollowers);
        json.put("Overall Engagement Rate ", engagementRate);
        json.put("Engagement Rate Per Month ", engagementPerMonth);
        json.put("Engagement Rate Per Year ", engagementPerYear);
        json.put("Posts per Month ", postsPerMonth);
        json.put("Posts per Year ", postsPerYear);
        json.put("Likes per Month ", likesPerMonth);
        json.put("Likes per Year ", likesPerYear);
        json.put("Comments per Month ", commentsPerMonth);
        json.put("Comments per Year ", commentsPerYear);
        json.put("Inactive Streak ", inactiveStreak);

        System.out.println(json.toString());
    }
}
