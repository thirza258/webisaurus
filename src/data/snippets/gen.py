import json
import os

out_dir = r'D:\Document\webisaurus\src\data\snippets'
os.makedirs(out_dir, exist_ok=True)

langs = {
    'verilog': {
        'variables': ('reg clk;\nwire rst;', 'Registers and wires'),
        'data_types': ('reg [7:0] byte_data;', 'Vector types'),
        'operators': ('assign a = b & c;', 'Bitwise operators'),
        'conditionals': ('if (rst) a <= 0; else a <= b;', 'If statements'),
        'for_loop': ('generate for (i=0; i<4; i=i+1) begin : gen_blk\nend\nendgenerate', 'Generate loops'),
        'while_loop': ('while (condition) begin\nend', 'While loops'),
        'functions': ('module my_mod(input a, output b);\nendmodule', 'Modules'),
        'arrays': ('reg [7:0] mem [0:255];', 'Memories'),
        'maps': ('// No native maps', 'Maps unsupported'),
        'error_handling': ('// No native exceptions', 'Error handling unsupported')
    },
    'systemverilog': {
        'variables': ('logic clk;', 'Logic data type'),
        'data_types': ('typedef enum {IDLE, RUN} state_t;', 'Enums and typedefs'),
        'operators': ('assign a = b inside {1,2,3};', 'Inside operator'),
        'conditionals': ('unique if (cond) a=1;', 'Unique if'),
        'for_loop': ('for (int i=0; i<4; i++) begin\nend', 'For loops'),
        'while_loop': ('do begin\nend while(cond);', 'Do while'),
        'functions': ('function automatic int my_func(int a);\nendfunction', 'Functions'),
        'arrays': ('int arr[];', 'Dynamic arrays'),
        'maps': ('int assoc_arr [string];', 'Associative arrays'),
        'error_handling': ('try begin\nend catch(e)\n', 'Exceptions')
    },
    'vhdl': {
        'variables': ('signal clk : std_logic;', 'Signals'),
        'data_types': ('type state_type is (IDLE, RUN);', 'Types'),
        'operators': ('a <= b and c;', 'Operators'),
        'conditionals': ('if rst=\'1\' then\nend if;', 'If statements'),
        'for_loop': ('for i in 0 to 3 generate\nend generate;', 'Generate loop'),
        'while_loop': ('while cond loop\nend loop;', 'While loops'),
        'functions': ('entity my_ent is\nport();\nend my_ent;', 'Entities'),
        'arrays': ('type mem_t is array (0 to 255) of std_logic_vector(7 downto 0);', 'Arrays'),
        'maps': ('-- Maps unsupported', 'Maps'),
        'error_handling': ('assert cond report "Error";', 'Assertions')
    },
    'chisel': {
        'variables': ('val clk = Wire(Bool())', 'Wires'),
        'data_types': ('val data = UInt(8.W)', 'UInt'),
        'operators': ('val a = b & c', 'Bitwise'),
        'conditionals': ('when (rst) { a := 0.U }', 'When statements'),
        'for_loop': ('for (i <- 0 until 4) { }', 'Scala for loops'),
        'while_loop': ('// Use Scala while for generation', 'While'),
        'functions': ('class MyModule extends Module { }', 'Modules'),
        'arrays': ('val mem = Mem(256, UInt(8.W))', 'Memories'),
        'maps': ('// Scala maps at generation time', 'Maps'),
        'error_handling': ('assert(cond)', 'Assertions')
    },
    'spinalhdl': {
        'variables': ('val clk = Bool()', 'Bool'),
        'data_types': ('val data = UInt(8 bits)', 'UInt'),
        'operators': ('val a = b & c', 'Bitwise'),
        'conditionals': ('when (rst) { a := 0 }', 'When statements'),
        'for_loop': ('for (i <- 0 until 4) { }', 'Scala for'),
        'while_loop': ('// Generation time while', 'While'),
        'functions': ('class MyComp extends Component { }', 'Components'),
        'arrays': ('val mem = Mem(Bits(8 bits), 256)', 'Mem'),
        'maps': ('// Scala maps', 'Maps'),
        'error_handling': ('assert(cond)', 'Assertions')
    },
    'bluespec': {
        'variables': ('Reg#(Bit#(8)) r <- mkReg(0);', 'Registers'),
        'data_types': ('typedef enum {IDLE, RUN} State deriving (Bits, Eq);', 'Typedefs'),
        'operators': ('a == b', 'Eq'),
        'conditionals': ('if (cond) a <= 1;', 'If'),
        'for_loop': ('for (Integer i=0; i<4; i=i+1) begin\nend', 'For'),
        'while_loop': ('while (cond) begin\nend', 'While'),
        'functions': ('module mkMyMod(Empty);', 'Modules'),
        'arrays': ('RegFile#(Bit#(8), Bit#(8)) rf <- mkRegFileFull();', 'RegFile'),
        'maps': ('// None', 'None'),
        'error_handling': ('// None', 'None')
    },
    'myhdl': {
        'variables': ('clk = Signal(bool(0))', 'Signals'),
        'data_types': ('data = intbv(0)[8:]', 'intbv'),
        'operators': ('a = b & c', 'Operators'),
        'conditionals': ('if rst:\n    a.next = 0', 'If'),
        'for_loop': ('for i in range(4):\n    pass', 'For'),
        'while_loop': ('while cond:\n    pass', 'While'),
        'functions': ('@block\ndef my_mod():\n    pass', 'Blocks'),
        'arrays': ('mem = [Signal(intbv(0)[8:]) for i in range(256)]', 'Arrays'),
        'maps': ('# Python dicts', 'Maps'),
        'error_handling': ('raise ValueError()', 'Exceptions')
    },
    'cobol': {
        'variables': ('01 WS-VAR PIC X(10).', 'Working Storage'),
        'data_types': ('01 NUM PIC 9(4)V99.', 'Pic clauses'),
        'operators': ('ADD 1 TO A.', 'Add verb'),
        'conditionals': ('IF A = B THEN\nEND-IF.', 'If'),
        'for_loop': ('PERFORM VARYING I FROM 1 BY 1 UNTIL I > 10\nEND-PERFORM.', 'Perform'),
        'while_loop': ('PERFORM UNTIL COND\nEND-PERFORM.', 'Perform until'),
        'functions': ('CALL "SUBPGM".', 'Call'),
        'arrays': ('01 ARR OCCURS 10 TIMES PIC X(5).', 'Occurs'),
        'maps': ('* Maps unsupported', 'Maps'),
        'error_handling': ('ON EXCEPTION', 'Exception')
    },
    'basic': {
        'variables': ('LET A = 10', 'Let'),
        'data_types': ('DIM A AS INTEGER', 'Dim'),
        'operators': ('A = B + C', 'Operators'),
        'conditionals': ('IF A = 1 THEN PRINT "YES"', 'If'),
        'for_loop': ('FOR I = 1 TO 10\nNEXT I', 'For'),
        'while_loop': ('WHILE A < 10\nWEND', 'While'),
        'functions': ('SUB MYSUB\nEND SUB', 'Sub'),
        'arrays': ('DIM ARR(10)', 'Dim array'),
        'maps': ('REM Maps unsupported', 'Maps'),
        'error_handling': ('ON ERROR GOTO HANDLER', 'On error')
    },
    'algol': {
        'variables': ('int i := 10;', 'Int'),
        'data_types': ('real r;', 'Real'),
        'operators': ('a := b + c;', 'Operators'),
        'conditionals': ('if a = b then\nfi;', 'If'),
        'for_loop': ('for i from 1 to 10 do\nod;', 'For'),
        'while_loop': ('while a < 10 do\nod;', 'While'),
        'functions': ('proc p = (int a) int:\n;', 'Proc'),
        'arrays': ('[1:10] int arr;', 'Arrays'),
        'maps': ('co Maps unsupported co', 'Maps'),
        'error_handling': ('co No exceptions co', 'None')
    },
    'simula': {
        'variables': ('integer i;', 'Integer'),
        'data_types': ('real r;', 'Real'),
        'operators': ('a := b + c;', 'Operators'),
        'conditionals': ('if a = b then', 'If'),
        'for_loop': ('for i := 1 step 1 until 10 do', 'For'),
        'while_loop': ('while a < 10 do', 'While'),
        'functions': ('procedure p;\nbegin\nend;', 'Procedure'),
        'arrays': ('integer array arr[1:10];', 'Array'),
        'maps': ('! Maps unsupported;', 'Maps'),
        'error_handling': ('! Exceptions unsupported;', 'None')
    },
    'smalltalk': {
        'variables': ('| x y |', 'Temps'),
        'data_types': ('x := 10.', 'Dynamic'),
        'operators': ('a + b', 'Messages'),
        'conditionals': ('a = b ifTrue: [].', 'IfTrue'),
        'for_loop': ('1 to: 10 do: [:i | ].', 'To:do:'),
        'while_loop': ('[a < 10] whileTrue: [].', 'WhileTrue'),
        'functions': ('myMethod\n ^self', 'Method'),
        'arrays': ('#(1 2 3)', 'Array'),
        'maps': ('Dictionary new.', 'Dictionary'),
        'error_handling': ('[ ] on: Error do: [:ex | ].', 'Exceptions')
    },
    'pli': {
        'variables': ('DCL A FIXED BIN(31);', 'DCL'),
        'data_types': ('DCL B FLOAT DEC(6);', 'Types'),
        'operators': ('A = B + C;', 'Operators'),
        'conditionals': ('IF A=B THEN', 'If'),
        'for_loop': ('DO I=1 TO 10;', 'Do'),
        'while_loop': ('DO WHILE(A<10);', 'While'),
        'functions': ('P: PROC;', 'Proc'),
        'arrays': ('DCL A(10) FIXED BIN;', 'Array'),
        'maps': ('/* No maps */', 'Maps'),
        'error_handling': ('ON ERROR', 'On')
    },
    'snobol': {
        'variables': (' X = 1', 'Assign'),
        'data_types': (' * Dynamic typing', 'Types'),
        'operators': (' X = Y + Z', 'Ops'),
        'conditionals': (' EQ(A,B) :S(YES) F(NO)', 'Success/Fail'),
        'for_loop': (' * Use labels and gotos', 'Gotos'),
        'while_loop': (' * Use labels', 'Labels'),
        'functions': (' DEFINE("F(X)")', 'Define'),
        'arrays': (' A = ARRAY(10)', 'Array'),
        'maps': (' T = TABLE()', 'Table'),
        'error_handling': (' * Fails', 'Fail')
    },
    'mumps': {
        'variables': ('SET X=1', 'Set'),
        'data_types': ('* String and num', 'Types'),
        'operators': ('SET A=B+C', 'Ops'),
        'conditionals': ('IF A=B WRITE "YES"', 'If'),
        'for_loop': ('FOR I=1:1:10 WRITE I', 'For'),
        'while_loop': ('FOR  QUIT:A=B  WRITE A', 'While'),
        'functions': ('DO ^ROUTINE', 'Do'),
        'arrays': ('* Globals and locals', 'Arrays'),
        'maps': ('SET ^MAP("A")=1', 'Globals'),
        'error_handling': ('SET $ECODE=""', 'Error')
    },
    'rpg': {
        'variables': ('DCL-S X INT(10);', 'DCL-S'),
        'data_types': ('DCL-S Y CHAR(10);', 'Types'),
        'operators': ('X = Y + Z;', 'EVAL'),
        'conditionals': ('IF A=B; ENDIF;', 'IF'),
        'for_loop': ('FOR I = 1 TO 10; ENDFOR;', 'FOR'),
        'while_loop': ('DOW A<10; ENDDO;', 'DOW'),
        'functions': ('DCL-PROC P; END-PROC;', 'PROC'),
        'arrays': ('DCL-S A INT(10) DIM(10);', 'DIM'),
        'maps': ('// No maps', 'Maps'),
        'error_handling': ('MONITOR; ON-ERROR; ENDMON;', 'MONITOR')
    },
    'autocoder': {
        'variables': ('VAR DCW @123@', 'DCW'),
        'data_types': ('* Characters', 'Chars'),
        'operators': ('A 123, 456', 'Add'),
        'conditionals': ('B EQUAL, LABEL', 'Branch'),
        'for_loop': ('* Use branch', 'Loop'),
        'while_loop': ('* Use branch', 'Loop'),
        'functions': ('* Use branch', 'Sub'),
        'arrays': ('* Index registers', 'Arrays'),
        'maps': ('* None', 'None'),
        'error_handling': ('* None', 'None')
    },
    'ipl': {
        'variables': ('* Symbols', 'Sym'),
        'data_types': ('* Lists', 'Lists'),
        'operators': ('* Primitives', 'Ops'),
        'conditionals': ('* Branch on symbol', 'Cond'),
        'for_loop': ('* Recursion', 'Recurse'),
        'while_loop': ('* Recursion', 'Recurse'),
        'functions': ('* Routines', 'Routines'),
        'arrays': ('* Lists', 'Lists'),
        'maps': ('* Description lists', 'Desc'),
        'error_handling': ('* None', 'None')
    },
    'comtran': {
        'variables': ('* Variable', 'Var'),
        'data_types': ('* Decimal', 'Dec'),
        'operators': ('ADD A TO B', 'Add'),
        'conditionals': ('IF A = B GO TO L', 'If'),
        'for_loop': ('* Gotos', 'Gotos'),
        'while_loop': ('* Gotos', 'Gotos'),
        'functions': ('* Subroutines', 'Sub'),
        'arrays': ('* None', 'None'),
        'maps': ('* None', 'None'),
        'error_handling': ('* None', 'None')
    },
    'flowmatic': {
        'variables': ('* Variables', 'Var'),
        'data_types': ('* Strings', 'Str'),
        'operators': ('ADD', 'Add'),
        'conditionals': ('IF', 'If'),
        'for_loop': ('* Goto', 'Goto'),
        'while_loop': ('* Goto', 'Goto'),
        'functions': ('* Sub', 'Sub'),
        'arrays': ('* None', 'None'),
        'maps': ('* None', 'None'),
        'error_handling': ('* None', 'None')
    },
    'shortcode': {
        'variables': ('* XY', 'Var'),
        'data_types': ('* Math', 'Math'),
        'operators': ('* Ops', 'Ops'),
        'conditionals': ('* Jump', 'Jump'),
        'for_loop': ('* Jump', 'Jump'),
        'while_loop': ('* Jump', 'Jump'),
        'functions': ('* None', 'None'),
        'arrays': ('* None', 'None'),
        'maps': ('* None', 'None'),
        'error_handling': ('* None', 'None')
    }
}

concepts = ['variables', 'data_types', 'operators', 'conditionals', 'for_loop', 'while_loop', 'functions', 'arrays', 'maps', 'error_handling']

for l, c_dict in langs.items():
    snips = {}
    for c in concepts:
        code, notes = c_dict.get(c, ('// Not available', 'N/A'))
        snips[c] = {
            'title': c.replace('_', ' ').title(),
            'concept_id': c,
            'code': code,
            'notes': notes
        }
    
    doc = {
        'language_id': l,
        'snippets': snips
    }
    with open(os.path.join(out_dir, f'{l}.json'), 'w') as f:
        json.dump(doc, f, indent=2)

print('Done')
