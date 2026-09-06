// Webisaurus — Direct Links to Official Playgrounds & Online REPLs

const PLAYGROUND_MAP = {
  // Systems & Native
  rust: { name: 'Rust Playground', url: 'https://play.rust-lang.org/' },
  go: { name: 'Go Playground', url: 'https://go.dev/play/' },
  c: { name: 'Compiler Explorer', url: 'https://godbolt.org/' },
  cpp: { name: 'Compiler Explorer', url: 'https://godbolt.org/' },
  zig: { name: 'Compiler Explorer (Zig)', url: 'https://godbolt.org/' },
  d: { name: 'D Online Tour', url: 'https://run.dlang.io/' },
  nim: { name: 'Nim Playground', url: 'https://play.nim-lang.org/' },
  odin: { name: 'Compiler Explorer (Odin)', url: 'https://godbolt.org/' },
  vlang: { name: 'V Playground', url: 'https://play.vlang.io/' },
  carbon: { name: 'Carbon Explorer', url: 'https://carbon.godbolt.org/' },
  pony: { name: 'Pony Playground', url: 'https://playground.ponylang.io/' },
  assembly: { name: 'Compiler Explorer (ASM)', url: 'https://godbolt.org/' },
  forth: { name: 'Forth Standard REPL', url: 'https://forth-standard.org/' },

  // Web & Scripting
  typescript: { name: 'TypeScript Playground', url: 'https://www.typescriptlang.org/play' },
  javascript: { name: 'JSFiddle REPL', url: 'https://jsfiddle.net/' },
  python: { name: 'Official Python Shell', url: 'https://www.python.org/shell/' },
  php: { name: '3v4l PHP Sandbox', url: 'https://3v4l.org/' },
  ruby: { name: 'Try Ruby', url: 'https://try.ruby-lang.org/' },
  perl: { name: 'Perl Online', url: 'https://perlonline.com/' },
  lua: { name: 'Lua Online Demo', url: 'https://www.lua.org/demo.html/' },
  bash: { name: 'Bash REPL', url: 'https://onecompiler.com/bash' },
  powershell: { name: 'PowerShell REPL', url: 'https://onecompiler.com/powershell' },

  // Enterprise & JVM
  java: { name: 'Java Playground', url: 'https://dev.java/playground/' },
  kotlin: { name: 'Kotlin Playground', url: 'https://play.kotlinlang.org/' },
  scala: { name: 'Scastie Scala REPL', url: 'https://scastie.scala-lang.org/' },
  csharp: { name: 'SharpLab (.NET)', url: 'https://sharplab.io/' },
  fsharp: { name: 'F# Online', url: 'https://fsharp.org/' },

  // Mobile
  swift: { name: 'SwiftFiddle', url: 'https://swiftfiddle.com/' },
  dart: { name: 'DartPad', url: 'https://dartpad.dev/' },

  // Functional & Declarative
  haskell: { name: 'Haskell Playground', url: 'https://play.haskell.org/' },
  ocaml: { name: 'OCaml Playground', url: 'https://ocaml.org/play' },
  elixir: { name: 'Livebook / Elixir', url: 'https://livebook.dev/' },
  erlang: { name: 'Erlang REPL', url: 'https://onecompiler.com/erlang' },
  clojure: { name: 'ClojureScript REPL', url: 'https://clojurescript.io/' },
  racket: { name: 'Racket REPL', url: 'https://docs.racket-lang.org/' },
  scheme: { name: 'Scheme REPL', url: 'https://onecompiler.com/scheme' },
  commonlisp: { name: 'Common Lisp REPL', url: 'https://onecompiler.com/commonlisp' },

  // Data Science & Mathematical
  julia: { name: 'Julia REPL', url: 'https://onecompiler.com/julia' },
  r: { name: 'Rdrr.io R Snippets', url: 'https://rdrr.io/snippets/' },
  matlab: { name: 'Octave Online', url: 'https://octave-online.net/' },

  // Database & Logic
  sql: { name: 'SQLite Online', url: 'https://sqliteonline.com/' },
  sqlite: { name: 'SQLite Online', url: 'https://sqliteonline.com/' },
  postgresql: { name: 'PostgreSQL Sandbox', url: 'https://sqliteonline.com/' },
  prolog: { name: 'SWI-Prolog SWISH', url: 'https://swish.swi-prolog.org/' },

  // Hardware Description Languages
  verilog: { name: 'EDA Playground (Verilog)', url: 'https://www.edaplayground.com/' },
  systemverilog: { name: 'EDA Playground (SV)', url: 'https://www.edaplayground.com/' },
  vhdl: { name: 'EDA Playground (VHDL)', url: 'https://www.edaplayground.com/' }
};

/**
 * Resolves playground info for a given language.
 * Falls back to Godbolt for systems languages, or OneCompiler/language docs.
 * @param {string} langId 
 * @param {Object} langObj 
 * @returns {{ name: string, url: string }}
 */
export function getPlaygroundInfo(langId, langObj) {
  if (PLAYGROUND_MAP[langId]) {
    return PLAYGROUND_MAP[langId];
  }

  // Safe heuristics based on category
  if (langObj && langObj.category === 'Systems') {
    return { name: 'Compiler Explorer', url: 'https://godbolt.org/' };
  }

  // Generic OneCompiler or language official homepage
  const cleanId = langId.replace(/[^a-z0-9]/g, '');
  return {
    name: 'Online REPL',
    url: `https://onecompiler.com/${cleanId}`
  };
}
