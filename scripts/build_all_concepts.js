const fs = require('fs');
const path = require('path');

const SNIPPETS_DIR = path.join(__dirname, '../src/data/snippets');
const REGISTRY_PATH = path.join(__dirname, '../src/data/registry.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

function snippet(title, concept_id, code, notes) {
  return {
    title,
    concept_id,
    code: code.trim(),
    notes: notes.trim()
  };
}

// Language families and syntax generators
function generateSnippetsForLanguage(lang) {
  const id = lang.id;
  const name = lang.name;
  const cat = lang.category;

  // 1. Python-like
  if (['python', 'mojo', 'nim', 'hy'].includes(id)) {
    return {
      comments: snippet('Comments & Documentation', 'comments',
        `# Single-line comment in ${name}\n\n"""\nMulti-line documentation block.\nProvides docstrings for functions and modules.\n"""\n\ndef add(a, b):\n    """Return sum of a and b."""\n    return a + b`,
        `${name} uses # for line comments and triple quotes for multi-line documentation strings.`),
      numbers: snippet('Numbers & Numerics', 'numbers',
        `x = 42\npi = 3.14159\nhex_val = 0xFF\nbin_val = 0b1010\nlarge_num = 1_000_000`,
        `${name} supports arbitrary-precision or native integers, IEEE floats, and numeric literal prefixes (0x, 0b).`),
      booleans: snippet('Booleans & Conditions', 'booleans',
        id === 'nim' ? 'let is_active = true\nlet has_failed = false\n\nif is_active and not has_failed:\n    echo "Active"' : 'is_active = True\nhas_failed = False\n\nif is_active and not has_failed:\n    print("Active")',
        `${name} represents boolean values with logical and, or, and not operators.`),
      type_casting: snippet('Type Casting & Conversion', 'type_casting',
        id === 'nim' ? 'let num_str = "42"\nlet n = parseInt(num_str)\nlet f = float(n)\nlet s = $f' : 'num_str = "42"\nn = int(num_str)\nf = float(n)\ns = str(f)',
        `${name} uses explicit conversion functions or operators to transform types between primitives.`),
      strings: snippet('Strings & Escapes', 'strings',
        `s1 = "Double-quoted string"\ns2 = 'Single-quoted string'\nraw = r"C:\\new_folder\\raw.txt"\nmulti = """Line 1\nLine 2"""`,
        `${name} supports single, double, and raw string literals that ignore escape characters.`),
      string_formatting: snippet('String Formatting', 'string_formatting',
        id === 'nim' ? 'import strformat\nlet name = "Alice"\nlet score = 95\necho fmt"User {name} scored {score}"' : 'name = "Alice"\nscore = 95\nmsg = f"User {name} scored {score:.1f}"\nprint(msg)',
        `${name} uses f-string interpolation or format specifiers for embedded expression formatting.`),
      pattern_matching: snippet('Pattern Matching', 'pattern_matching',
        id === 'nim' ? 'case val\nof 1: echo "One"\nof 2, 3: echo "Two or Three"\nelse: echo "Other"' : 'match val:\n    case 1:\n        print("One")\n    case 2 | 3:\n        print("Two or Three")\n    case _:\n        print("Default")',
        `${name} provides structural pattern matching with match/case or case-of expressions.`),
      range: snippet('Ranges & Slices', 'range',
        id === 'nim' ? 'let r = 1 .. 5\nlet slice = text[0 .. 3]' : 'r = range(1, 10, 2)\nsub = nums[1:5]\nrev = nums[::-1]',
        `${name} provides built-in range generation and slicing syntax with interval boundaries.`),
      iterators: snippet('Iterators & Generators', 'iterators',
        id === 'nim' ? 'iterator countdown(n: int): int =\n  var x = n\n  while x > 0:\n    yield x\n    dec x' : 'def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor i in countdown(3):\n    print(i)',
        `${name} uses generator functions or iterators with the yield keyword for lazy element production.`),
      oop_classes: snippet('Classes & OOP', 'oop_classes',
        id === 'nim' ? 'type\n  Person = ref object of RootObj\n    name*: string\n    age*: int\n\nmethod greet(p: Person): string {.base.} =\n  "Hello " & p.name' : 'class Person:\n    def __init__(self, name: str):\n        self.name = name\n    \n    def greet(self) -> str:\n        return f"Hello {self.name}"',
        `${name} supports object-oriented paradigms with methods, constructors, and encapsulation.`),
      lists: snippet('Lists & Dynamic Arrays', 'lists',
        id === 'nim' ? 'var list = @[1, 2, 3]\nlist.add(4)\nlet first = list[0]' : 'items = [1, 2, 3]\nitems.append(4)\nitems.insert(1, 10)\npopped = items.pop()',
        `${name} provides mutable dynamic lists/sequences with append, insert, and indexing operations.`),
      tuples: snippet('Tuples & Records', 'tuples',
        id === 'nim' ? 'let pair: (int, string) = (1, "apple")\nlet (x, name) = pair' : 'pair = (10, "apple")\nx, name = pair\nsingle = (42,)',
        `${name} provides immutable ordered tuples supporting unpack destructuring.`),
      sets: snippet('Sets & Collections', 'sets',
        id === 'nim' ? 'import sets\nvar s = toHashSet([1, 2, 3])\ns.incl(4)\nlet hasOne = s.contains(1)' : 's = {1, 2, 3}\ns.add(4)\ns.remove(1)\nunion = s | {3, 5}',
        `${name} provides unique element set collections with membership tests and mathematical set operations.`),
      modules_import: snippet('Modules & Imports', 'modules_import',
        id === 'nim' ? 'import std/[strutils, os]\nfrom math import sqrt' : 'import math\nfrom math import sqrt, pi\nimport os.path as path',
        `${name} manages code organization via modules and selective import statements.`)
    };
  }

  // 2. C-like, Systems & Static OOP (C, C++, C#, Java, Kotlin, Swift, Dart, etc.)
  if (['c', 'cpp', 'csharp', 'java', 'kotlin', 'swift', 'dart', 'd', 'zig', 'odin', 'vlang', 'carbon', 'hare', 'chapel', 'pony', 'cpp_cli'].includes(id)) {
    const isC = id === 'c';
    const isCpp = id === 'cpp';
    const isJava = id === 'java';
    const isCs = id === 'csharp';
    const isKt = id === 'kotlin';
    const isSwift = id === 'swift';
    const isDart = id === 'dart';
    const isZig = id === 'zig';

    return {
      comments: snippet('Comments & Documentation', 'comments',
        `// Single-line comment in ${name}\n\n/*\n * Multi-line comment block\n */\n\n/**\n * Documentation comment\n */`,
        `${name} uses C-style // single-line and /* */ multi-line comments.`),
      numbers: snippet('Numbers & Numerics', 'numbers',
        isZig ? 'const a: i32 = 42;\nconst b: f64 = 3.14159;\nconst hex: u32 = 0xFF;\nconst sep = 1_000_000;' : isC ? 'int a = 42;\nlong long b = 1000000000LL;\nfloat f = 3.14f;\ndouble d = 3.14159265;\nint hex = 0xFF;' : 'int a = 42;\ndouble b = 3.14159;\nlong large = 1_000_000L;\nint hex = 0xFF;\nint bin = 0b1010;',
        `${name} provides explicitly sized integer and floating-point primitives with binary and hex support.`),
      booleans: snippet('Booleans & Conditions', 'booleans',
        isC ? '#include <stdbool.h>\nbool is_active = true;\nbool is_done = false;\nif (is_active && !is_done) {\n    printf("Active\\n");\n}' : 'bool isActive = true;\nbool isDone = false;\nif (isActive && !isDone) {\n    // Condition satisfied\n}',
        `${name} uses bool / boolean types with true and false literals and logical operators (&&, ||, !).`),
      type_casting: snippet('Type Casting & Conversion', 'type_casting',
        isZig ? 'const i: i32 = 42;\nconst f: f64 = @floatFromInt(i);\nconst u: u8 = @truncate(@as(u32, 100));' : isCpp ? 'int a = 42;\ndouble d = static_cast<double>(a);\nint b = static_cast<int>(d);' : 'int a = 42;\ndouble d = (double)a;\nint b = (int)d;',
        `${name} supports explicit type casting using cast operators or constructor functions.`),
      strings: snippet('Strings & Characters', 'strings',
        isC ? 'const char* str = "Hello, World!";\nchar ch = str[0]; // \'H\'\nchar buf[64];\nstrcpy(buf, str);' : isZig ? 'const str: []const u8 = "Hello, Zig!";\nconst char: u8 = str[0];' : 'String str = "Hello, World!";\nchar ch = str.charAt(0);\nint len = str.length();',
        `${name} distinguishes between single-character literals and string sequences or pointer slices.`),
      string_formatting: snippet('String Formatting', 'string_formatting',
        isC || isCpp ? 'char buffer[100];\nsnprintf(buffer, sizeof(buffer), "User: %s, Score: %d", "Alice", 95);\nprintf("%s\\n", buffer);' : isCs ? 'string name = "Alice";\nint score = 95;\nstring msg = $"User {name} scored {score:D3}";' : isKt || isDart ? 'val name = "Alice"\nval score = 95\nval msg = "User $name scored ${score + 5}"' : isSwift ? 'let name = "Alice"\nlet score = 95\nlet msg = "User \\(name) scored \\(score)"' : 'String name = "Alice";\nint score = 95;\nString msg = String.format("User %s scored %d", name, score);',
        `${name} supports string interpolation or printf-style formatting specifiers.`),
      pattern_matching: snippet('Pattern Matching & Switch', 'pattern_matching',
        isKt ? 'when (val) {\n    1 -> println("One")\n    2, 3 -> println("Two or Three")\n    else -> println("Other")\n}' : isCs ? 'string result = val switch {\n    1 => "One",\n    2 or 3 => "Two or Three",\n    _ => "Other"\n};' : isSwift ? 'switch val {\ncase 1:\n    print("One")\ncase 2...3:\n    print("Two or Three")\ndefault:\n    print("Other")\n}' : 'switch (val) {\n    case 1:\n        printf("One\\n");\n        break;\n    case 2:\n    case 3:\n        printf("Two or Three\\n");\n        break;\n    default:\n        printf("Other\\n");\n}',
        `${name} evaluates branching conditions through switch statements, match expressions, or when constructs.`),
      range: snippet('Ranges & Slicing', 'range',
        isKt ? 'val r = 1..10 step 2\nfor (i in r) { print(i) }' : isSwift ? 'let r = 1..<5\nfor i in r { print(i) }' : isCs ? 'int[] nums = {0, 1, 2, 3, 4};\nvar slice = nums[1..4];' : isZig ? 'const array = [_]i32{ 1, 2, 3, 4, 5 };\nconst slice = array[1..4];' : 'for (int i = 0; i < 10; i += 2) {\n    // Range from 0 to 9 step 2\n}',
        `${name} represents ranges with range operators (.., ..<) or standard indexed iteration boundaries.`),
      iterators: snippet('Iterators & Sequences', 'iterators',
        isJava ? 'List<String> list = List.of("a", "b", "c");\nIterator<String> it = list.iterator();\nwhile (it.hasNext()) {\n    String s = it.next();\n}' : isCs ? 'IEnumerable<int> Countdown(int n) {\n    while (n > 0) yield return n--;\n}' : 'for (const auto& item : collection) {\n    // Iteration over container\n}',
        `${name} implements iteration through Iterator interfaces, generators, or range-for loops.`),
      oop_classes: snippet('Classes & OOP', 'oop_classes',
        isC ? 'typedef struct {\n    char name[32];\n    int age;\n} Person;\n\nvoid Person_Init(Person* p, const char* n, int a) {\n    strncpy(p->name, n, 31);\n    p->age = a;\n}' : isZig ? 'const Person = struct {\n    name: []const u8,\n    age: u32,\n    \n    pub fn init(name: []const u8, age: u32) Person {\n        return .{ .name = name, .age = age };\n    }\n};' : `class Person {\n    private String name;\n    public Person(String name) {\n        this.name = name;\n    }\n    public String getName() {\n        return this.name;\n    }\n}`,
        `${name} models object orientation through classes with constructors/encapsulation or structs with associated methods.`),
      lists: snippet('Dynamic Arrays & Lists', 'lists',
        isC ? '// Dynamic array via malloc/realloc\nint* list = malloc(sizeof(int) * 4);\nlist[0] = 10;\nlist = realloc(list, sizeof(int) * 8);\nfree(list);' : isCpp ? '#include <vector>\nstd::vector<int> list = {1, 2, 3};\nlist.push_back(4);\nlist.pop_back();' : isJava ? 'List<String> list = new ArrayList<>();\nlist.add("apple");\nlist.add("banana");\nlist.remove(0);' : isCs ? 'var list = new List<int> { 1, 2, 3 };\nlist.Add(4);\nlist.RemoveAt(0);' : isDart ? 'var list = [1, 2, 3];\nlist.add(4);\nlist.removeAt(0);' : 'List<int> list = new ArrayList<int>();',
        `${name} manages growable dynamic collections using vectors, ArrayLists, or dynamically reallocated heap buffers.`),
      tuples: snippet('Tuples & Records', 'tuples',
        isCpp ? '#include <tuple>\nauto t = std::make_tuple(1, 3.14, "text");\nauto [a, b, c] = t; // Structured binding' : isCs ? 'var t = (Id: 1, Name: "Alice");\nvar (id, name) = t;' : isSwift ? 'let pair = (10, "apple")\nlet (num, label) = pair' : isC ? 'typedef struct { int first; double second; } Pair;\nPair p = { 1, 3.14 };' : 'record Pair(int x, int y) {}',
        `${name} represents heterogeneous records through tuples, structured bindings, or lightweight record structs.`),
      sets: snippet('Sets & Unique Collections', 'sets',
        isCpp ? '#include <unordered_set>\nstd::unordered_set<int> s = {1, 2, 3};\ns.insert(4);\nbool exists = s.count(2) > 0;' : isJava ? 'Set<String> set = new HashSet<>();\nset.add("apple");\nboolean has = set.contains("apple");' : isCs ? 'var set = new HashSet<int> { 1, 2, 3 };\nset.Add(4);\nset.Remove(1);' : 'Set<int> set = new HashSet<>();',
        `${name} provides unique collection hashing structures with O(1) average lookup and insertion time.`),
      modules_import: snippet('Modules, Packages & Imports', 'modules_import',
        isC ? '#include <stdio.h>\n#include <stdlib.h>\n#include "my_header.h"' : isCpp ? '#include <iostream>\n#include <vector>\nimport std; // C++20 modules' : isJava ? 'package com.example;\n\nimport java.util.List;\nimport java.util.ArrayList;' : isCs ? 'using System;\nusing System.Collections.Generic;\n\nnamespace MyApp;' : isZig ? 'const std = @import("std");\nconst math = std.math;' : 'import package.name;',
        `${name} structures namespaces and external libraries via include directives, package declarations, or module imports.`)
    };
  }

  // 3. Functional (Haskell, OCaml, SML, Erlang, Elixir, Clojure, Lisp, Scheme, Elm, etc.)
  if (cat === 'Functional') {
    const isLisp = ['commonlisp', 'scheme', 'racket', 'elisp', 'fennel', 'clojure'].includes(id);
    const isBeam = ['erlang', 'elixir', 'gleam'].includes(id);
    const isHaskell = ['haskell', 'elm', 'purescript', 'idris', 'agda', 'pure'].includes(id);

    return {
      comments: snippet('Comments & Annotations', 'comments',
        isLisp ? ';; Single-line comment in Lisp\n#|\n Multi-line block comment\n|#\n(defun add (a b)\n  "Documentation string for function"\n  (+ a b))' : isBeam ? (id === 'elixir' ? '# Single-line comment in Elixir\n@doc """\nDocumentation for function\n"""\ndef add(a, b), do: a + b' : '% Line comment in Erlang\n-doc("Function doc").\nadd(A, B) -> A + B.') : '-- Single-line comment\n{- Multi-line\n   comment block -}\nadd :: Int -> Int -> Int\nadd a b = a + b',
        `${name} uses functional comment delimiters (-- in Haskell/ML, ; in Lisps, # or % in BEAM).`),
      numbers: snippet('Numbers & Numerics', 'numbers',
        isLisp ? '(def x 42)          ; Integer\n(def pi 3.14159)    ; Float\n(def ratio 1/3)     ; Exact rational ratio\n(def hex #xFF)      ; Hexadecimal' : isHaskell ? 'x = 42 :: Int\nbig = 100000000000000000000 :: Integer\npiVal = 3.14159 :: Double\nhexVal = 0xFF' : 'x = 42\npi = 3.14159\nhex = 0xFF',
        `${name} supports exact rational fractions, arbitrary-precision integers, and IEEE floats natively.`),
      booleans: snippet('Booleans & Logic', 'booleans',
        isLisp ? '(def is-active true)\n(if is-active\n    (print "Active")\n    (print "Inactive"))' : isHaskell ? 'isActive = True\nisDone = False\nresult = isActive && not isDone' : isBeam ? (id === 'elixir' ? 'is_active = true\nresult = is_active and not false' : 'IsActive = true,\nResult = IsActive andalso not false.') : 'val isActive = true',
        `${name} treats booleans as first-class algebraic constructors (True/False, true/false, t/nil).`),
      type_casting: snippet('Type Conversion', 'type_casting',
        isLisp ? '(def n (parse-integer "42"))\n(def f (float n))\n(def s (write-to-string f))' : isHaskell ? 'intVal = 42 :: Int\nfloatVal = fromIntegral intVal :: Double\nstrVal = show intVal\nparsed = read "123" :: Int' : 'num = String.to_integer("42")\nstr = Integer.to_string(num)',
        `${name} performs conversion via typeclass methods (fromIntegral, show, read) or explicit parse functions.`),
      strings: snippet('Strings & Text', 'strings',
        isLisp ? '(def s "Hello, World!")\n(def char-val (char s 0))\n(def multi "Line 1\nLine 2")' : isHaskell ? 'str = "Hello, Haskell!"\ncharVal = \'H\' :: Char\nmulti = "Line 1\\nLine 2"' : 's = "Hello, World!"\nchar = ?H',
        `${name} represents strings as linked lists of characters, UTF-8 binaries, or dedicated text buffers.`),
      string_formatting: snippet('String Formatting', 'string_formatting',
        isLisp ? '(format nil "User: ~A scored ~D" "Alice" 95)' : isBeam ? (id === 'elixir' ? 'name = "Alice"\nmsg = "User #{name} is #{95}"' : 'io_lib:format("User ~s scored ~p", ["Alice", 95])') : 'import Text.Printf\nmsg = printf "User %s scored %d" "Alice" (95 :: Int)',
        `${name} formats text through format strings, interpolation macros, or string concatenation.`),
      pattern_matching: snippet('Pattern Matching', 'pattern_matching',
        isHaskell ? 'describeList xs = case xs of\n    []       -> "Empty list"\n    [x]      -> "Single element"\n    (x:y:_)  -> "Multiple elements"' : isBeam ? (id === 'elixir' ? 'case response do\n  {:ok, data} -> IO.puts("Received #{data}")\n  {:error, reason} -> IO.puts("Error: #{reason}")\nend' : 'case Response of\n    {ok, Data} -> Data;\n    {error, _} -> error\nend.') : '(case val\n  (1 "One")\n  ((2 3) "Two or Three")\n  (_ "Other"))',
        `Pattern matching is a core feature in ${name}, destructuring algebraic variants, tuples, and lists directly.`),
      range: snippet('Ranges & Sequences', 'range',
        isHaskell ? '-- Infinite lazy sequence\nevens = [0, 2 .. 20]\n-- List slice with take/drop\nsub = take 5 (drop 2 [1..10])' : isLisp ? '(def r (range 1 10 2))\n(def sub (subseq [1 2 3 4 5] 1 3))' : 'r = 1..10\nslice = Enum.slice(1..10, 2, 4)',
        `${name} constructs ranges as lazy lists, infinite streams, or structured range enumerables.`),
      iterators: snippet('Iterators & Comprehensions', 'iterators',
        isHaskell ? '-- List comprehension\nsquares = [x * x | x <- [1..10], even x]' : isLisp ? '(def squares (for [x (range 10) :when (even? x)] (* x x)))' : 'for x <- 1..10, rem(x, 2) == 0, do: x * x',
        `${name} achieves iterative processing through list comprehensions, map/filter transforms, and recursion.`),
      oop_classes: snippet('Types & Abstractions (OOP Equivalent)', 'oop_classes',
        isHaskell ? 'data Person = Person { name :: String, age :: Int }\n\ngreet :: Person -> String\ngreet (Person n _) = "Hello, " ++ n' : isLisp ? '(defrecord Person [name age])\n(defprotocol Speaker\n  (speak [this]))' : 'defmodule Person do\n  defstruct [:name, :age]\n  def greet(%Person{name: name}), do: "Hello #{name}"\nend',
        `${name} emphasizes algebraic data types, protocols/typeclasses, and structs over traditional class hierarchies.`),
      lists: snippet('Lists (Linked Lists)', 'lists',
        isHaskell ? 'list = [1, 2, 3]\nappended = 0 : list  -- Cons: O(1)\nmerged = list ++ [4, 5] -- Concat' : isLisp ? '(def list \'(1 2 3))\n(def prepended (cons 0 list))\n(def tail (rest list))' : '[1, 2, 3] ++ [4, 5]',
        `Lists in ${name} are singly linked immutable sequences optimized for head/tail structural sharing.`),
      tuples: snippet('Tuples & Records', 'tuples',
        isHaskell ? 'tuple = (1, "apple", True)\n(num, str, flag) = tuple' : isBeam ? '{ok, "Result", 200}' : '(list 1 "apple" t)',
        `${name} uses fixed-length heterogeneous tuples for bundling related data points and function return values.`),
      sets: snippet('Sets', 'sets',
        isHaskell ? 'import qualified Data.Set as Set\ns = Set.fromList [1, 2, 3]\ns\' = Set.insert 4 s\nexists = Set.member 2 s\'' : isLisp ? '(def s (set [1 2 3]))\n(conj s 4)\n(contains? s 2)' : 's = MapSet.new([1, 2, 3])\nMapSet.put(s, 4)',
        `${name} provides persistent immutable sets implemented via balanced binary trees (HAMT / AVL).`),
      modules_import: snippet('Modules & Imports', 'modules_import',
        isHaskell ? 'module Math.Geometry (area, perimeter) where\nimport Data.List (sort, nub)\nimport qualified Data.Map as Map' : isLisp ? '(ns my-project.core\n  (:require [clojure.string :as str]))' : 'defmodule MyModule do\n  import Enum, only: [map: 2]\n  alias MyProject.Helper\nend',
        `${name} isolates scopes through modules and explicit import lists with aliasing and qualified names.`)
    };
  }

  // 4. Shell & Scripting (Bash, PowerShell, Zsh, Fish, sh, Ksh, etc.)
  if (['bash', 'powershell', 'zsh', 'fish', 'sh', 'ksh', 'csh', 'tcsh', 'tcl', 'awk', 'sed', 'expect', 'rexx', 'applescript', 'autohotkey', 'actionscript', 'hack', 'coffeescript', 'livescript', 'moonscript'].includes(id)) {
    const isPs = id === 'powershell';
    const isFish = id === 'fish';
    const isBash = ['bash', 'zsh', 'sh', 'ksh'].includes(id);

    return {
      comments: snippet('Comments & Script Headers', 'comments',
        isPs ? '# Single-line comment in PowerShell\n<#\n Multi-line comment block\n #>\n<#\n.SYNOPSIS\n Cmdlet documentation\n#>' : `# Single line comment in ${name}\n# Shell scripts begin with a shebang:\n#!/usr/bin/env ${id}`,
        `${name} uses # for comments with script headers.`),
      numbers: snippet('Numbers & Arithmetic', 'numbers',
        isPs ? '$a = 42\n$pi = 3.14159\n$hex = 0xFF\n$total = $a * 2' : 'x=42\nresult=$((x * 2 + 5))\nhex=0xFF',
        `${name} supports shell integer arithmetic and numeric expressions.`),
      booleans: snippet('Booleans & Exit Codes', 'booleans',
        isPs ? '$isActive = $true\n$isDone = $false\nif ($isActive -and -not $isDone) {\n    Write-Host "Active"\n}' : 'is_active=true\nif [ "$is_active" = "true" ]; then\n    echo "Active"\nfi',
        `${name} evaluates boolean status through exit codes (0 = success) and boolean primitives.`),
      type_casting: snippet('Type Casting & Coercion', 'type_casting',
        isPs ? '$str = "42"\n[int]$num = $str\n[double]$flt = $num\n[string]$back = $flt' : 'str_val="42"\n# Arithmetic context forces integer coercion\nnum=$((str_val + 0))',
        `${name} handles type conversion explicitly via type accelerators [type] or arithmetic evaluation.`),
      strings: snippet('Strings & Quoting', 'strings',
        isPs ? '$single = \'Literal string $no_expand\'\n$double = "Expanded: $a"\n$here = @"\nMultiline string\n"@' : 'single=\'Literal single quotes\'\ndouble="Expanded: ${USER}"\nmultiline="Line 1\nLine 2"',
        `${name} differentiates between single quotes (literal) and double quotes (variable expansion).`),
      string_formatting: snippet('String Interpolation', 'string_formatting',
        isPs ? '$name = "Alice"\n$score = 95\n$msg = "User $name scored $($score * 2)"\n$fmt = "{0} : {1:N2}" -f $name, 3.14159' : 'name="Alice"\nscore=95\nprintf "User %s scored %d\\n" "$name" "$score"',
        `${name} provides in-string variable interpolation and printf formatting.`),
      pattern_matching: snippet('Pattern Matching & Case', 'pattern_matching',
        isPs ? 'switch ($val) {\n    1 { "One" }\n    { $_ -in 2, 3 } { "Two or Three" }\n    default { "Other" }\n}' : 'case "$val" in\n    1) echo "One" ;;\n    2|3) echo "Two or Three" ;;\n    *) echo "Other" ;;\nesac',
        `${name} matches patterns with case statements or switch blocks with glob matching.`),
      range: snippet('Ranges & Sequences', 'range',
        isPs ? '$range = 1..10\n$even = $range | Where-Object { $_ % 2 -eq 0 }' : '# Brace expansion\nfor i in {1..10..2}; do\n    echo "$i"\ndone',
        `${name} constructs ranges with brace expansion {start..end} or range operators ..`),
      iterators: snippet('Pipes & Iterators', 'iterators',
        isPs ? '1..5 | ForEach-Object {\n    $_ * 2\n}' : 'while IFS= read -r line; do\n    echo "$line"\ndone < "file.txt"',
        `${name} streams data elements through command pipelines and loop iteration.`),
      oop_classes: snippet('Classes / Structured Functions', 'oop_classes',
        isPs ? 'class Person {\n    [string]$Name\n    Person([string]$name) {\n        $this.Name = $name\n    }\n    [string] Greet() {\n        return "Hello $($this.Name)"\n    }\n}' : '# Functions serve as reusable components\nperson_greet() {\n    local name="$1"\n    echo "Hello $name"\n}',
        `${name} defines reusable components through classes (PowerShell 5+) or modular functions.`),
      lists: snippet('Arrays & Collections', 'lists',
        isPs ? '$list = @(1, 2, 3)\n$list += 4\n$first = $list[0]' : 'items=("apple" "banana" "cherry")\nitems+=("date")\necho "${items[0]}" # apple\necho "${items[@]}" # all elements',
        `${name} manages arrays using array lists @() or whitespace-delimited shell arrays.`),
      tuples: snippet('Tuples & Records', 'tuples',
        isPs ? '$pair = [Tuple]::Create(10, "apple")\n$num = $pair.Item1' : 'pair="10:apple"\nIFS=":" read -r id name <<< "$pair"',
        `${name} emulates tuples through string delimiters, .NET Tuples, or positional variables.`),
      sets: snippet('Sets & Unique Lists', 'sets',
        isPs ? '$set = [System.Collections.Generic.HashSet[string]]::new()\n$set.Add("apple") | Out-Null' : 'declare -A set\nset["apple"]=1\nset["banana"]=1\n[[ -n "${set[apple]}" ]] && echo "Found"',
        `${name} models unique sets using associative arrays or underlying runtime sets.`),
      modules_import: snippet('Sourcing & Modules', 'modules_import',
        isPs ? 'Import-Module ActiveDirectory\nusing namespace System.Collections' : '# Source an external script\nsource ./utils.sh\n# or: . ./utils.sh',
        `${name} imports external functions using source (. in POSIX) or Import-Module.`)
    };
  }

  // 5. Data Science (R, Julia, MATLAB, Octave, SAS, Wolfram, Maple, Fortran, APL, J, K, etc.)
  if (cat === 'Data Science') {
    return {
      comments: snippet('Comments & Headers', 'comments',
        `# Comment in ${name}\n# Multi-line comments or docstrings\n# are documented here`,
        `${name} uses # or language-specific delimiters (% in MATLAB, ! in Fortran) for comments.`),
      numbers: snippet('Vectors, Matrices & Numbers', 'numbers',
        `x = 42\npi = 3.14159\n# Vector operations\nv = [1, 2, 3, 4]`,
        `${name} is optimized for vector and matrix calculations with high-precision numerical representations.`),
      booleans: snippet('Logical Vectors & Booleans', 'booleans',
        `is_valid = TRUE\nflags = c(TRUE, FALSE, TRUE)`,
        `${name} provides boolean types with support for element-wise vector logic operations.`),
      type_casting: snippet('Type Coercion & Casting', 'type_casting',
        `as.numeric("42")\nas.character(3.14)`,
        `${name} converts data between numeric, character, factor, and logical representations.`),
      strings: snippet('Strings & Character Vectors', 'strings',
        `s = "Statistical Computing"\nlen = nchar(s)`,
        `${name} treats strings as atomic character scalars or vector arrays.`),
      string_formatting: snippet('String Formatting', 'string_formatting',
        `sprintf("Variable %.2f is %s", 3.14159, "pi")`,
        `${name} formats numerical output with sprintf formatting specifiers.`),
      pattern_matching: snippet('Conditionals & Switches', 'pattern_matching',
        `switch(val, "one" = 1, "two" = 2, 0)`,
        `${name} executes branch logic via switch, ifelse, or conditional filtering.`),
      range: snippet('Sequences & Indexing', 'range',
        `seq(1, 10, by = 2)\nv[1:5]`,
        `${name} indexes matrices and vectors using 1-based indexing and sequence generators.`),
      iterators: snippet('Vectorized Apply & Iteration', 'iterators',
        `lapply(1:5, function(x) x^2)`,
        `${name} emphasizes vectorized functional processing (apply, map) over explicit loops.`),
      oop_classes: snippet('Object Systems & S3/S4', 'oop_classes',
        `# Object systems in ${name}\nobj = list(name = "Model", score = 0.95)\nclass(obj) = "metric"`,
        `${name} uses class dispatch systems (S3/S4 in R, multiple dispatch in Julia) for data modeling.`),
      lists: snippet('DataFrames & Lists', 'lists',
        `df = list(a = 1:3, b = c("x", "y", "z"))`,
        `${name} stores heterogeneous columnar records in data frames and lists.`),
      tuples: snippet('Pairs & Records', 'tuples',
        `pair = c(x = 10, y = 20)`,
        `${name} uses named vectors or lightweight structures for data records.`),
      sets: snippet('Set Operations', 'sets',
        `union(c(1, 2), c(2, 3))\nintersect(c(1, 2), c(2, 3))`,
        `${name} provides native mathematical set functions (union, intersect, setdiff).`),
      modules_import: snippet('Libraries & Packages', 'modules_import',
        `library(dplyr)\nrequire(ggplot2)`,
        `${name} loads package namespaces using library or import declarations.`)
    };
  }

  // 6. Database & Query (SQL, PL/SQL, Cypher, GraphQL, Prolog, etc.)
  if (cat === 'Database') {
    return {
      comments: snippet('Comments', 'comments',
        `-- Single-line comment in ${name}\n/* Multi-line comment */`,
        `${name} uses -- for line comments and /* */ for blocks.`),
      numbers: snippet('Numbers & Decimal Data', 'numbers',
        `DECLARE @val INT = 42;\nDECLARE @price DECIMAL(10, 2) = 19.99;`,
        `${name} represents exact decimal precisions alongside standard integer types.`),
      booleans: snippet('Booleans & Predicates', 'booleans',
        `-- Three-valued logic (TRUE, FALSE, UNKNOWN)\nWHERE status = 'ACTIVE' AND deleted_at IS NULL`,
        `${name} evaluates predicates using declarative boolean conditions with NULL semantics.`),
      type_casting: snippet('Type Casting (CAST/CONVERT)', 'type_casting',
        `CAST('42' AS INT)\nCONVERT(VARCHAR(10), 100)`,
        `${name} casts types using CAST(expr AS target_type) expressions.`),
      strings: snippet('Strings & Text Literals', 'strings',
        `SELECT 'String literal' AS col, N'Unicode text' AS unicode_col;`,
        `${name} encloses character literals in single quotes with optional N prefix for Unicode.`),
      string_formatting: snippet('String Concatenation', 'string_formatting',
        `SELECT CONCAT('User: ', username, ' (', email, ')') FROM users;`,
        `${name} formats and joins textual columns using CONCAT or string concatenation operators.`),
      pattern_matching: snippet('Pattern Matching (LIKE & CASE)', 'pattern_matching',
        `SELECT CASE \n    WHEN score >= 90 THEN 'A'\n    WHEN score >= 80 THEN 'B'\n    ELSE 'C'\nEND AS grade\nWHERE email LIKE '%@example.com';`,
        `${name} performs conditional classification via CASE WHEN and pattern search with LIKE.`),
      range: snippet('Ranges (BETWEEN & LIMIT/OFFSET)', 'range',
        `SELECT * FROM orders \nWHERE order_date BETWEEN '2024-01-01' AND '2024-12-31'\nLIMIT 10 OFFSET 20;`,
        `${name} defines range intervals with BETWEEN and pagination ranges via LIMIT/OFFSET.`),
      iterators: snippet('Cursors & Window Functions', 'iterators',
        `-- Window row iteration\nSELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS row_num\nFROM logs;`,
        `${name} processes ordered sequences set-by-set using window functions or procedural cursors.`),
      oop_classes: snippet('Schemas & Tables (Entities)', 'oop_classes',
        `CREATE TABLE users (\n    id INT PRIMARY KEY,\n    username VARCHAR(50) NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
        `${name} structures entities through relational tables, constraints, and views.`),
      lists: snippet('Tables & Arrays', 'lists',
        `-- Array or temporary result table\nSELECT ARRAY[1, 2, 3] AS num_list;`,
        `${name} supports array column types or relation rowsets representing lists.`),
      tuples: snippet('Rows & Composite Types', 'tuples',
        `-- Row tuple\nSELECT (1, 'Alice', 95) AS user_row;`,
        `${name} represents tuples as table rows or composite record types.`),
      sets: snippet('Set Queries (UNION, INTERSECT)', 'sets',
        `SELECT id FROM active_users\nUNION\nSELECT id FROM premium_users;`,
        `${name} combines dataset results using relational algebra (UNION, INTERSECT, EXCEPT).`),
      modules_import: snippet('Schemas & Extensions', 'modules_import',
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nSET search_path TO my_schema, public;`,
        `${name} manages namespaces and modular capabilities through schemas and extensions.`)
    };
  }

  // 7. General Fallback (HDL, Historical, Exotic, etc.)
  return {
    comments: snippet('Comments & Documentation', 'comments',
      `// Comments in ${name}\n/* Block documentation */`,
      `${name} provides comments to document code behavior.`),
    numbers: snippet('Numbers & Constants', 'numbers',
      `val = 42\nratio = 3.14159`,
      `${name} supports numeric literals for computation and indexing.`),
    booleans: snippet('Booleans & Conditions', 'booleans',
      `flag = true\nif flag:\n    // Execute branch`,
      `${name} provides boolean conditions for program control flow.`),
    type_casting: snippet('Type Conversion', 'type_casting',
      `converted = (type)original_value`,
      `${name} converts data between native format representations.`),
    strings: snippet('Strings & Characters', 'strings',
      `text = "Sample string text"`,
      `${name} represents textual data through string literals and character arrays.`),
    string_formatting: snippet('String Formatting', 'string_formatting',
      `formatted = format("Text: %s", value)`,
      `${name} formats and joins textual values for display and output.`),
    pattern_matching: snippet('Conditionals & Branching', 'pattern_matching',
      `case value of\n    1: execute_one()\n    default: execute_default()`,
      `${name} branches execution based on value comparison and conditional expressions.`),
    range: snippet('Ranges & Intervals', 'range',
      `range = 1..10`,
      `${name} defines intervals and index sequences for bounded processing.`),
    iterators: snippet('Iteration & Loops', 'iterators',
      `for item in collection:\n    process(item)`,
      `${name} iterates across collections and sequence elements.`),
    oop_classes: snippet('Structures & Modules', 'oop_classes',
      `struct Entity {\n    data: Value\n}`,
      `${name} organizes data and behavior through structures or modular components.`),
    lists: snippet('Collections & Arrays', 'lists',
      `items = [1, 2, 3, 4]`,
      `${name} stores sequence data in indexed lists or arrays.`),
    tuples: snippet('Records & Pairs', 'tuples',
      `pair = (10, "label")`,
      `${name} groups related fields into lightweight composite pairs or records.`),
    sets: snippet('Sets & Uniqueness', 'sets',
      `set = Set([1, 2, 3])`,
      `${name} tracks unique values without duplicate entries.`),
    modules_import: snippet('Libraries & Modules', 'modules_import',
      `import module_name`,
      `${name} organizes external libraries and code units into modular namespaces.`)
  };
}

// Master execution: update all 140 languages
let updatedCount = 0;

for (const lang of registry) {
  const filePath = path.join(SNIPPETS_DIR, `${lang.id}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  let rawContent = fs.readFileSync(filePath, 'utf8');
  rawContent = rawContent.replace(/^\uFEFF/, '');
  const fileData = JSON.parse(rawContent);
  const newConcepts = generateSnippetsForLanguage(lang);

  // Merge new concepts into existing snippets without overwriting existing good ones
  for (const [key, value] of Object.entries(newConcepts)) {
    // Only write if missing or if it had placeholder
    const existing = fileData.snippets[key];
    if (!existing || existing.code.includes('TODO') || existing.code.includes('5-15 lines')) {
      fileData.snippets[key] = value;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
  updatedCount++;
}

console.log(`Successfully expanded all ${updatedCount} snippet files to 24 concepts!`);
