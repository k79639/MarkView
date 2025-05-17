# MarkView - Modern Markdown Editor

A sleek, feature-rich Markdown editor built in 48 hours for the CodeCircuit Hackathon by Outlier AI. Experience real-time preview, smart list handling, and beautiful themes in a responsive interface.


## ✨ Features

### Core Functionality
- Real-time Markdown preview with [marked.js](https://marked.js.org/)
- Auto-saving to localStorage
- Download notes as .md files
- Copy content to clipboard
- Clear editor with confirmation

### Smart List Handling
- Auto-continues lists when pressing Enter
  - Unordered lists (`-` or `*`)
  - Numbered lists (`1.`, `2.`, etc.)
  - Checklists (`- [ ]`)
- Smart backspace behavior for list markers
- Maintains proper indentation

### Beautiful Themes
- **Minimal Dark**: Clean, professional dark theme
- **Neon Hacker**: Matrix-inspired green-on-black
- **Funny Chaotic**: Playful yellow and purple
- **Soft Light**: Easy-on-the-eyes light theme
- Each theme includes custom styling for code blocks

### Rich Formatting
- Headings (H1-H6)
- Text formatting (bold, italic, strikethrough)
- Links and images
- Code blocks with syntax highlighting
- Inline code with copy button
- Blockquotes
- Tables
- Horizontal rules

### User Experience
- Word and character counters
- Responsive design for all devices
- Mobile-friendly toolbar
- Smooth animations and transitions
- Tooltips for better discoverability
- Modern scrollbar styling

## 🛠️ Tech Stack

- **Frontend**
  - HTML5
  - Tailwind CSS
  - Vanilla JavaScript
  - Marked.js for Markdown parsing
  - Font Awesome icons

- **Deployment**
  - GitHub Pages

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/karan79639/MarkView.git
   ```

2. Navigate to the project directory:
   ```bash
   cd MarkView
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```
