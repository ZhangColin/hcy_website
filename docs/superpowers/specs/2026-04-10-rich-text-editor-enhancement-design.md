# Rich Text Editor Toolbar Enhancement

## Goal

Enhance the TipTap rich text editor (`src/components/TiptapEditor.tsx`) with a comprehensive toolbar and fix the sticky toolbar issue that causes it to scroll out of view.

## Current State

- **Editor**: TipTap v3.21.0 with StarterKit, Image, Link, Placeholder, and custom VideoExtension
- **Toolbar tools**: Bold, Italic, H1-H3, Bullet/Ordered List, Link, Image, Video, Undo/Redo
- **Sticky bug**: Toolbar has `sticky top-0` but parent container `overflow-hidden` breaks it

## Design

### 1. Fix Sticky Toolbar

**Problem**: `overflow-hidden` on the outer container prevents `position: sticky` from working.

**Solution**:
- Set the editor content area to a fixed max-height (e.g. `max-h-[600px]`) with `overflow-y-auto`
- Keep toolbar at the top of the container with `sticky top-0 z-10`
- Remove `overflow-hidden` from the outer container, use it only on the content scroll area
- The toolbar will remain visible as the user scrolls through long content

### 2. Add New TipTap Extensions

Install these official packages:
- `@tiptap/extension-text-align` — text alignment (left, center, right, justify)
- `@tiptap/extension-underline` — underline formatting
- `@tiptap/extension-text-style` + `@tiptap/extension-font-size` — font size control
- `@tiptap/extension-color` — text color
- `@tiptap/extension-highlight` — background highlight
- `@tiptap/extension-superscript` + `@tiptap/extension-subscript` — super/subscript
- `@tiptap/extension-table` + `@tiptap/extension-table-row` + `@tiptap/extension-table-cell` + `@tiptap/extension-table-header` — table support

### 3. Extract MenuBar Component

Move the inline `MenuBar` function to its own file `src/components/EditorToolbar.tsx`:
- Keeps `TiptapEditor.tsx` focused on editor setup and extensions
- Toolbar manages its own button layout and dropdowns
- Receives `editor` instance as a prop

### 4. Toolbar Layout

Organize buttons into logical groups separated by dividers:

```
[Text Format] Bold | Italic | Underline | Strikethrough | Superscript | Subscript
[Heading]     H1 | H2 | H3
[Font]        Font Size (dropdown) | Text Color | Highlight Color
[Alignment]   Align Left | Center | Align Right | Justify
[List]        Bullet List | Ordered List
[Block]       Blockquote | Code Block | Horizontal Rule
[Insert]      Link | Image | Video | Table
[History]     Undo | Redo
```

- Dropdown for font size: 12px, 14px, 16px (default), 18px, 20px, 24px, 28px, 32px
- Color pickers for text color and highlight (predefined palette)
- Table insert button with dropdown for row/column count or fixed 3x3 default

### 5. Table Support

- Insert a default 3-row x 3-column table
- Add/remove rows and columns via toolbar buttons (only visible when cursor is in a table)
- Table styling: bordered cells, padding, responsive width

### 6. Files Changed

- `src/components/EditorToolbar.tsx` — new file, extracted toolbar component
- `src/components/TiptapEditor.tsx` — add extensions, restructure container for sticky fix
- `package.json` — add new TipTap extension dependencies
- Global styles in `TiptapEditor.tsx` — add table, highlight, color CSS

## Constraints

- Must remain SSR-safe (`immediatelyRender: false`)
- Must maintain backward compatibility with existing content (HTML format)
- Keep the existing video extension and image upload working
- No new UI framework dependencies — use plain Tailwind CSS like the existing code
