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

    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.className = `theme-${theme} transition-all`;
            // Add fade-in animation to preview
            preview.classList.add('fade-in');
            setTimeout(() => preview.classList.remove('fade-in'), 300);
        });
    });
})