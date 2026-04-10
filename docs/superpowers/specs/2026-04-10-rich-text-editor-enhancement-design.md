# Rich Text Editor Toolbar Enhancement

## Goal

Enhance the TipTap rich text editor (`src/components/TiptapEditor.tsx`) with a comprehensive toolbar and fix the sticky toolbar issue that causes it to scroll out of view.

## Current State

- **Editor**: TipTap v3.21.0 (StarterKit v3) with Image, Link, Placeholder, and custom VideoExtension
- **Toolbar tools**: Bold, Italic, H1-H3, Bullet/Ordered List, Link, Image, Video, Undo/Redo
- **Sticky bug**: Toolbar has `sticky top-0` but parent container `overflow-hidden` breaks it
- **Note**: StarterKit v3 already bundles Underline, Strike, Blockquote, CodeBlock, HorizontalRule, and Link — these only need toolbar buttons, no new packages

## Design

### 1. Fix Sticky Toolbar

**Problem**: `overflow-hidden` on the outer container (line 258) prevents `position: sticky` from working.

**Solution** — restructure the container markup:

```
Before:
<div class="border rounded-md overflow-hidden">     ← overflow-hidden breaks sticky
  <MenuBar />                                         ← sticky top-0 (doesn't work)
  <EditorContent class="p-4 min-h-[300px]" />
</div>

After:
<div class="border rounded-md">                      ← no overflow-hidden
  <MenuBar />                                         ← sticky top-0 (now works)
  <div class="max-h-[600px] overflow-y-auto">         ← scroll area is the content only
    <EditorContent class="p-4 min-h-[300px]" />
  </div>
</div>
```

- Toolbar stays fixed at top while content scrolls within its `max-h-[600px]` container
- `overflow-hidden` removed from outer container; `overflow-y-auto` on the content wrapper only

### 2. Add New TipTap Extensions

**New packages to install:**
- `@tiptap/extension-text-align` — text alignment
- `@tiptap/extension-text-style` — base for font size and color (replaces deprecated `@tiptap/extension-font-size`)
- `@tiptap/extension-color` — text color
- `@tiptap/extension-highlight` — background highlight
- `@tiptap/extension-superscript` + `@tiptap/extension-subscript` — super/subscript
- `@tiptap/extension-table` + `@tiptap/extension-table-row` + `@tiptap/extension-table-cell` + `@tiptap/extension-table-header` — table support

**Already in StarterKit v3** (only need toolbar buttons):
- Underline, Strike (strikethrough), Blockquote, CodeBlock, HorizontalRule

**Font size approach**: Use `@tiptap/extension-text-style` with a custom `setFontSize` command. `@tiptap/extension-font-size` is deprecated — font size is applied via the TextStyle mark's `fontSize` attribute.

**StarterKit Link conflict**: The existing code imports `Link` from `@tiptap/extension-link` separately. StarterKit v3 also includes Link. Configure `StarterKit.configure({ link: false })` to avoid duplicate extension, and keep the separate `Link` import with custom config.

### 3. Extract EditorToolbar Component

Move `MenuBar` to `src/components/EditorToolbar.tsx`:

```typescript
interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  onVideoInsert: (parsedVideo: ParsedVideo) => void;
}
```

- `editor` — TipTap editor instance for commands and active state checks
- `onImageUpload` — callback to trigger the image upload flow (defined in TiptapEditor)
- `onVideoInsert` — callback to open the video insert dialog (defined in TiptapEditor)
- Image upload and video dialog state remain in `TiptapEditor.tsx`

### 4. Toolbar Layout

Organize buttons into logical groups separated by dividers (`|`):

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

**Font size dropdown**: Shows "默认" (default) as the first option to reset, followed by: 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px. When a custom size is active, display the current size. Selecting "默认" calls `unsetFontSize`.

**Color pickers**: Predefined palette of 10-12 colors displayed in a small grid popup. Include a "清除颜色" (remove color) option. Palette: black, dark gray, red, orange, yellow, green, blue, purple, pink, white.

**Table insert**: Simple approach — fixed 3x3 table on click. When cursor is inside a table, show additional context buttons: add row above/below, add column left/right, delete row/column, delete table, merge/split cells.

### 5. Table Support

- Default insert: 3 rows x 3 columns with header row
- Context toolbar (visible when cursor is in a table): add/delete row, add/delete column, merge cells, split cell, delete table
- Table extension configured with `HTMLAttributes: { class: 'border-collapse w-full' }`

**Required CSS for tables**:
```css
.ProseMirror table { border-collapse: collapse; width: 100%; margin: 1em 0; }
.ProseMirror th, .ProseMirror td { border: 1px solid #d1d5db; padding: 0.5em; min-width: 80px; }
.ProseMirror th { background: #f3f4f6; font-weight: 600; }
.ProseMirror .selectedCell { background: #dbeafe; }
```

**Required CSS for highlight**:
```css
.ProseMirror mark { background-color: #fef08a; padding: 0.1em 0.2em; border-radius: 2px; }
```

### 6. Files Changed

- `src/components/EditorToolbar.tsx` — new file, extracted toolbar component
- `src/components/TiptapEditor.tsx` — add extensions, restructure container, fix StarterKit config
- `package.json` — add new TipTap extension dependencies
- Global styles in `TiptapEditor.tsx` — add table, highlight CSS

## Constraints

- Must remain SSR-safe (`immediatelyRender: false`)
- Must maintain backward compatibility with existing content (HTML format)
- Keep the existing video extension and image upload working
- No new UI framework dependencies — use plain Tailwind CSS like the existing code
- Verify `@tiptap/pm` peer dependency is resolved at the correct version when adding new extensions
