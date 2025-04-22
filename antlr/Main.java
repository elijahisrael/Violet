import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;
import java.io.File;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.json.JSONObject;

public class Main {
    static class Tracker extends SocialMediaBaseListener {
        int followers = 0;
        int following = 0;
        int likes = 0;
        int comments = 0;
        int postCount = 0;
        double averageLikes = 0.0;
        double averageComments = 0.0;
        long daysSinceLastPost = 0;
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

        List<Long> postTimestamps = new ArrayList<>();
    
        @Override
        public void enterPair(SocialMediaParser.PairContext ctx) {
            if (ctx.STRING() == null || ctx.value() == null) return;
            String key = ctx.STRING().getText().replaceAll("\"", "");
            String val = ctx.value().getText();
            try {
                switch (key) {
                    case "followers": followers = Integer.parseInt(val); break;
                    case "following": following = Integer.parseInt(val); break;
                    case "likes": likes = Integer.parseInt(val); break;
                    case "comments": comments = Integer.parseInt(val); break;
                    case "posts": postCount = Integer.parseInt(val); break;
                    case "postDates":
                        val = val.replace("[", "").replace("]", "").replaceAll("\\s", "");
                        if (!val.isEmpty()) {
                            for (String dt : val.split(",")) {
                                postTimestamps.add(Long.parseLong(dt));
                            }
                        }
                        break;
                        case "engagementRate": engagementRate = Double.parseDouble(val); break;
                        case "engagementPerMonth": engagementPerMonth = parseJsonMapToDouble(val); break;
                        case "engagementPerYear": engagementPerYear = parseJsonMapToDouble(val); break;
                        case "postsPerMonth": postsPerMonth = parseJsonMapToInt(val); break;
                        case "postsPerYear": postsPerYear = parseJsonMapToInt(val); break;
                        case "likesPerMonth": likesPerMonth = parseJsonMapToInt(val); break;
                        case "likesPerYear": likesPerYear = parseJsonMapToInt(val); break;
                        case "commentsPerMonth": commentsPerMonth = parseJsonMapToInt(val); break;
                        case "commentsPerYear": commentsPerYear = parseJsonMapToInt(val); break;
                }
            } 
            catch (Exception e) {
                System.err.println("Error parsing key: " + key + ", value: " + val);
                e.printStackTrace();
            }
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

        public void calculate() {
            if (postCount > 0) {
                averageLikes = Math.round(((double) likes / postCount) * 100.0) / 100.0;
                averageComments = Math.round(((double) comments / postCount) * 100.0) / 100.0;
            }

            if (!postTimestamps.isEmpty()) {
                long recentPost = postTimestamps.stream().max(Long::compareTo).get();
                long current = System.currentTimeMillis() / 1000;
                daysSinceLastPost = (current - recentPost) / (24 * 60 * 60);
            }

            if (postTimestamps.size() > 1) {
                Collections.sort(postTimestamps);
                long longestGap = 0;
                for (int i = 1; i < postTimestamps.size(); i++) {
                    long gapSec = postTimestamps.get(i) - postTimestamps.get(i - 1);
                    long gapDays = gapSec / (24 * 60 * 60);
                    if (gapDays > longestGap) {
                        longestGap = gapDays;
                    }
                }
                inactiveStreak = (int) longestGap;
            }
        }

        public void report() {
            calculate();

            JSONObject json = new JSONObject();
            json.put("Total Followers ", followers);
            json.put("Total Following ", following);
            json.put("Total Likes on Posts ", likes);
            json.put("Total Comments ", comments);
            json.put("Total Posts ", postCount);
            json.put("Average Likes per Post ", averageLikes);
            json.put("Average Comments per Post ",averageComments);
            json.put("Days Since Last Post ", daysSinceLastPost);
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

    public static void main(String[] args) throws Exception {
        try {
            String filename = args.length > 0 ? args[0] : "summary.json";

            Tracker tracker = new Tracker();
            ParseTreeWalker walker = new ParseTreeWalker();

            CharStream input = CharStreams.fromFileName(filename);
            SocialMediaLexer lexer = new SocialMediaLexer(input);
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            SocialMediaParser parser = new SocialMediaParser(tokens);
            ParseTree tree = parser.json();
            walker.walk(tracker, tree);

            tracker.report();
        } 
        catch (Exception e) {
            System.err.println("Java Execution failed:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}