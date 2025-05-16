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

    // Initialize from localStorage
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        editor.value = savedContent;
        updatePreview();
    }

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
    editor.addEventListener('input', function() {
        updatePreview();
        saveToLocalStorage();
        updateCounts();
    });

    // Functions
    function updatePreview() {
        preview.innerHTML = marked.parse(editor.value);
    }
    
    function saveToLocalStorage() {
        localStorage.setItem('markdownContent', editor.value);
    }
    
    function updateCounts() {
        const text = editor.value;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const charCount = text.length;
        
        wordCountEl.textContent = `Words: ${wordCount}`;
        charCountEl.textContent = `Characters: ${charCount}`;
    }
})