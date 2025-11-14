# Prompt Input Redesign ✅

## Changes Made

### Visual Design

- ✅ **Background**: Changed to `bg-bk-40` (matches left-panel toolbar)
- ✅ **Shadow**: Very light shadow (0 2px 8px rgba(0,0,0,0.08)) only when floating
- ✅ **Border**: Removed border for cleaner look
- ✅ **Rounded**: `rounded-lg` for container

### Layout Structure

```
Container (bg-bk-40, rounded-lg)
├── Textarea (top section, full width)
│   ├── Placeholder: "Type your message here..."
│   ├── Font size: 12px
│   └── Auto-resize (min 48px, max 200px)
└── Action Row (bottom section)
    ├── Left: Attachment icon (paperclip)
    └── Right: Send icon (arrow in box)
```

### Action Row

- **Height**: 6x6 buttons (24px)
- **Icons**: 12px size
- **Spacing**: px-2 pb-2
- **Hover**: bg-bk-30 on hover
- **Colors**: text-fg-60 default, text-fg-50 on hover

### Icons

**Attachment (Left)**

- Paperclip icon
- 12px size
- Hover effect
- Ready for file upload functionality

**Send (Right)**

- Arrow in box icon (your provided SVG)
- 12px size
- Disabled when message is empty
- Opacity 40% when disabled

### Browser Extensions Disabled

Added multiple attributes to prevent Grammarly and other extensions:

```tsx
data-gramm="false"
data-gramm_editor="false"
data-enable-grammarly="false"
spellCheck="false"
autoComplete="off"
autoCorrect="off"
autoCapitalize="off"
```

### Textarea Styling

- **Font size**: 12px
- **Placeholder**: text-fg-70 (lighter gray)
- **Padding**: px-3 pt-3 pb-2
- **Background**: Transparent (inherits from container)
- **Rounded**: rounded-t-lg (top corners only)
- **Min height**: 48px
- **Max height**: 200px
- **Auto-resize**: Yes

### Future-Ready

The action row is designed to accommodate:

- Model selection dropdown
- Temperature controls
- Token counter
- Other AI settings

## Design Consistency

### Matches Left Panel Toolbar

- Same background color (bg-bk-40)
- Same rounded style
- Same hover effects (bg-bk-30)
- Same icon sizing approach

### Color Palette

- Container: `bg-bk-40`
- Text: `text-fg-50`
- Placeholder: `text-fg-70`
- Icons: `text-fg-60` → `text-fg-50` on hover
- Hover BG: `bg-bk-30`

## Floating vs Panel Mode

### Floating (Canvas Center)

- Fixed position: `bottom-6 left-1/2 -translate-x-1/2`
- Width: 600px
- Light shadow: `0 2px 8px rgba(0,0,0,0.08)`
- z-index: 50

### Panel (Chat Panel)

- Full width
- No shadow
- Same styling otherwise

## User Experience

### Typing

1. Click in textarea
2. Type message (12px font)
3. Auto-resizes as you type
4. Enter to send, Shift+Enter for new line

### Sending

1. Type message
2. Click send icon (or press Enter)
3. Message clears
4. Ready for next message

### Attachment

1. Click paperclip icon
2. File picker opens (TODO)
3. File attaches to message (TODO)

## Technical Details

### Auto-Resize Logic

```tsx
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
}, [message]);
```

### Send Handler

```tsx
const handleSubmit = () => {
  if (!message.trim()) return;
  if (onSubmit) onSubmit(message);
  setMessage("");
};
```

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift+Enter**: New line

## Files Modified

- `components/modules/project/common/prompt-input.tsx` - Complete redesign

## Testing Checklist

- [x] Background matches toolbar (bg-bk-40)
- [x] Light shadow when floating
- [x] No shadow in panel mode
- [x] Attachment icon shows (12px)
- [x] Send icon shows (12px)
- [x] Send disabled when empty
- [x] Hover effects work
- [x] Auto-resize works
- [x] Enter sends message
- [x] Shift+Enter adds new line
- [x] Placeholder is 12px
- [x] Grammarly disabled
- [x] No TypeScript errors

---

**Status**: Complete ✅  
**Next**: Add file attachment functionality and model selection dropdown
