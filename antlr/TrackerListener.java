import org.antlr.v4.runtime.tree.ParseTree;
import java.util.*;

public class TrackerListener extends SocialMediaBaseListener {
    int totalFollowers = 0;
    int totalFollowing = 0;
    int totalLikes = 0;
    int totalComments = 0;
    int totalShares = 0;
    int totalSaves = 0;

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
                case "shares":
                    totalShares = num;
                    break;
                case "saves":
                    totalSaves = num;
                    break;
            }
        } catch (NumberFormatException ignored) {}
    }

    public void report() {
        System.out.println("--- Social Media Engagement Report ---");
        System.out.println("Total Followers: " + totalFollowers);
        System.out.println("Total Following: " + totalFollowing);
        System.out.println("Total Likes on Posts: " + totalLikes);
        System.out.println("Total Comments: " + totalComments);
        System.out.println("Total Shares: " + totalShares);
        System.out.println("Total Saves: " + totalSaves);
    }
}
