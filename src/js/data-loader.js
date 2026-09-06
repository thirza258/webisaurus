const cache = {
    registry: null,
    concepts: null,
    snippets: new Map()
};

const STORAGE_PREFIX = 'webisaurus_cache_v4_';

function getStorage(key) {
    try {
        const item = localStorage.getItem(STORAGE_PREFIX + key);
        if (!item) return null;
        return JSON.parse(item);
    } catch (e) {
        return null;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
        // Quota exceeded: evict older snippet caches
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith(STORAGE_PREFIX + 'snippet_')) {
                    keysToRemove.push(k);
                }
            }
            keysToRemove.slice(0, 15).forEach(k => localStorage.removeItem(k));
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (err) {
            console.warn('Storage cache write failed', err);
        }
    }
}

export async function loadRegistry() {
    if (cache.registry) return cache.registry;
    
    // Check localStorage cache first for instant load
    const cached = getStorage('registry');
    if (cached) {
        cache.registry = cached;
        // Background revalidation
        fetch('data/registry.json')
            .then(res => res.ok ? res.json() : null)
            .then(fresh => {
                if (fresh) {
                    cache.registry = fresh;
                    setStorage('registry', fresh);
                }
            })
            .catch(() => {});
        return cached;
    }
    
    try {
        const response = await fetch('data/registry.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        cache.registry = data;
        setStorage('registry', data);
        return data;
    } catch (error) {
        console.error('Failed to load registry:', error);
        return [];
    }
}

export async function loadConcepts() {
    if (cache.concepts) return cache.concepts;
    
    const cached = getStorage('concepts');
    if (cached) {
        cache.concepts = cached;
        // Background revalidation
        fetch('data/concepts.json')
            .then(res => res.ok ? res.json() : null)
            .then(fresh => {
                if (fresh) {
                    cache.concepts = fresh;
                    setStorage('concepts', fresh);
                }
            })
            .catch(() => {});
        return cached;
    }
    
    try {
        const response = await fetch('data/concepts.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        cache.concepts = data;
        setStorage('concepts', data);
        return data;
    } catch (error) {
        console.error('Failed to load concepts:', error);
        return [];
    }
}

export async function loadSnippets(langId) {
    if (cache.snippets.has(langId)) return cache.snippets.get(langId);
    
    const cached = getStorage('snippet_' + langId);
    if (cached) {
        cache.snippets.set(langId, cached);
        // Background revalidation
        fetch(`data/snippets/${langId}.json`)
            .then(res => res.ok ? res.json() : null)
            .then(fresh => {
                if (fresh) {
                    cache.snippets.set(langId, fresh);
                    setStorage('snippet_' + langId, fresh);
                }
            })
            .catch(() => {});
        return cached;
    }
    
    try {
        const response = await fetch(`data/snippets/${langId}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        cache.snippets.set(langId, data);
        setStorage('snippet_' + langId, data);
        return data;
    } catch (error) {
        console.error(`Failed to load snippets for ${langId}:`, error);
        return { language_id: langId, snippets: {} };
    }
}

export function preloadSnippets(langIds) {
    if (!Array.isArray(langIds)) return;
    langIds.forEach(id => {
        if (!cache.snippets.has(id)) {
            loadSnippets(id);
        }
    });
}

export function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch((err) => {
                console.warn('Service worker registration failed:', err);
            });
        });
    }
}

const PRISM_ALIASES = {
    vbnet: 'visual-basic',
    sh: 'bash',
    zsh: 'bash',
    ksh: 'bash',
    csh: 'bash',
    tcsh: 'bash',
    fish: 'bash',
    assembly: 'nasm',
    cpp_cli: 'cpp',
    freepascal: 'pascal',
    objectpascal: 'pascal',
    delphi: 'pascal',
    modula2: 'pascal',
    modula3: 'pascal',
    oberon: 'pascal',
    elisp: 'lisp',
    commonlisp: 'lisp',
    fennel: 'lisp',
    hy: 'python',
    octave: 'matlab',
    purescript: 'haskell',
    rescript: 'javascript',
    spark: 'ada',
    j_lang: 'apl',
    k_lang: 'q',
    q_lang: 'q',
    bqn: 'apl',
    systemverilog: 'verilog',
    tsql: 'sql',
    plpgsql: 'plsql',
    datalog: 'prolog',
    logtalk: 'prolog',
    sparql: 'sql',
    cypher: 'sql',
    gremlin: 'groovy',
    objectivecpp: 'objectivec',
    chisel: 'scala',
    spinalhdl: 'scala',
    myhdl: 'python',
    simula: 'clike',
    pli: 'cobol',
    algol: 'clike',
    bcpl: 'c',
    b_lang: 'c',
    bliss: 'c',
    hare: 'c',
    odin: 'clike',
    vlang: 'c',
    carbon: 'cpp',
    mojo: 'python',
    pony: 'clike',
    chapel: 'clike',
    xtend: 'java',
    ceylon: 'java',
    fantom: 'java',
    golo: 'groovy',
    pure: 'haskell',
    gleam: 'rust',
    sml: 'ocaml',
    idris: 'haskell',
    agda: 'haskell',
    lean: 'haskell',
    coq: 'ocaml',
    wolfram: 'clike',
    maple: 'clike',
    sas: 'sql',
    sac: 'c',
    mumps: 'basic',
    snobol: 'clike',
    rpg: 'cobol',
    autocoder: 'nasm',
    ipl: 'lisp',
    comtran: 'cobol',
    flowmatic: 'cobol',
    shortcode: 'clike'
};

export function getPrismLanguage(langId) {
    if (window.Prism && window.Prism.languages && window.Prism.languages[langId]) {
        return langId;
    }
    const alias = PRISM_ALIASES[langId];
    if (alias && window.Prism && window.Prism.languages && window.Prism.languages[alias]) {
        return alias;
    }
    return alias || 'none';
}

