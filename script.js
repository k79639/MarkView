document.addEventListener('DOMContentLoaded', function(){
    // DOM Elements
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const formatButtons = document.querySelectorAll('.format-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');

    // Create save status indicator
    const saveStatus = document.createElement('div');
    saveStatus.className = 'save-status fixed bottom-4 right-4 px-3 py-1 rounded text-sm transition-opacity duration-300';
    saveStatus.style.backgroundColor = 'var(--bg-secondary)';
    saveStatus.style.color = 'var(--text-secondary)';
    saveStatus.style.opacity = '0';
    document.body.appendChild(saveStatus);

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize from localStorage with error handling
    function loadFromLocalStorage() {
        try {
            const savedContent = localStorage.getItem('markdownContent');
            if (savedContent) {
                editor.value = savedContent;
                updatePreview();
                showSaveStatus('Content loaded from last session', 'success');
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            showSaveStatus('Error loading saved content', 'error');
        }
    }

    // Enhanced save to localStorage with status indicator
    const saveToLocalStorage = debounce(function() {
        try {
            localStorage.setItem('markdownContent', editor.value);
            showSaveStatus('Changes saved', 'success');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            showSaveStatus('Error saving changes', 'error');
        }
    }, 1000); // Debounce for 1 second

    // Show save status with animation
    function showSaveStatus(message, type = 'success') {
        saveStatus.textContent = message;
        saveStatus.style.backgroundColor = type === 'success' ? 'var(--bg-secondary)' : '#ef4444';
        saveStatus.style.color = type === 'success' ? 'var(--text-secondary)' : '#ffffff';
        saveStatus.style.opacity = '1';

        // Hide the status after 2 seconds
        setTimeout(() => {
            saveStatus.style.opacity = '0';
        }, 2000);
    }

    // Auto-save on input with debouncing
    editor.addEventListener('input', function() {
        updatePreview();
        saveToLocalStorage();
        updateCounts();
    });

    // Auto-save on blur
    editor.addEventListener('blur', function() {
        saveToLocalStorage();
    });

    // Initialize
    loadFromLocalStorage();
    updatePreview();
    updateCounts();

    // Theme toggler
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.className = `theme-${theme} transition-all`;
            // Add fade-in animation to preview
            preview.classList.add('fade-in');
            setTimeout(() => preview.classList.remove('fade-in'), 300);
        });
    });
    
    // Set up marked.js
    marked.setOptions({
        breaks: true,
        gfm: true,
        smartypants: true
    });
    
    // Event Listeners
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            applyFormatting(format);
        });
    });

    downloadBtn.addEventListener('click', downloadMarkdown);
    clearBtn.addEventListener('click', clearEditor);
    copyBtn.addEventListener('click', copyPreview);

    // Mobile Menu Functionality
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenuContent = mobileMenu.querySelector('div');
    const mobileDownloadBtn = document.getElementById('mobile-download-btn');
    const mobileClearBtn = document.getElementById('mobile-clear-btn');

    function openMobileMenu() {
        mobileMenu.style.display = 'block';
        // Force a reflow
        mobileMenu.offsetHeight;
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        // Wait for the animation to complete before hiding the menu
        setTimeout(() => {
            if (!mobileMenu.classList.contains('active')) {
                mobileMenu.style.display = 'none';
            }
        }, 300); // Match this with the CSS transition duration
    }

    hamburgerMenu.addEventListener('click', openMobileMenu);
    closeMenu.addEventListener('click', closeMobileMenu);

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    // Sync mobile buttons with desktop buttons
    mobileDownloadBtn.addEventListener('click', () => {
        document.getElementById('download-btn').click();
        closeMobileMenu();
    });

    mobileClearBtn.addEventListener('click', () => {
        document.getElementById('clear-btn').click();
        closeMobileMenu();
    });

    // Functions
    function updatePreview() {
        preview.innerHTML = marked.parse(editor.value);
    }
    
    function updateCounts() {
        const text = editor.value;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const charCount = text.length;
        
        wordCountEl.textContent = `Words: ${wordCount}`;
        charCountEl.textContent = `Characters: ${charCount}`;
    }

    function applyFormatting(format) {
        const startPos = editor.selectionStart;
        const endPos = editor.selectionEnd;
        const selectedText = editor.value.substring(startPos, endPos);
        let before = '', after = '', newCursorPos = 0;
        
        switch(format) {
            case 'bold':
                before = '**';
                after = '**';
                newCursorPos = startPos + 2;
                break;
            case 'italic':
                before = '*';
                after = '*';
                newCursorPos = startPos + 1;
                break;
            case 'heading':
                before = '## ';
                newCursorPos = startPos + 3;
                break;
            case 'link':
                before = '[';
                after = '](url)';
                newCursorPos = startPos + 1;
                break;
            case 'image':
                before = '![';
                after = '](image-url)';
                newCursorPos = startPos + 2;
                break;
            case 'code':
                if (selectedText.includes('\n')) {
                    before = '```\n';
                    after = '\n```';
                    newCursorPos = startPos + 4;
                } else {
                    before = '`';
                    after = '`';
                    newCursorPos = startPos + 1;
                }
                break;
            case 'quote':
                if (selectedText.includes('\n')) {
                    before = '> ';
                    after = selectedText.replace(/\n/g, '\n> ');
                } else {
                    before = '> ';
                    newCursorPos = startPos + 2;
                }
                break;
            case 'list-ul':
                if (selectedText.includes('\n')) {
                    before = '- ';
                    after = selectedText.replace(/\n/g, '\n- ');
                } else {
                    before = '- ';
                    newCursorPos = startPos + 2;
                }
                break;
            case 'list-ol':
                if (selectedText.includes('\n')) {
                    before = '1. ';
                    after = selectedText.replace(/\n/g, '\n1. ');
                } else {
                    before = '1. ';
                    newCursorPos = startPos + 3;
                }
                break;
        }
        
        // Update the text
        editor.value = editor.value.substring(0, startPos) + before + selectedText + after + editor.value.substring(endPos);
        
        // Set the cursor position
        if (selectedText) {
            editor.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
        } else {
            editor.setSelectionRange(newCursorPos, newCursorPos);
        }
        
        editor.focus();
        updatePreview();
        saveToLocalStorage();
    }
    
    function downloadMarkdown() {
        const content = editor.value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-note.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function clearEditor() {
        if (confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
            editor.value = '';
            updatePreview();
            saveToLocalStorage();
            updateCounts();
        }
    }
    
    function copyPreview() {
        navigator.clipboard.writeText(editor.value).then(() => {
            // Show feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i><span>Copied!</span>';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }
})