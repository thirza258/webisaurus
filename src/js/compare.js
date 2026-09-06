import { initTheme } from './theme.js';
import { loadRegistry, loadConcepts, loadSnippets, getPrismLanguage, preloadSnippets, registerServiceWorker } from './data-loader.js';
import { initCommandPalette } from './command-palette.js';

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    registerServiceWorker();
    
    const [registry, concepts] = await Promise.all([
        loadRegistry(),
        loadConcepts()
    ]);
    
    // Parse URL params for initial state (P1: Deep-linking)
    const urlParams = new URLSearchParams(window.location.search);
    const urlConcept = urlParams.get('concept');
    const urlSlots = urlParams.get('slots') ? urlParams.get('slots').split(',') : null;

    // Populate concept select
    const conceptSelect = document.querySelector('#concept-select');
    if (conceptSelect && concepts) {
        concepts.forEach(categoryObj => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = categoryObj.category;
            
            if (categoryObj.concepts) {
                categoryObj.concepts.forEach(concept => {
                    const option = document.createElement('option');
                    option.value = concept.concept_id;
                    option.textContent = concept.name;
                    optgroup.appendChild(option);
                });
            }
            conceptSelect.appendChild(optgroup);
        });

        // Determine initial concept: URL param -> localStorage -> default first
        const savedConcept = localStorage.getItem('webisaurus_compare_concept');
        if (urlConcept && conceptSelect.querySelector(`option[value="${urlConcept}"]`)) {
            conceptSelect.value = urlConcept;
        } else if (savedConcept && conceptSelect.querySelector(`option[value="${savedConcept}"]`)) {
            conceptSelect.value = savedConcept;
        } else if (conceptSelect.options.length > 0) {
            conceptSelect.value = conceptSelect.options[0].value;
        }
    }
    
    // Populate language selectors with optgroups by category
    const langSelectors = document.querySelectorAll('.slot-lang-select');
    langSelectors.forEach((select) => {
        if (registry) {
            const categories = {};
            registry.forEach(lang => {
                const cat = lang.category || 'Other';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(lang);
            });

            Object.entries(categories).forEach(([catName, langs]) => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = catName;
                langs.forEach(lang => {
                    const option = document.createElement('option');
                    option.value = lang.id;
                    option.textContent = lang.name;
                    optgroup.appendChild(option);
                });
                select.appendChild(optgroup);
            });
        }
        
        // Determine initial language for slot: URL slots -> localStorage -> defaults
        const slot = select.dataset.slot;
        const slotIndex = parseInt(slot, 10) - 1;
        const savedLang = localStorage.getItem('webisaurus_compare_slot_' + slot);

        if (urlSlots && urlSlots[slotIndex] && select.querySelector(`option[value="${urlSlots[slotIndex]}"]`)) {
            select.value = urlSlots[slotIndex];
        } else if (savedLang && select.querySelector(`option[value="${savedLang}"]`)) {
            select.value = savedLang;
        } else {
            if (slot === '1') select.value = 'python';
            if (slot === '2') select.value = 'javascript';
            if (slot === '3') select.value = 'go';
        }
        
        select.addEventListener('change', () => {
            localStorage.setItem('webisaurus_compare_slot_' + slot, select.value);
            syncUrlState();
            updateSlot(slot);
        });
    });
    
    // Add/Remove 3rd slot elements
    const addSlotBtn = document.querySelector('#add-slot-btn');
    const removeSlotBtn = document.querySelector('#remove-slot-btn');
    const slot3Card = document.querySelector('.slot-card[data-slot="3"]');
    const slotsGrid = document.querySelector('#slots-grid');
    
    function setSlot3Visible(visible) {
        if (!slot3Card || !slotsGrid || !addSlotBtn || !removeSlotBtn) return;
        if (visible) {
            slot3Card.style.display = '';
            slotsGrid.classList.remove('slots-2');
            slotsGrid.classList.add('slots-3');
            addSlotBtn.style.display = 'none';
            removeSlotBtn.style.display = '';
            localStorage.setItem('webisaurus_compare_slot3_active', 'true');
            updateSlot('3');
        } else {
            slot3Card.style.display = 'none';
            slotsGrid.classList.remove('slots-3');
            slotsGrid.classList.add('slots-2');
            removeSlotBtn.style.display = 'none';
            addSlotBtn.style.display = '';
            localStorage.setItem('webisaurus_compare_slot3_active', 'false');
        }
        syncUrlState();
    }

    if (addSlotBtn && removeSlotBtn) {
        addSlotBtn.addEventListener('click', () => setSlot3Visible(true));
        removeSlotBtn.addEventListener('click', () => setSlot3Visible(false));

        // Restore 3rd slot state from URL or localStorage
        const isUrlSlot3Active = urlSlots && urlSlots.length >= 3;
        const isSavedSlot3Active = localStorage.getItem('webisaurus_compare_slot3_active') === 'true';
        if (isUrlSlot3Active || isSavedSlot3Active) {
            setSlot3Visible(true);
        }
    }

    // Synchronize state with URL search params (P1: Shareable State)
    function syncUrlState() {
        if (!conceptSelect) return;
        const currentConcept = conceptSelect.value;
        const select1 = document.querySelector('.slot-lang-select[data-slot="1"]');
        const select2 = document.querySelector('.slot-lang-select[data-slot="2"]');
        const select3 = document.querySelector('.slot-lang-select[data-slot="3"]');
        const isSlot3Open = slot3Card && slot3Card.style.display !== 'none';

        const activeSlots = [];
        if (select1) activeSlots.push(select1.value);
        if (select2) activeSlots.push(select2.value);
        if (isSlot3Open && select3) activeSlots.push(select3.value);

        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('concept', currentConcept);
        currentUrl.searchParams.set('slots', activeSlots.join(','));
        window.history.replaceState(null, '', currentUrl.pathname + currentUrl.search);
    }
    
    // Concept select change
    if (conceptSelect) {
        conceptSelect.addEventListener('change', () => {
            localStorage.setItem('webisaurus_compare_concept', conceptSelect.value);
            syncUrlState();
            updateSlot('1');
            updateSlot('2');
            if (slot3Card && slot3Card.style.display !== 'none') {
                updateSlot('3');
            }
        });
    }
    
    // Swap buttons
    document.addEventListener('click', (e) => {
        const swapBtn = e.target.closest('.swap-btn');
        if (!swapBtn) return;
        
        const [slotX, slotY] = swapBtn.dataset.swap.split('-');
        const selectX = document.querySelector(`.slot-lang-select[data-slot="${slotX}"]`);
        const selectY = document.querySelector(`.slot-lang-select[data-slot="${slotY}"]`);
        
        if (selectX && selectY) {
            const temp = selectX.value;
            selectX.value = selectY.value;
            selectY.value = temp;

            localStorage.setItem('webisaurus_compare_slot_' + slotX, selectX.value);
            localStorage.setItem('webisaurus_compare_slot_' + slotY, selectY.value);
            
            syncUrlState();
            updateSlot(slotX);
            updateSlot(slotY);
        }
    });
    
    // Copy buttons
    document.addEventListener('click', async (e) => {
        const copyBtn = e.target.closest('.slot-copy');
        if (!copyBtn) return;
        
        const slot = copyBtn.dataset.slot;
        const codeEl = document.querySelector(`#slot-code-${slot}`);
        
        if (codeEl && codeEl.textContent) {
            try {
                await navigator.clipboard.writeText(codeEl.textContent);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1800);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    });

    // P1: Share button for Comparator
    const shareCompareBtn = document.querySelector('#share-compare-btn');
    if (shareCompareBtn) {
        shareCompareBtn.addEventListener('click', async () => {
            try {
                syncUrlState();
                await navigator.clipboard.writeText(window.location.href);
                shareCompareBtn.textContent = '✓ Copied Link!';
                setTimeout(() => {
                    shareCompareBtn.textContent = '🔗 Share';
                }, 1800);
            } catch (err) {
                console.error('Failed to copy share link', err);
            }
        });
    }
    
    async function updateSlot(slot) {
        const select = document.querySelector(`.slot-lang-select[data-slot="${slot}"]`);
        const conceptSelectEl = document.querySelector('#concept-select');
        const codeEl = document.querySelector(`#slot-code-${slot}`);
        const notesEl = document.querySelector(`#slot-notes-${slot}`);
        const exploreLink = document.querySelector(`.explore-btn[data-slot="${slot}"]`);
        
        if (!select || !conceptSelectEl || !codeEl || !notesEl) return;
        
        const langId = select.value;
        const conceptId = conceptSelectEl.value;
        
        if (!langId || !conceptId) return;

        // Update Cross-Navigation explore link (P2: Comparator -> Explorer)
        if (exploreLink) {
            exploreLink.href = `index.html?lang=${langId}#${conceptId}`;
        }
        
        const snippetsData = await loadSnippets(langId);
        const snippets = snippetsData.snippets || {};
        const snippet = snippets[conceptId];
        
        codeEl.className = `language-${getPrismLanguage(langId)}`;
        
        if (snippet) {
            codeEl.textContent = snippet.code;
            notesEl.textContent = snippet.notes || '';
            if (window.Prism) {
                window.Prism.highlightElement(codeEl);
            }
        } else {
            codeEl.textContent = 'No snippet available.';
            notesEl.textContent = '';
        }
    }
    
    // Initial load of active slots
    updateSlot('1');
    updateSlot('2');
    if (slot3Card && slot3Card.style.display !== 'none') {
        updateSlot('3');
    }
    syncUrlState();

    // Initialize Command Palette (P3)
    initCommandPalette({
        registry,
        concepts,
        onSelectLanguage: (langId) => {
            window.location.href = `index.html?lang=${langId}`;
        },
        onSelectConcept: (conceptId) => {
            if (conceptSelect) {
                conceptSelect.value = conceptId;
                conceptSelect.dispatchEvent(new Event('change'));
            }
        }
    });

    // Preload top languages
    preloadSnippets(['python', 'javascript', 'go', 'rust', 'cpp', 'java', 'typescript', 'c']);
});
