import { initTheme } from './theme.js';
import { loadRegistry, loadConcepts, loadSnippets, getPrismLanguage, preloadSnippets, registerServiceWorker } from './data-loader.js';
import { initCommandPalette } from './command-palette.js';
import { getPlaygroundInfo } from './playground.js';

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    registerServiceWorker();
    
    const [registry, concepts] = await Promise.all([
        loadRegistry(),
        loadConcepts()
    ]);

    const languageList = document.querySelector('#language-list');
    const languageCountEl = document.querySelector('#language-count');
    let currentSelectedLangId = null;
    let activeCategoryFilter = 'all';

    if (registry && languageList) {
        // Group languages by category
        const categories = {};
        registry.forEach(lang => {
            const cat = lang.category || 'Other';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(lang);
        });

        Object.entries(categories).forEach(([catName, langs]) => {
            const group = document.createElement('div');
            group.classList.add('language-group');
            group.dataset.category = catName;

            const title = document.createElement('div');
            title.classList.add('category-title');
            title.textContent = catName;
            group.appendChild(title);

            langs.forEach(lang => {
                const btn = document.createElement('button');
                btn.classList.add('language-item');
                btn.dataset.langId = lang.id;
                btn.dataset.category = lang.category || '';
                btn.dataset.paradigm = (lang.paradigm || []).join(' ');
                btn.textContent = lang.name;
                group.appendChild(btn);
            });

            languageList.appendChild(group);
        });

        // Function to select and render a language
        async function selectLanguage(langId, shouldScrollConcept = true) {
            const lang = registry.find(l => l.id === langId);
            if (!lang) return;

            currentSelectedLangId = langId;
            localStorage.setItem('webisaurus_last_selected_lang', langId);

            // Update active state in sidebar
            document.querySelectorAll('.language-item').forEach(el => {
                if (el.dataset.langId === langId) {
                    el.classList.add('active');
                    el.scrollIntoView({ block: 'nearest' });
                } else {
                    el.classList.remove('active');
                }
            });

            // Sync URL parameter without reload (P1)
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('lang', langId);
            window.history.replaceState(null, '', currentUrl.pathname + currentUrl.search + window.location.hash);

            // Update header name
            const nameEl = document.querySelector('#current-language-name');
            if (nameEl) nameEl.textContent = lang.name;

            // Update meta badges + Playground / REPL link (Feature 8)
            const metaEl = document.querySelector('#language-meta');
            if (metaEl) {
                metaEl.innerHTML = '';
                
                const versionBadge = document.createElement('span');
                versionBadge.classList.add('badge', 'version-badge');
                versionBadge.textContent = lang.version;
                metaEl.appendChild(versionBadge);

                if (lang.file_extension) {
                    const extBadge = document.createElement('span');
                    extBadge.classList.add('badge');
                    extBadge.textContent = lang.file_extension;
                    metaEl.appendChild(extBadge);
                }
                
                if (lang.paradigm && Array.isArray(lang.paradigm)) {
                    lang.paradigm.forEach(p => {
                        const paradigmBadge = document.createElement('span');
                        paradigmBadge.classList.add('badge', 'paradigm-badge');
                        paradigmBadge.textContent = p;
                        metaEl.appendChild(paradigmBadge);
                    });
                }

                // Official Playground / REPL Direct Link (Feature 8)
                const playground = getPlaygroundInfo(lang.id, lang);
                if (playground && playground.url) {
                    const playLink = document.createElement('a');
                    playLink.className = 'badge playground-badge';
                    playLink.href = playground.url;
                    playLink.target = '_blank';
                    playLink.rel = 'noopener noreferrer';
                    playLink.title = `Open ${playground.name} in new tab`;
                    playLink.innerHTML = `▶ ${playground.name} ↗`;
                    metaEl.appendChild(playLink);
                }
            }

            // Load snippets
            const snippetsData = await loadSnippets(langId);
            const snippets = snippetsData.snippets || {};
            const conceptsGrid = document.querySelector('#concepts-grid');
            if (!conceptsGrid) return;

            conceptsGrid.innerHTML = '';

            // Default comparison partner for quick cross-navigation (P2)
            const defaultPeer = langId === 'python' ? 'javascript' : (langId === 'rust' ? 'go' : 'python');

            // Render concept cards grouped by category
            concepts.forEach(categoryObj => {
                if (!categoryObj.concepts || categoryObj.concepts.length === 0) return;

                const catHeader = document.createElement('div');
                catHeader.classList.add('concept-category-header');
                
                const catTitle = document.createElement('h2');
                catTitle.classList.add('concept-category-title');
                catTitle.textContent = categoryObj.category;
                catHeader.appendChild(catTitle);

                conceptsGrid.appendChild(catHeader);

                categoryObj.concepts.forEach(concept => {
                    const article = document.createElement('article');
                    article.classList.add('concept-card');
                    article.id = `concept-${concept.concept_id}`;
                    article.dataset.conceptId = concept.concept_id;

                    const header = document.createElement('div');
                    header.classList.add('concept-card-header');

                    const title = document.createElement('h3');
                    title.classList.add('concept-title');
                    title.textContent = concept.name;

                    // Action buttons group (Copy + Compare) (P2)
                    const actionsDiv = document.createElement('div');
                    actionsDiv.classList.add('concept-card-actions');

                    // Cross-Navigation: Compare button (P2)
                    const compareLink = document.createElement('a');
                    compareLink.classList.add('concept-action-btn');
                    compareLink.title = 'Compare this concept in Multi-Language Comparator';
                    compareLink.href = `compare.html?concept=${concept.concept_id}&slots=${langId},${defaultPeer}`;
                    compareLink.textContent = '⇄ Compare';
                    actionsDiv.appendChild(compareLink);

                    // Copy code button
                    const copyBtn = document.createElement('button');
                    copyBtn.classList.add('copy-btn');
                    copyBtn.textContent = '📋 Copy';
                    actionsDiv.appendChild(copyBtn);

                    header.appendChild(title);
                    header.appendChild(actionsDiv);

                    const pre = document.createElement('pre');
                    pre.classList.add('code-block');

                    const codeEl = document.createElement('code');
                    codeEl.className = `language-${getPrismLanguage(langId)}`;

                    const notesEl = document.createElement('p');
                    notesEl.classList.add('concept-notes');

                    const snippet = snippets[concept.concept_id];
                    if (snippet) {
                        codeEl.textContent = snippet.code;
                        notesEl.textContent = snippet.notes || '';

                        copyBtn.addEventListener('click', async () => {
                            try {
                                await navigator.clipboard.writeText(snippet.code);
                                copyBtn.textContent = '✓ Copied!';
                                setTimeout(() => {
                                    copyBtn.textContent = '📋 Copy';
                                }, 1800);
                            } catch (err) {
                                console.error('Failed to copy', err);
                            }
                        });
                    } else {
                        codeEl.textContent = 'No snippet available for this concept.';
                        notesEl.textContent = '';
                        copyBtn.style.display = 'none';
                    }

                    pre.appendChild(codeEl);
                    article.appendChild(header);
                    article.appendChild(pre);
                    article.appendChild(notesEl);

                    conceptsGrid.appendChild(article);

                    if (window.Prism && snippet) {
                        try {
                            window.Prism.highlightElement(codeEl);
                        } catch (err) {
                            console.warn('Prism highlighting fallback:', err);
                        }
                    }
                });
            });

            // Handle hash anchor scrolling (P1: Deep link to concept)
            if (shouldScrollConcept && window.location.hash) {
                const targetHash = window.location.hash.replace('#', '');
                const targetEl = document.querySelector(`article[data-concept-id="${targetHash}"]`) || document.querySelector(`#concept-${targetHash}`);
                if (targetEl) {
                    setTimeout(() => {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 80);
                }
            }
        }

        // Language click event
        languageList.addEventListener('click', (e) => {
            const btn = e.target.closest('.language-item');
            if (btn) {
                selectLanguage(btn.dataset.langId, false);
            }
        });

        // P4: Sidebar Filtering by Paradigm & Text Query
        function applySidebarFilter() {
            const searchInput = document.querySelector('#sidebar-search');
            const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
            const groups = document.querySelectorAll('.language-group');
            let totalVisible = 0;

            groups.forEach(group => {
                let groupHasVisible = false;
                const items = group.querySelectorAll('.language-item');

                items.forEach(item => {
                    const name = item.textContent.toLowerCase();
                    const cat = (item.dataset.category || '').toLowerCase();
                    const paradigm = (item.dataset.paradigm || '').toLowerCase();

                    // Check search query
                    const matchesQuery = !query || name.includes(query) || cat.includes(query) || paradigm.includes(query);

                    // Check category/paradigm filter chip
                    let matchesFilter = false;
                    if (activeCategoryFilter === 'all') {
                        matchesFilter = true;
                    } else {
                        const targetFilter = activeCategoryFilter.toLowerCase();
                        matchesFilter = cat.includes(targetFilter) || paradigm.includes(targetFilter);
                    }

                    const visible = matchesQuery && matchesFilter;
                    item.style.display = visible ? '' : 'none';
                    if (visible) {
                        groupHasVisible = true;
                        totalVisible++;
                    }
                });

                group.style.display = groupHasVisible ? '' : 'none';
            });

            if (languageCountEl) {
                languageCountEl.textContent = totalVisible;
            }
        }

        // Connect filter chips
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                activeCategoryFilter = chip.dataset.filter || 'all';
                applySidebarFilter();
            });
        });

        // Connect sidebar search input
        const sidebarSearch = document.querySelector('#sidebar-search');
        if (sidebarSearch) {
            sidebarSearch.addEventListener('input', applySidebarFilter);
        }

        // P1: Share button for Explorer
        const shareBtn = document.querySelector('#share-view-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    shareBtn.textContent = '✓ Copied Link!';
                    setTimeout(() => {
                        shareBtn.textContent = '🔗 Share';
                    }, 1800);
                } catch (err) {
                    console.error('Failed to copy share link', err);
                }
            });
        }

        // Initialize Command Palette (P3)
        initCommandPalette({
            registry,
            concepts,
            onSelectLanguage: (langId) => {
                selectLanguage(langId, false);
            },
            onSelectConcept: (conceptId) => {
                window.location.hash = conceptId;
                const el = document.querySelector(`article[data-concept-id="${conceptId}"]`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Determine initial language: URL query param (P1) -> localStorage -> default python
        const urlParams = new URLSearchParams(window.location.search);
        const urlLangId = urlParams.get('lang');
        const savedLangId = localStorage.getItem('webisaurus_last_selected_lang');
        
        let initialLangId = 'python';
        if (urlLangId && registry.some(l => l.id === urlLangId)) {
            initialLangId = urlLangId;
        } else if (savedLangId && registry.some(l => l.id === savedLangId)) {
            initialLangId = savedLangId;
        }

        selectLanguage(initialLangId, true);

        // Preload popular languages in background
        preloadSnippets(['python', 'javascript', 'typescript', 'go', 'rust', 'cpp', 'java', 'c']);
    }
});
