// Webisaurus Command Palette — Keyboard-First Quick Switcher (Ctrl+K / Cmd+K / /)

export function initCommandPalette({ registry = [], concepts = [], onSelectLanguage, onSelectConcept }) {
  // Create palette DOM if it doesn't already exist
  let overlay = document.querySelector('#command-palette-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'command-palette-overlay';
    overlay.className = 'palette-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="palette-container" role="dialog" aria-modal="true" aria-label="Command Palette">
        <div class="palette-header">
          <span class="palette-search-icon">🔍</span>
          <input type="text" class="palette-input" placeholder="Search 140 languages, 24 concepts, or actions..." aria-label="Search languages and concepts" autocomplete="off" spellcheck="false">
          <button class="palette-close-btn" aria-label="Close command palette">ESC</button>
        </div>
        <div class="palette-results" id="palette-results" role="listbox"></div>
        <div class="palette-footer">
          <span class="palette-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span class="palette-hint"><kbd>↵</kbd> Select</span>
          <span class="palette-hint"><kbd>esc</kbd> Dismiss</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const input = overlay.querySelector('.palette-input');
  const resultsContainer = overlay.querySelector('.palette-results');
  const closeBtn = overlay.querySelector('.palette-close-btn');

  let activeIndex = 0;
  let currentItems = [];

  // Flatten concepts for fast lookup
  const flatConcepts = [];
  concepts.forEach(cat => {
    if (cat.concepts) {
      cat.concepts.forEach(c => {
        flatConcepts.push({
          id: c.concept_id,
          name: c.name,
          category: cat.category,
          description: c.description
        });
      });
    }
  });

  function openPalette() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    const items = [];

    // 1. Navigation / Quick actions
    if (!q || 'explorer'.includes(q) || 'single'.includes(q)) {
      items.push({
        type: 'action',
        title: 'Go to Single Language Explorer',
        badge: 'Navigation',
        action: () => { window.location.href = 'index.html'; }
      });
    }
    if (!q || 'compare'.includes(q) || 'comparator'.includes(q) || 'diff'.includes(q)) {
      items.push({
        type: 'action',
        title: 'Go to Multi-Language Comparator',
        badge: 'Navigation',
        action: () => { window.location.href = 'compare.html'; }
      });
    }
    if (!q || 'theme'.includes(q) || 'dark'.includes(q) || 'light'.includes(q)) {
      items.push({
        type: 'action',
        title: 'Toggle Dark / Light Theme',
        badge: 'Appearance',
        action: () => {
          const btn = document.querySelector('#theme-toggle');
          if (btn) btn.click();
        }
      });
    }
    if (!q || 'share'.includes(q) || 'link'.includes(q) || 'copy'.includes(q)) {
      items.push({
        type: 'action',
        title: 'Copy Current Page Link',
        badge: 'Share',
        action: async () => {
          await navigator.clipboard.writeText(window.location.href);
        }
      });
    }

    // 2. Languages matches
    if (registry.length > 0) {
      const matchedLangs = registry.filter(l => {
        if (!q) return true;
        const nameMatch = l.name.toLowerCase().includes(q);
        const idMatch = l.id.toLowerCase().includes(q);
        const catMatch = (l.category || '').toLowerCase().includes(q);
        const paradigmMatch = (l.paradigm || []).some(p => p.toLowerCase().includes(q));
        return nameMatch || idMatch || catMatch || paradigmMatch;
      }).slice(0, q ? 10 : 6);

      matchedLangs.forEach(lang => {
        items.push({
          type: 'language',
          id: lang.id,
          title: lang.name,
          badge: lang.category || 'Language',
          subtitle: (lang.paradigm || []).slice(0, 2).join(', '),
          action: () => {
            if (typeof onSelectLanguage === 'function') {
              onSelectLanguage(lang.id);
            } else {
              window.location.href = `index.html?lang=${lang.id}`;
            }
          }
        });
      });
    }

    // 3. Concepts matches
    if (flatConcepts.length > 0) {
      const matchedConcepts = flatConcepts.filter(c => {
        if (!q) return false; // Only show concepts when query is typed, or top 4 if no query
        return c.name.toLowerCase().includes(q) ||
               c.id.toLowerCase().includes(q) ||
               c.category.toLowerCase().includes(q);
      }).slice(0, 8);

      matchedConcepts.forEach(concept => {
        items.push({
          type: 'concept',
          id: concept.id,
          title: concept.name,
          badge: concept.category,
          action: () => {
            if (typeof onSelectConcept === 'function') {
              onSelectConcept(concept.id);
            } else if (window.location.pathname.includes('compare')) {
              const select = document.querySelector('#concept-select');
              if (select) {
                select.value = concept.id;
                select.dispatchEvent(new Event('change'));
              }
            } else {
              window.location.hash = concept.id;
              const el = document.querySelector(`article[data-concept-id="${concept.id}"]`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    }

    currentItems = items;
    activeIndex = 0;

    resultsContainer.innerHTML = '';
    if (items.length === 0) {
      resultsContainer.innerHTML = `
        <div class="palette-empty">No matching languages or concepts for "${query}"</div>
      `;
      return;
    }

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = `palette-item ${idx === 0 ? 'selected' : ''}`;
      row.dataset.index = idx;
      row.setAttribute('role', 'option');

      const icon = item.type === 'language' ? '📄' : (item.type === 'concept' ? '⚡' : '⚙️');

      row.innerHTML = `
        <span class="palette-item-icon">${icon}</span>
        <div class="palette-item-content">
          <div class="palette-item-title">${item.title}</div>
          ${item.subtitle ? `<div class="palette-item-subtitle">${item.subtitle}</div>` : ''}
        </div>
        <span class="palette-item-badge">${item.badge}</span>
      `;

      row.addEventListener('click', () => {
        item.action();
        closePalette();
      });

      row.addEventListener('mouseenter', () => {
        updateSelection(idx);
      });

      resultsContainer.appendChild(row);
    });
  }

  function updateSelection(index) {
    if (currentItems.length === 0) return;
    activeIndex = Math.max(0, Math.min(index, currentItems.length - 1));
    const rows = resultsContainer.querySelectorAll('.palette-item');
    rows.forEach((r, i) => {
      if (i === activeIndex) {
        r.classList.add('selected');
        r.scrollIntoView({ block: 'nearest' });
      } else {
        r.classList.remove('selected');
      }
    });
  }

  // Keyboard navigation inside input
  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateSelection(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateSelection(activeIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentItems[activeIndex]) {
        currentItems[activeIndex].action();
        closePalette();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });

  // Global triggers
  window.addEventListener('keydown', (e) => {
    // Ctrl+K / Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
      return;
    }

    // '/' key when not typing in an input
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
      e.preventDefault();
      openPalette();
      return;
    }

    // Escape closes if open
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.preventDefault();
      closePalette();
    }
  });

  // Close button & overlay click
  if (closeBtn) closeBtn.addEventListener('click', closePalette);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closePalette();
    }
  });

  // Connect any trigger elements in navbar
  document.querySelectorAll('#palette-trigger, .palette-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });

  return {
    open: openPalette,
    close: closePalette
  };
}
