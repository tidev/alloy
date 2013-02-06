/* 
   - TSS parser based on JSON parser from https://github.com/dmajda/pegjs/blob/master/examples/json.pegjs
   - JSON parser based on the grammar described at http://json.org/. */

/* ===== Syntactical Elements ===== */

start
  = __ topobject:topobject __ { return topobject; }

topobject
  = "{" __ "}"           { return {};      }
  / "{" __ topmembers:topmembers __ "}" { return topmembers; } 

object
  = "{" __ "}"                { return {};      }
  / "{" __ members:members __ "}" { return members; }

topmembers
  /* = head:pair tail:(__ ","? __ pair)* { */
  = head:pair tail:(___ pair?)* {
      var result = {};
      result[head[0]] = head[1];
      for (var i = 0; i < tail.length; i++) {
        result[tail[i][1][0]] = tail[i][1][1];
      }
      return result;
    }

members
  = head:pair tail:(__ "," __ pair?)* {
      var result = {};
      result[head[0]] = head[1];
      for (var i = 0; i < tail.length; i++) {
        result[tail[i][3][0]] = tail[i][3][1];
      }
      if (typeof result['undefined'] === 'undefined') {
        delete result['undefined'];
      }
      return result;
    }

pair
  = name:(string / bareString) __ ":" __ value:value { return [name, value]; }

array
  = "[" __ "]"                    { return [];       }
  / "[" __ elements:elements __ "]"  { return elements; }

elements
  = head:value tail:(__ "," __ value)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][3]);
      }
      return result;
    }

value
  = LocaleCall
  / TiConstant
  / WPATH
  / string
  / number
  / object
  / array
  / "true" __  { return true;   }
  / "false" __ { return false;  }
  / "null" __  { return "__ALLOY_EXPR__--null"; }

/* ===== Lexical Elements ===== */

OpenParen
  = '(' { return '('; }

CloseParen
  = ')' { return ')'; }

WPATH
  = 'WPATH' OpenParen __ param1:paramString __ (paramComma __ paramString)* __ CloseParen {
    return '__ALLOY_EXPR__--WPATH(' + param1 + ')';
  }

LocaleCall
  = Locale OpenParen __ param1:paramString __ param2:(paramComma __ paramString)? __ CloseParen { 
    return '__ALLOY_EXPR__--L(' + param1 + (param2 ? param2.join('') : '') + ')'; 
  }

Locale
  = TiNS '.Locale.getString'
  / 'L'

TiConstant
  = parts:(TiNS ('.' bareString)+) {
    var tc = '__ALLOY_EXPR__--' + parts[0];
    var len = parts[1] ? parts[1].length : 0;
    for (var i = 0; i < len; i++) {
      tc += parts[1][i].join('');
    }
    return tc;
  }

TiNS
  = 'Titanium'
  / 'Ti'
  / 'Alloy'

paramComma
  = __ ',' __ { return ','; }

paramString
  = '"' '"' __             { return '""';    }
  / "'" "'" __             { return "''";    }
  / '"' chars:chars '"' __ { return '"' + chars + '"'; }
  / "'" schars:schars "'" __ { return "'" + schars + "'"; }
  / c:TiConstant { return c.replace('__ALLOY_EXPR__--', ''); }

string "string"
  = '"' '"' __             { return "";    }
  / "'" "'" __             { return "";    }
  / '"' chars:chars '"' __ { return chars; }
  / "'" schars:schars "'" __ { return schars; }

bareString "bare word"
  = chars:bareChar+ { return chars.join(''); }

bareChar 
  = [a-zA-Z0-9_$]

schars
  = schars:schar+ { return schars.join(''); }

chars
  = chars:char+ { return chars.join(''); }

schar
  // In the original JSON grammar: "any-Unicode-character-except-"-or-\-or-control-character"
  = [^'\\\0-\x1F\x7f]
  / "\\'"  { return "'";  }
  / "\\\\" { return "\\"; }
  / "\\/"  { return "/";  }
  / "\\b"  { return "\b"; }
  / "\\f"  { return "\f"; }
  / "\\n"  { return "\n"; }
  / "\\r"  { return "\r"; }
  / "\\t"  { return "\t"; }
  / "\\u" h1:hexDigit h2:hexDigit h3:hexDigit h4:hexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
    }

char
  // In the original JSON grammar: "any-Unicode-character-except-"-or-\-or-control-character"
  = [^"\\\0-\x1F\x7f]
  / '\\"'  { return '"';  }
  / "\\\\" { return "\\"; }
  / "\\/"  { return "/";  }
  / "\\b"  { return "\b"; }
  / "\\f"  { return "\f"; }
  / "\\n"  { return "\n"; }
  / "\\r"  { return "\r"; }
  / "\\t"  { return "\t"; }
  / "\\u" h1:hexDigit h2:hexDigit h3:hexDigit h4:hexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
    }

number "number"
  = int_:int frac:frac exp:exp __ { return parseFloat(int_ + frac + exp); }
  / int_:int frac:frac __         { return parseFloat(int_ + frac);       }
  / int_:int exp:exp __           { return parseFloat(int_ + exp);        }
  / int_:int __                   { return parseFloat(int_);              }

int
  = digit19:digit19 digits:digits     { return digit19 + digits;       }
  / digit:digit
  / "-" digit19:digit19 digits:digits { return "-" + digit19 + digits; }
  / "-" digit:digit                   { return "-" + digit;            }

frac
  = "." digits:digits { return "." + digits; }

exp
  = e:e digits:digits { return e + digits; }

digits
  = digits:digit+ { return digits.join(""); }

e
  = e:[eE] sign:[+-]? { return e + sign; }

/*
 * The following rules are not present in the original JSON gramar, but they are
 * assumed to exist implicitly.
 *
 * FIXME: Define them according to ECMA-262, 5th ed.
 */

digit
  = [0-9]

digit19
  = [1-9]

hexDigit
  = [0-9a-fA-F]

/* Whitespace and comments */
_
  = (WhiteSpace / MultiLineCommentNoLineTerminator / SingleLineComment)*

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

___
  = (WhiteSpace / LineTerminatorSequence / Comment / Comma)+

Comma
  = ","

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028" // line separator
  / "\u2029" // paragraph separator

SourceCharacter
  = .

WhiteSpace "whitespace"
  = [\t\v\f \u00A0\uFEFF]

Comment "comment"
  = MultiLineComment
  / SingleLineComment

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"
