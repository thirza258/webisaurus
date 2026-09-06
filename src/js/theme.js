export function initTheme() {
    const root = document.documentElement;
    const toggleBtn = document.querySelector('#theme-toggle');
    
    // Check local storage first
    let currentTheme = localStorage.getItem('webisaurus-theme');
    
    if (!currentTheme) {
        // Fallback to system preference
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    setTheme(currentTheme);
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Listen for system changes if no local storage preference exists
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('webisaurus-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    const root = document.documentElement;
    const toggleBtn = document.querySelector('#theme-toggle');
    
    root.setAttribute('data-theme', theme);
    
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('.theme-icon');
        if (icon) {
            // ☀️ for dark mode meaning 'click to switch to light'
            // 🌙 for light mode meaning 'click to switch to dark'
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

export function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    localStorage.setItem('webisaurus-theme', newTheme);
    setTheme(newTheme);
}
