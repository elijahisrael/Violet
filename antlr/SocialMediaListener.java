// Generated from SocialMedia.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link SocialMediaParser}.
 */
public interface SocialMediaListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link SocialMediaParser#json}.
	 * @param ctx the parse tree
	 */
	void enterJson(SocialMediaParser.JsonContext ctx);
	/**
	 * Exit a parse tree produced by {@link SocialMediaParser#json}.
	 * @param ctx the parse tree
	 */
	void exitJson(SocialMediaParser.JsonContext ctx);
	/**
	 * Enter a parse tree produced by {@link SocialMediaParser#object}.
	 * @param ctx the parse tree
	 */
	void enterObject(SocialMediaParser.ObjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link SocialMediaParser#object}.
	 * @param ctx the parse tree
	 */
	void exitObject(SocialMediaParser.ObjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link SocialMediaParser#pair}.
	 * @param ctx the parse tree
	 */
	void enterPair(SocialMediaParser.PairContext ctx);
	/**
	 * Exit a parse tree produced by {@link SocialMediaParser#pair}.
	 * @param ctx the parse tree
	 */
	void exitPair(SocialMediaParser.PairContext ctx);
	/**
	 * Enter a parse tree produced by {@link SocialMediaParser#array}.
	 * @param ctx the parse tree
	 */
	void enterArray(SocialMediaParser.ArrayContext ctx);
	/**
	 * Exit a parse tree produced by {@link SocialMediaParser#array}.
	 * @param ctx the parse tree
	 */
	void exitArray(SocialMediaParser.ArrayContext ctx);
	/**
	 * Enter a parse tree produced by the {@code StringValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void enterStringValue(SocialMediaParser.StringValueContext ctx);
	/**
	 * Exit a parse tree produced by the {@code StringValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void exitStringValue(SocialMediaParser.StringValueContext ctx);
	/**
	 * Enter a parse tree produced by the {@code NumberValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void enterNumberValue(SocialMediaParser.NumberValueContext ctx);
	/**
	 * Exit a parse tree produced by the {@code NumberValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void exitNumberValue(SocialMediaParser.NumberValueContext ctx);
	/**
	 * Enter a parse tree produced by the {@code ObjectValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void enterObjectValue(SocialMediaParser.ObjectValueContext ctx);
	/**
	 * Exit a parse tree produced by the {@code ObjectValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void exitObjectValue(SocialMediaParser.ObjectValueContext ctx);
	/**
	 * Enter a parse tree produced by the {@code ArrayValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void enterArrayValue(SocialMediaParser.ArrayValueContext ctx);
	/**
	 * Exit a parse tree produced by the {@code ArrayValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void exitArrayValue(SocialMediaParser.ArrayValueContext ctx);
	/**
	 * Enter a parse tree produced by the {@code TrueValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void enterTrueValue(SocialMediaParser.TrueValueContext ctx);
	/**
	 * Exit a parse tree produced by the {@code TrueValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void exitTrueValue(SocialMediaParser.TrueValueContext ctx);
	/**
	 * Enter a parse tree produced by the {@code FalseValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void enterFalseValue(SocialMediaParser.FalseValueContext ctx);
	/**
	 * Exit a parse tree produced by the {@code FalseValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void exitFalseValue(SocialMediaParser.FalseValueContext ctx);
	/**
	 * Enter a parse tree produced by the {@code NullValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void enterNullValue(SocialMediaParser.NullValueContext ctx);
	/**
	 * Exit a parse tree produced by the {@code NullValue}
	 * labeled alternative in {@link SocialMediaParser#value}.
	 * @param ctx the parse tree
	 */
	void exitNullValue(SocialMediaParser.NullValueContext ctx);
}