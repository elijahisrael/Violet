import org.antlr.v4.runtime.tree.ParseTree;
import java.util.*;

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
                case "averageLikes":
                    averageLikes = Double.parseDouble(value);
                    break;
                case "averageComments":
                    averageComments = Double.parseDouble(value);
                    break;
                case "inactiveFollowers":
                    inactiveFollowers = num;
                    break;
                case "engagementRate":
                    engagementRate = Double.parseDouble(value);
                    break;
                case "engagementPerMonth":
                    engagementPerMonth = Double.parseDouble(value);
                    break;
                case "engagementPerYear":
                    engagementPerYear = Double.parseDouble(value);
                    break;
                case "postsPerMonth":
                    postsPerMonth = num;
                    break;
                case "postsPerYear":
                    postsPerYear = num;
                    break;
                case "likesPerMonth":
                    likesPerMonth = num;
                    break;
                case "likesPerYear":
                    likesPerYear = num;
                    break;
                case "commentsPerMonth":
                    commentsPerMonth = num;
                    break;
                case "commentsPerYear":
                    commentsPerYear = num;
                    break;
                case "inactiveStreak":
                    inactiveStreak = num;
                    break;
            }
        } catch (NumberFormatException ignored) {}
    }

    public void report() {
        System.out.println("Total Followers: " + totalFollowers);
        System.out.println("Total Following: " + totalFollowing);
        System.out.println("Total Likes on Posts: " + totalLikes);
        System.out.println("Total Comments: " + totalComments);
        System.out.println("Total Posts: " + totalPosts);
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
