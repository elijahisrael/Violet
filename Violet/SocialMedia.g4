grammar SocialMedia;

json
    : object EOF
    ;

object
    : '{' pair (',' pair)* '}'
    ;

pair
    : STRING ':' value
    ;

array
    : '[' (value (',' value)*)? ']'
    ;

value
    : STRING         # StringValue
    | NUMBER         # NumberValue
    | object         # ObjectValue
    | array          # ArrayValue
    | 'true'         # TrueValue
    | 'false'        # FalseValue
    | 'null'         # NullValue
    ;

STRING
    : '"' (ESC | ~["\\])* '"'
    ;

fragment ESC
    : '\\' (["\\/bfnrt] | UNICODE)
    ;

fragment UNICODE
    : 'u' HEX HEX HEX HEX
    ;

fragment HEX
    : [0-9a-fA-F]
    ;

NUMBER
    : '-'? INT ('.' [0-9]+)? EXP?
    ;

fragment INT
    : '0' | [1-9] [0-9]*
    ;

fragment EXP
    : [eE] [+\-]? [0-9]+
    ;

WS
    : [ \t\r\n]+ -> skip
    ;
