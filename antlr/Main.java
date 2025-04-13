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
        int shares = 0;
        int saves = 0;

        @Override
        public void enterPair(SocialMediaParser.PairContext ctx) {
            String key = ctx.STRING().getText().replaceAll("\"", "");
            String val = ctx.value().getText();

            switch (key) {
                case "followers": followers = Integer.parseInt(val); break;
                case "following": following = Integer.parseInt(val); break;
                case "likes": likes = Integer.parseInt(val); break;
                case "comments": comments = Integer.parseInt(val); break;
                case "shares": shares = Integer.parseInt(val); break;
                case "saves": saves = Integer.parseInt(val); break;
            }
        }

        public void report() {
            System.out.println("--- Social Media Engagement Report ---");
            System.out.println("Total Followers: " + followers);
            System.out.println("Total Following: " + following);
            System.out.println("Total Likes on Posts: " + likes);
            System.out.println("Total Comments: " + comments);
            System.out.println("Total Shares: " + shares);
            System.out.println("Total Saves: " + saves);
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
