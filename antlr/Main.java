import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;
import java.io.File;
import java.util.*;

public class Main {
    static class Tracker extends SocialMediaBaseListener {
        int followers = 0;
        int following = 0;
        int likes = 0;
        int comments = 0;
        int postCount = 0;
        double averageLikes = 0.0;
        double averageComments = 0.0;
        int inactiveFollowers = 0;
        double engagementRate = 0.0;
        double engagementPerMonth = 0.0;
        double engagementPerYear = 0.0;
        int postsPerMonth = 0;
        int postsPerYear = 0;
        int likesPerMonth = 0;
        int likesPerYear = 0;
        int commentsPerMonth = 0;
        int commentsPerYear = 0;
        int inactiveStreak = 0;

        @Override
        public void enterPair(SocialMediaParser.PairContext ctx) {
            String key = ctx.STRING().getText().replaceAll("\"", "");
            String val = ctx.value().getText();

            switch (key) {
                case "followers": followers = Integer.parseInt(val); break;
                case "following": following = Integer.parseInt(val); break;
                case "likes": likes = Integer.parseInt(val); break;
                case "comments": comments = Integer.parseInt(val); break;
                case "posts": postCount = Integer.parseInt(val); break;
                case "averageLikes": averageLikes = Double.parseDouble(val); break;
                case "averageComments": averageComments = Double.parseDouble(val); break;
                case "inactiveFollowers": inactiveFollowers = Integer.parseInt(val); break;
                case "engagementRate": engagementRate = Double.parseDouble(val); break;
                case "engagementPerMonth": engagementPerMonth = Double.parseDouble(val); break;
                case "engagementPerYear": engagementPerYear = Double.parseDouble(val); break;
                case "postsPerMonth": postsPerMonth = Integer.parseInt(val); break;
                case "postsPerYear": postsPerYear = Integer.parseInt(val); break;
                case "likesPerMonth": likesPerMonth = Integer.parseInt(val); break;
                case "likesPerYear": likesPerYear = Integer.parseInt(val); break;
                case "commentsPerMonth": commentsPerMonth = Integer.parseInt(val); break;
                case "commentsPerYear": commentsPerYear = Integer.parseInt(val); break;
                case "inactiveStreak": inactiveStreak = Integer.parseInt(val); break;
            }
        }

        public void report() {
            System.out.println("Total Followers: " + followers);
            System.out.println("Total Following: " + following);
            System.out.println("Total Likes on Posts: " + likes);
            System.out.println("Total Comments: " + comments);
            System.out.println("Total Posts: " + postCount);
            System.out.println("Average Likes per Post: " + averageLikes);
            System.out.println("Average Comments per Post: " + averageComments);
            System.out.println("Inactive Followers: " + inactiveFollowers);
            System.out.println("Overall Engagement Rate: " + engagementRate + "%");
            System.out.println("Engagement Rate Per Month: " + engagementPerMonth);
            System.out.println("Engagement Rate Per Year: " + engagementPerYear);
            System.out.println("Posts per Month: " + postsPerMonth);
            System.out.println("Posts per Year: " + postsPerYear);
            System.out.println("Likes per Month: " + likesPerMonth);
            System.out.println("Likes per Year: " + likesPerYear);
            System.out.println("Comments per Month: " + commentsPerMonth);
            System.out.println("Comments per Year: " + commentsPerYear);
            System.out.println("Inactive Streak: " + inactiveStreak);
        }
    }

    public static void main(String[] args) throws Exception {
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
}
