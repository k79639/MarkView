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

    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            applyFormatting(format);
        });
    });

    downloadBtn.addEventListener('click', downloadMarkdown);
    clearBtn.addEventListener('click', clearEditor);
    copyBtn.addEventListener('click', copyPreview);

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
    
    // Initialize
    updatePreview();
    updateCounts();
})