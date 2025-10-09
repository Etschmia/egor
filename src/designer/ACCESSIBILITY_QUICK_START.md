# Accessibility Quick Start Guide

## For Developers

### Testing Accessibility Features

#### 1. Quick Visual Test
Open the test page in your browser:
```bash
open src/designer/accessibility-test.html
```

#### 2. Run Designer Mode
```bash
npm run designer
```

#### 3. Keyboard Navigation Test
1. Press `Tab` from the top of the page
2. Verify skip links appear
3. Continue tabbing through all elements
4. Check that focus indicators are visible (green outline)
5. Test keyboard shortcuts:
   - `Ctrl+S` - Save
   - `Ctrl+Z` - Undo
   - `Ctrl+Y` - Redo
   - `F1` - Show shortcuts
   - `Escape` - Close dialogs

#### 4. Screen Reader Test (Mac)
```bash
# Enable VoiceOver
Cmd+F5

# Navigate
Tab - Move to next element
Shift+Tab - Move to previous element
VO+Space - Activate element
VO+Right Arrow - Read next item
```

#### 5. Screen Reader Test (Windows)
```bash
# Start NVDA
Ctrl+Alt+N

# Navigate
Tab - Move to next element
Shift+Tab - Move to previous element
Enter/Space - Activate element
Down Arrow - Read next item
```

## For Users

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save theme | `Ctrl+S` (Windows) / `Cmd+S` (Mac) |
| Undo | `Ctrl+Z` (Windows) / `Cmd+Z` (Mac) |
| Redo | `Ctrl+Y` (Windows) / `Cmd+Y` (Mac) |
| New theme | `Ctrl+N` (Windows) / `Cmd+N` (Mac) |
| Show shortcuts | `F1` |
| Close dialog | `Escape` |

### Navigation Tips

#### Skip Links
Press `Tab` from the top of the page to reveal skip links:
- Skip to main content
- Skip to asset list
- Skip to properties

#### Keyboard Navigation
- Use `Tab` to move forward through interactive elements
- Use `Shift+Tab` to move backward
- Use `Enter` or `Space` to activate buttons
- Use arrow keys in dropdowns and sliders
- Use `Escape` to close dialogs

#### Screen Reader Users
All interactive elements have descriptive labels. The application announces:
- Button names and states
- Form labels and hints
- Error messages
- Loading states
- Success/error notifications

## Accessibility Features

### ✅ Keyboard Navigation
- All features accessible via keyboard
- Logical tab order
- Skip links for quick navigation
- Keyboard shortcuts for common actions

### ✅ Focus Indicators
- Visible green outline on focused elements
- 2px outline with 2px offset (standard)
- 3px outline with 3px offset (high contrast mode)

### ✅ Screen Reader Support
- ARIA labels on all interactive elements
- Semantic HTML structure
- Live region announcements
- Form labels and error messages

### ✅ Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Information not conveyed by color alone
- High contrast mode support

### ✅ Reduced Motion
- Respects user's motion preferences
- Animations disabled for users who prefer reduced motion

## Common Issues & Solutions

### Issue: Focus indicator not visible
**Solution:** Check browser zoom level. Focus indicators are designed for 100% zoom.

### Issue: Keyboard shortcuts not working
**Solution:** Make sure you're not in an input field. Most shortcuts are disabled while typing.

### Issue: Screen reader not announcing elements
**Solution:** 
1. Ensure screen reader is running
2. Try refreshing the page
3. Check that JavaScript is enabled

### Issue: Skip links not appearing
**Solution:** Press `Tab` from the very top of the page (reload if needed).

## Browser Compatibility

### Tested Browsers
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

### Screen Readers
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (Mac/iOS)
- ✅ TalkBack (Android)

## Reporting Accessibility Issues

If you encounter accessibility issues:

1. **Document the issue:**
   - What were you trying to do?
   - What happened?
   - What did you expect to happen?
   - What browser/screen reader are you using?

2. **Include steps to reproduce:**
   - Step-by-step instructions
   - Screenshots if applicable

3. **Report via:**
   - GitHub Issues
   - Email to accessibility team
   - In-app feedback form

## Additional Resources

### Documentation
- `ACCESSIBILITY.md` - Comprehensive accessibility documentation
- `ACCESSIBILITY_VISUAL_REFERENCE.md` - Visual examples and diagrams
- `accessibility-test.html` - Interactive test page

### External Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Keyboard Accessibility](https://webaim.org/articles/keyboard/)
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  DESIGNER MODE - ACCESSIBILITY QUICK REFERENCE      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  KEYBOARD SHORTCUTS                                 │
│  ─────────────────                                  │
│  Ctrl+S / Cmd+S ........... Save theme             │
│  Ctrl+Z / Cmd+Z ........... Undo                   │
│  Ctrl+Y / Cmd+Y ........... Redo                   │
│  Ctrl+N / Cmd+N ........... New theme              │
│  F1 ....................... Show shortcuts         │
│  Escape ................... Close dialog           │
│                                                     │
│  NAVIGATION                                         │
│  ──────────                                         │
│  Tab ....................... Next element          │
│  Shift+Tab ................. Previous element      │
│  Enter/Space ............... Activate button       │
│  Arrow keys ................ Navigate lists        │
│                                                     │
│  SKIP LINKS (Press Tab from top)                   │
│  ──────────                                         │
│  Skip to main content                              │
│  Skip to asset list                                │
│  Skip to properties                                │
│                                                     │
│  FOCUS INDICATORS                                   │
│  ────────────────                                   │
│  Green outline (2px) on all focused elements       │
│                                                     │
│  SCREEN READER SUPPORT                             │
│  ────────────────────                               │
│  All elements have descriptive labels              │
│  Live announcements for updates                    │
│  Form labels and error messages                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**Need Help?** See `ACCESSIBILITY.md` for detailed documentation.

Last Updated: January 9, 2025
