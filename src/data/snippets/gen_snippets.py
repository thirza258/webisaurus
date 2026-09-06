import json
import os

data = {
    "zsh": {
        "variables": {"code": "name=\"Zsh User\"\nlocal age=30\nreadonly OS=\"Linux\"", "notes": "Similar to bash, but supports local scoping natively in functions."},
        "data_types": {"code": "typeset -i num=10\ntypeset -a arr", "notes": "Zsh mostly uses strings, but supports integer arrays and associative arrays."},
        "operators": {"code": "let \"a = 5 + 3\"\n# or\n(( a = 5 + 3 ))", "notes": "Arithmetic evaluation"},
        "conditionals": {"code": "if [[ $a -gt $b ]]; then\n  echo \"Greater\"\nelif [[ $a -eq $b ]]; then\n  echo \"Equal\"\nelse\n  echo \"Less\"\nfi", "notes": "Extended test `[[ ]]` is preferred."},
        "for_loop": {"code": "for i in {1..5}; do\n  echo $i\ndone", "notes": "Brace expansion supported."},
        "while_loop": {"code": "while [[ $i -lt 5 ]]; do\n  echo $i\n  (( i++ ))\ndone", "notes": "Standard while loop syntax."},
        "functions": {"code": "function greet() {\n  local name=$1\n  echo \"Hello $name\"\n}", "notes": "Functions support local variables."},
        "arrays": {"code": "arr=(1 2 3)\necho ${arr[1]}", "notes": "Zsh arrays are 1-indexed by default!"},
        "maps": {"code": "typeset -A map\nmap=(key1 val1 key2 val2)\necho ${map[key1]}", "notes": "Associative arrays require `typeset -A`."},
        "error_handling": {"code": "command || echo \"Failed\"\n# or\nset -e # exit on error", "notes": "Standard shell error handling."}
    },
    "fish": {
        "variables": {"code": "set name \"Fish User\"\nset -l local_var \"local\"\nset -g global_var \"global\"", "notes": "Fish does not use `=` for assignment, it uses the `set` command."},
        "data_types": {"code": "set num 10\nset list 1 2 3", "notes": "Fish uses lists (arrays) natively; variables are fundamentally lists of strings."},
        "operators": {"code": "set a (math \"5 + 3\")", "notes": "Fish uses the `math` command instead of expr or `(())`."},
        "conditionals": {"code": "if test $a -gt $b\n  echo \"Greater\"\nelse if test $a -eq $b\n  echo \"Equal\"\nelse\n  echo \"Less\"\nend", "notes": "No `then` or `fi`; uses `end`."},
        "for_loop": {"code": "for i in (seq 5)\n  echo $i\nend", "notes": "Uses `seq` or list variables."},
        "while_loop": {"code": "while test $i -lt 5\n  echo $i\n  set i (math $i + 1)\nend", "notes": "Uses `test` and `end` block."},
        "functions": {"code": "function greet\n  set name $argv[1]\n  echo \"Hello $name\"\nend", "notes": "Uses `$argv` instead of `$1` (though `$1` may work). No `{}`."},
        "arrays": {"code": "set arr 1 2 3\necho $arr[1]", "notes": "Fish arrays are 1-indexed."},
        "maps": {"code": "# Simulating with parallel lists\nset keys key1 key2\nset vals val1 val2", "notes": "Fish historically lacks native dicts/maps."},
        "error_handling": {"code": "command; or echo \"Failed\"", "notes": "Uses `and`/`or` instead of `&&`/`||` in older versions (though newer fish supports them)."}
    },
    "sh": {
        "variables": {"code": "name=\"POSIX User\"\nreadonly OS=\"Unix\"", "notes": "No `local` keyword in POSIX sh."},
        "data_types": {"code": "num=10", "notes": "POSIX sh only natively supports strings."},
        "operators": {"code": "a=$(expr 5 + 3)\n# or\na=$((5 + 3))", "notes": "`$(( ))` arithmetic expansion is POSIX."},
        "conditionals": {"code": "if [ \"$a\" -gt \"$b\" ]; then\n  echo \"Greater\"\nelif [ \"$a\" -eq \"$b\" ]; then\n  echo \"Equal\"\nelse\n  echo \"Less\"\nfi", "notes": "Uses standard `[` (test) command."},
        "for_loop": {"code": "for i in 1 2 3 4 5; do\n  echo \"$i\"\ndone", "notes": "No brace expansion natively."},
        "while_loop": {"code": "while [ \"$i\" -lt 5 ]; do\n  echo \"$i\"\n  i=$((i + 1))\ndone", "notes": ""},
        "functions": {"code": "greet() {\n  echo \"Hello $1\"\n}", "notes": "The `function` keyword is not standard POSIX."},
        "arrays": {"code": "set -- 1 2 3\necho $1", "notes": "N/A in POSIX sh. Simulated with positional params."},
        "maps": {"code": "# N/A", "notes": "Not supported in POSIX sh."},
        "error_handling": {"code": "command || echo \"Failed\"", "notes": ""}
    },
    "ksh": {
        "variables": {"code": "name=\"Korn User\"\ntypeset -r OS=\"Unix\"", "notes": "KornShell supports standard variable assignment."},
        "data_types": {"code": "typeset -i num=10\ntypeset -F float=3.14", "notes": "ksh93 supports floating-point math natively."},
        "operators": {"code": "(( a = 5 + 3 ))", "notes": "ksh supports C-like arithmetic expressions."},
        "conditionals": {"code": "if [[ $a -gt $b ]]; then\n  echo \"Greater\"\nfi", "notes": "Supports extended test `[[ ]]`."},
        "for_loop": {"code": "for ((i=0; i<5; i++)); do\n  echo $i\ndone", "notes": "C-style for loops are supported."},
        "while_loop": {"code": "while (( i < 5 )); do\n  (( i++ ))\ndone", "notes": ""},
        "functions": {"code": "function greet {\n  echo \"Hello $1\"\n}", "notes": "Supports both POSIX syntax and `function` keyword with localized variables."},
        "arrays": {"code": "set -A arr 1 2 3\necho ${arr[0]}", "notes": "0-indexed arrays, populated via `set -A`."},
        "maps": {"code": "typeset -A map\nmap[key]=\"value\"\necho ${map[key]}", "notes": "Associative arrays supported."},
        "error_handling": {"code": "command || print \"Failed\"", "notes": "Often uses `print` instead of `echo`."}
    },
    "csh": {
        "variables": {"code": "set name = \"C Shell\"\nsetenv OS \"Unix\"", "notes": "Uses `set` for local and `setenv` for environment variables."},
        "data_types": {"code": "set num = 10", "notes": "Variables are strings or word lists."},
        "operators": {"code": "@ a = 5 + 3", "notes": "Uses `@` command for arithmetic evaluation."},
        "conditionals": {"code": "if ( $a > $b ) then\n  echo \"Greater\"\nelse if ( $a == $b ) then\n  echo \"Equal\"\nelse\n  echo \"Less\"\nendif", "notes": "C-like syntax `if (...) then`."},
        "for_loop": {"code": "foreach i (1 2 3 4 5)\n  echo $i\nend", "notes": "Uses `foreach` instead of `for`."},
        "while_loop": {"code": "while ( $i < 5 )\n  @ i++\nend", "notes": "Arithmetic must use `@`."},
        "functions": {"code": "alias greet 'echo Hello \\!^'", "notes": "C shell lacks true functions; relies on aliases or scripts."},
        "arrays": {"code": "set arr = (1 2 3)\necho $arr[1]", "notes": "Arrays are 1-indexed."},
        "maps": {"code": "# N/A", "notes": "Associative arrays not supported."},
        "error_handling": {"code": "command\nif ( $status != 0 ) echo \"Failed\"", "notes": "Checks `$status` instead of `$?`."}
    },
    "tcsh": {
        "variables": {"code": "set name = \"TC Shell\"\nsetenv OS \"Unix\"", "notes": "Very similar to C shell."},
        "data_types": {"code": "set num = 10", "notes": ""},
        "operators": {"code": "@ a = 5 + 3", "notes": ""},
        "conditionals": {"code": "if ( $a > $b ) then\n  echo \"Greater\"\nendif", "notes": ""},
        "for_loop": {"code": "foreach i (1 2 3)\n  echo $i\nend", "notes": ""},
        "while_loop": {"code": "while ( $i < 5 )\n  @ i++\nend", "notes": ""},
        "functions": {"code": "# Uses aliases", "notes": "No true functions."},
        "arrays": {"code": "set arr = (1 2 3)\necho $arr[1]", "notes": "1-indexed."},
        "maps": {"code": "# N/A", "notes": ""},
        "error_handling": {"code": "command\nif ( $status != 0 ) echo \"Failed\"", "notes": ""}
    },
    "expect": {
        "variables": {"code": "set name \"Expect User\"", "notes": "Expect is based on Tcl."},
        "data_types": {"code": "set num 10", "notes": "Everything is fundamentally a string in Tcl."},
        "operators": {"code": "set a [expr {5 + 3}]", "notes": "Math uses the `expr` command."},
        "conditionals": {"code": "if {$a > $b} {\n  puts \"Greater\"\n} else {\n  puts \"Less\"\n}", "notes": "Brace placement is strictly required on the same line in Tcl."},
        "for_loop": {"code": "for {set i 0} {$i < 5} {incr i} {\n  puts $i\n}", "notes": ""},
        "while_loop": {"code": "while {$i < 5} {\n  puts $i\n  incr i\n}", "notes": ""},
        "functions": {"code": "proc greet {name} {\n  puts \"Hello $name\"\n}", "notes": "Functions are defined using `proc`."},
        "arrays": {"code": "set arr(0) 1\nset arr(1) 2", "notes": "Tcl arrays are actually associative arrays (maps)."},
        "maps": {"code": "dict set map key1 \"val1\"\nputs [dict get $map key1]", "notes": "Tcl 8.5+ introduced dictionaries, separate from arrays."},
        "error_handling": {"code": "catch {command} result\nputs \"Result code: $result\"", "notes": "Uses `catch` command for error handling."}
    },
    "rexx": {
        "variables": {"code": "name = \"Rexx User\"", "notes": "No explicit declaration required."},
        "data_types": {"code": "/* Everything is a string */\nnum = 10", "notes": "Untyped string-based language."},
        "operators": {"code": "a = 5 + 3", "notes": "Standard arithmetic."},
        "conditionals": {"code": "if a > b then\n  say \"Greater\"\nelse\n  say \"Less\"", "notes": "Classic readable syntax."},
        "for_loop": {"code": "do i = 1 to 5\n  say i\nend", "notes": ""},
        "while_loop": {"code": "do while i < 5\n  say i\n  i = i + 1\nend", "notes": ""},
        "functions": {"code": "greet:\n  parse arg name\n  say \"Hello\" name\n  return", "notes": "Functions and subroutines are labels."},
        "arrays": {"code": "arr.1 = 1\narr.2 = 2", "notes": "Compound variables act as arrays."},
        "maps": {"code": "map.\"key1\" = \"val1\"", "notes": "Compound variables can use string keys (stems)."},
        "error_handling": {"code": "signal on syntax\n/* ... */\nsyntax:\n  say \"Error occurred\"", "notes": "Uses `signal` or `trace`."}
    },
    "actionscript": {
        "variables": {"code": "var name:String = \"AS3\";\nconst VERSION:Number = 3.0;", "notes": "Strict typing is supported and encouraged."},
        "data_types": {"code": "var num:int = 10;\nvar str:String = \"test\";\nvar flag:Boolean = true;", "notes": "Basic types: int, uint, Number, String, Boolean."},
        "operators": {"code": "var a:int = 5 + 3;", "notes": ""},
        "conditionals": {"code": "if (a > b) {\n  trace(\"Greater\");\n} else {\n  trace(\"Less\");\n}", "notes": ""},
        "for_loop": {"code": "for (var i:int = 0; i < 5; i++) {\n  trace(i);\n}", "notes": ""},
        "while_loop": {"code": "while (i < 5) {\n  i++;\n}", "notes": ""},
        "functions": {"code": "function greet(name:String):void {\n  trace(\"Hello \" + name);\n}", "notes": ""},
        "arrays": {"code": "var arr:Array = [1, 2, 3];\n// Or Vector for typed arrays\nvar vec:Vector.<int> = new Vector.<int>();", "notes": "Supports untyped Arrays and typed Vectors."},
        "maps": {"code": "var dict:Dictionary = new Dictionary();\ndict[\"key\"] = \"val\";", "notes": "Dictionary class allows objects as keys, while Object allows strings."},
        "error_handling": {"code": "try {\n  throw new Error(\"Oops\");\n} catch (e:Error) {\n  trace(e.message);\n}", "notes": "Standard try/catch."}
    },
    "hack": {
        "variables": {"code": "$name = \"Hack\";", "notes": "Variables are prefixed with `$`."},
        "data_types": {"code": "int $num = 10;\nstring $str = \"test\";", "notes": "Strongly typed PHP-derivative."},
        "operators": {"code": "$a = 5 + 3;", "notes": ""},
        "conditionals": {"code": "if ($a > $b) {\n  echo \"Greater\";\n}", "notes": ""},
        "for_loop": {"code": "for ($i = 0; $i < 5; $i++) {\n  echo $i;\n}", "notes": ""},
        "while_loop": {"code": "while ($i < 5) {\n  $i++;\n}", "notes": ""},
        "functions": {"code": "function greet(string $name): void {\n  echo \"Hello \" . $name;\n}", "notes": "String concatenation uses `.`."},
        "arrays": {"code": "$arr = vec[1, 2, 3];", "notes": "Hack uses specialized collections like vec, keyset, dict instead of PHP's generic array."},
        "maps": {"code": "$map = dict['key' => 'val'];", "notes": ""},
        "error_handling": {"code": "try {\n  throw new Exception(\"Oops\");\n} catch (Exception $e) {\n  echo $e->getMessage();\n}", "notes": ""}
    },
    "coffeescript": {
        "variables": {"code": "name = \"Coffee\"", "notes": "No `var`/`let` required, transpiles safely."},
        "data_types": {"code": "num = 10\nstr = \"test\"\nbool = true", "notes": "Dynamic typing (JavaScript under the hood)."},
        "operators": {"code": "a = 5 + 3", "notes": ""},
        "conditionals": {"code": "if a > b\n  console.log \"Greater\"\nelse\n  console.log \"Less\"", "notes": "Whitespace significant, no curly braces."},
        "for_loop": {"code": "for i in [1..5]\n  console.log i", "notes": "Comprehensions are powerful."},
        "while_loop": {"code": "while i < 5\n  i++", "notes": ""},
        "functions": {"code": "greet = (name) ->\n  console.log \"Hello #{name}\"", "notes": "Uses arrow syntax `->` (or `=>` for bound `this`)."},
        "arrays": {"code": "arr = [1, 2, 3]", "notes": ""},
        "maps": {"code": "obj = key: \"val\"", "notes": "Object literals can omit braces."},
        "error_handling": {"code": "try\n  throw new Error(\"Oops\")\ncatch e\n  console.log e.message", "notes": ""}
    },
    "livescript": {
        "variables": {"code": "name = 'Live'", "notes": "Similar to CoffeeScript but more functional."},
        "data_types": {"code": "num = 10\nstr = 'test'", "notes": ""},
        "operators": {"code": "a = 5 + 3", "notes": ""},
        "conditionals": {"code": "if a > b\n  console.log 'Greater'\nelse\n  console.log 'Less'", "notes": ""},
        "for_loop": {"code": "for i from 1 to 5\n  console.log i", "notes": "Uses `from` and `to`."},
        "while_loop": {"code": "while i < 5\n  i++", "notes": ""},
        "functions": {"code": "greet = (name) -> console.log \"Hello #name\"", "notes": "Interpolation can omit braces for simple variables."},
        "arrays": {"code": "arr = [1, 2, 3]", "notes": ""},
        "maps": {"code": "obj = key: 'val'", "notes": ""},
        "error_handling": {"code": "try\n  throw new Error 'Oops'\ncatch e\n  console.log e.message", "notes": "Parentheses often optional."}
    },
    "moonscript": {
        "variables": {"code": "name = \"Moon\"", "notes": "Transpiles to Lua. Local by default."},
        "data_types": {"code": "num = 10\nstr = \"test\"", "notes": "Lua data types."},
        "operators": {"code": "a = 5 + 3", "notes": ""},
        "conditionals": {"code": "if a > b\n  print \"Greater\"\nelse\n  print \"Less\"", "notes": "Whitespace sensitive, no `then`/`end` needed."},
        "for_loop": {"code": "for i = 1, 5\n  print i", "notes": "Standard Lua numeric for-loop style."},
        "while_loop": {"code": "while i < 5\n  i += 1", "notes": "MoonScript adds `+=` operators which Lua lacks."},
        "functions": {"code": "greet = (name) ->\n  print \"Hello #{name}\"", "notes": "Arrow function syntax."},
        "arrays": {"code": "arr = {1, 2, 3}", "notes": "Uses Lua tables."},
        "maps": {"code": "map = key: \"val\"", "notes": "Table syntax."},
        "error_handling": {"code": "pcall ->\n  error \"Oops\"", "notes": "Uses `pcall` (protected call) for error handling."}
    }
}

os.makedirs("D:\\\\Document\\\\webisaurus\\\\src\\\\data\\\\snippets", exist_ok=True)
for lang, snippets in data.items():
    formatted = {
        "language_id": lang,
        "snippets": {
            concept: {
                "title": concept.replace("_", " ").title(),
                "concept_id": concept,
                "code": details["code"],
                "notes": details.get("notes", "")
            }
            for concept, details in snippets.items()
        }
    }
    with open(f"D:\\\\Document\\\\webisaurus\\\\src\\\\data\\\\snippets\\\\{lang}.json", "w") as f:
        json.dump(formatted, f, indent=2)

print("Files generated successfully.")
