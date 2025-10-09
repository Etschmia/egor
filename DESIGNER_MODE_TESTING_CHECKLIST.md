# Designer Mode - Complete Workflow Testing Checklist

This document provides a comprehensive manual testing checklist for the Designer Mode. Use this to verify all functionality works as expected.

## Prerequisites

Before starting tests:
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Start the designer backend: `npm run designer:backend`
- [ ] Start the designer frontend: `npm run designer:frontend`
- [ ] Open browser to `http://localhost:3002/designer.html`
- [ ] Ensure default theme exists in `themes/default.json`

---

## 1. Theme Loading and Switching

### Test 1.1: Initial Theme Load
- [ ] Designer Mode loads without errors
- [ ] Default theme is displayed in header
- [ ] Wall types list shows all wall types (Brick, Wood, Stone, Door)
- [ ] No console errors

### Test 1.2: Theme Switching
- [ ] Click on theme selector dropdown in header
- [ ] Dropdown shows all available themes
- [ ] Select a different theme
- [ ] Theme loads successfully
- [ ] Wall types update to reflect new theme
- [ ] Preview updates with new theme colors

### Test 1.3: Loading States
- [ ] Loading overlay appears during theme load
- [ ] Loading message is displayed
- [ ] UI is disabled during loading
- [ ] Loading overlay disappears when complete

**Expected Result:** Themes load and switch smoothly without errors.

---

## 2. Wall Type Selection and Editing

### Test 2.1: Wall Type List Display
- [ ] Sidebar shows all wall types
- [ ] Each wall type shows:
  - Name
  - Small preview thumbnail
  - Color indicators
- [ ] Wall types are visually distinct

### Test 2.2: Wall Type Selection
- [ ] Click on "Brick Wall"
- [ ] Wall type is highlighted/selected
- [ ] Property panel updates to show brick properties
- [ ] Preview shows brick texture
- [ ] Select different wall type (Wood)
- [ ] Selection updates correctly

### Test 2.3: Wall Type Preview Thumbnails
- [ ] Each wall type thumbnail shows correct texture
- [ ] Thumbnails update when colors change
- [ ] Thumbnails are clear and recognizable

**Expected Result:** Wall types can be selected and their properties displayed.

---

## 3. Color Changes with Live Preview

### Test 3.1: Color Picker Opening
- [ ] Select a wall type
- [ ] Expand "Colors" property group
- [ ] Click on primary color preview box
- [ ] Color picker dialog opens
- [ ] Dialog shows current color
- [ ] Dialog has hex input field
- [ ] Dialog has HSL sliders

### Test 3.2: Color Change via Hex Input
- [ ] Enter new hex color (e.g., #FF0000)
- [ ] Preview box updates immediately
- [ ] Click "Confirm" or "Apply"
- [ ] Dialog closes
- [ ] Wall type preview updates with new color
- [ ] Sidebar thumbnail updates
- [ ] Change is marked as dirty (● indicator)

### Test 3.3: Color Change via HSL Sliders
- [ ] Open color picker
- [ ] Adjust Hue slider
- [ ] Preview updates in real-time
- [ ] Adjust Saturation slider
- [ ] Preview updates in real-time
- [ ] Adjust Lightness slider
- [ ] Preview updates in real-time
- [ ] Confirm changes
- [ ] Main preview updates

### Test 3.4: Color Presets
- [ ] Open color picker
- [ ] Click on a preset color
- [ ] Color updates immediately
- [ ] Hex input shows preset color value

### Test 3.5: Live Preview Performance
- [ ] Make rapid color changes
- [ ] Preview updates smoothly (< 100ms)
- [ ] No lag or freezing
- [ ] Debouncing works correctly

### Test 3.6: Multiple Color Properties
- [ ] Change primary color
- [ ] Change secondary color
- [ ] Change accent color
- [ ] All colors update independently
- [ ] Preview shows all color changes

**Expected Result:** Colors can be changed easily with immediate visual feedback.

---

## 4. Dimension Changes

### Test 4.1: Dimension Slider Interaction
- [ ] Select a wall type
- [ ] Expand "Dimensions" property group
- [ ] Find "Width" slider
- [ ] Current value is displayed (e.g., "64px")
- [ ] Drag slider to new position
- [ ] Value updates in real-time
- [ ] Preview updates with new dimensions

### Test 4.2: All Dimension Properties
- [ ] Adjust Width slider
- [ ] Preview updates
- [ ] Adjust Height slider
- [ ] Preview updates
- [ ] Adjust Spacing slider (if available)
- [ ] Preview updates
- [ ] Adjust Border Width slider (if available)
- [ ] Preview updates

### Test 4.3: Dimension Constraints
- [ ] Try to set width below minimum
- [ ] Value is constrained to minimum
- [ ] Try to set width above maximum
- [ ] Value is constrained to maximum
- [ ] Step increments work correctly

### Test 4.4: Dimension Units
- [ ] Values display with correct units (px, %, etc.)
- [ ] Units are consistent across all dimensions

**Expected Result:** Dimensions can be adjusted with sliders and preview updates accordingly.

---

## 5. Effect Toggles

### Test 5.1: Shadow Effect
- [ ] Select a wall type
- [ ] Expand "Effects" property group
- [ ] Find "Shadow" toggle
- [ ] Toggle shadow ON
- [ ] Preview shows shadow effect
- [ ] Toggle shadow OFF
- [ ] Preview removes shadow effect

### Test 5.2: Highlight Effect
- [ ] Find "Highlight" toggle
- [ ] Toggle highlight ON
- [ ] Preview shows highlight effect
- [ ] Toggle highlight OFF
- [ ] Preview removes highlight effect

### Test 5.3: Gradient Effect
- [ ] Find "Gradient" toggle (if available)
- [ ] Toggle gradient ON
- [ ] Preview shows gradient
- [ ] Adjust gradient properties
- [ ] Preview updates
- [ ] Toggle gradient OFF

### Test 5.4: Multiple Effects Combined
- [ ] Enable shadow
- [ ] Enable highlight
- [ ] Enable gradient
- [ ] All effects visible in preview
- [ ] Effects work together correctly

**Expected Result:** Effects can be toggled on/off with immediate visual feedback.

---

## 6. Save Functionality

### Test 6.1: Dirty State Indicator
- [ ] Make any change to theme
- [ ] Dirty indicator (●) appears in header
- [ ] Save button becomes enabled
- [ ] Undo button becomes enabled

### Test 6.2: Save Button
- [ ] Make changes to theme
- [ ] Click "Save" button
- [ ] Success toast notification appears
- [ ] Dirty indicator disappears
- [ ] Save button becomes disabled
- [ ] Changes persist after page reload

### Test 6.3: Keyboard Shortcut Save (Ctrl+S)
- [ ] Make changes to theme
- [ ] Press Ctrl+S (Cmd+S on Mac)
- [ ] Theme saves successfully
- [ ] Success notification appears
- [ ] Browser's default save dialog does NOT appear

### Test 6.4: Save Validation
- [ ] Make invalid changes (if possible)
- [ ] Try to save
- [ ] Validation error appears
- [ ] Theme is not saved
- [ ] Error message is clear

### Test 6.5: Save Error Handling
- [ ] Stop backend server
- [ ] Make changes
- [ ] Try to save
- [ ] Error toast appears
- [ ] Error message is helpful
- [ ] Changes remain in UI (not lost)

**Expected Result:** Themes can be saved reliably with clear feedback.

---

## 7. Undo/Redo

### Test 7.1: Undo Single Change
- [ ] Make a color change
- [ ] Click "Undo" button
- [ ] Change is reverted
- [ ] Preview updates to previous state
- [ ] Undo button becomes disabled (if no more history)

### Test 7.2: Undo Multiple Changes
- [ ] Make 3 different changes
- [ ] Click "Undo" 3 times
- [ ] Each change is reverted in reverse order
- [ ] Preview updates correctly each time

### Test 7.3: Redo After Undo
- [ ] Make a change
- [ ] Undo the change
- [ ] Redo button becomes enabled
- [ ] Click "Redo" button
- [ ] Change is reapplied
- [ ] Preview updates

### Test 7.4: Keyboard Shortcuts
- [ ] Make a change
- [ ] Press Ctrl+Z (Cmd+Z on Mac)
- [ ] Change is undone
- [ ] Press Ctrl+Y (Cmd+Y on Mac)
- [ ] Change is redone

### Test 7.5: History Limit
- [ ] Make 51+ changes
- [ ] Undo should work for last 50 changes
- [ ] Oldest changes are removed from history

### Test 7.6: Undo/Redo State
- [ ] Undo button disabled when no history
- [ ] Redo button disabled when no future
- [ ] Buttons enable/disable correctly

**Expected Result:** Undo/redo works reliably for all changes.

---

## 8. Theme Creation

### Test 8.1: New Theme Dialog
- [ ] Click "New Theme" button in header
- [ ] Dialog opens
- [ ] Dialog has name input field
- [ ] Dialog has "Based On" dropdown
- [ ] Dialog has "Create" and "Cancel" buttons

### Test 8.2: Create Theme from Scratch
- [ ] Open new theme dialog
- [ ] Enter theme name: "My Custom Theme"
- [ ] Leave "Based On" empty or select "None"
- [ ] Click "Create"
- [ ] New theme is created
- [ ] New theme is activated
- [ ] Theme appears in theme selector

### Test 8.3: Create Theme Based on Existing
- [ ] Open new theme dialog
- [ ] Enter theme name: "Dark Brick Theme"
- [ ] Select "Default" in "Based On" dropdown
- [ ] Click "Create"
- [ ] New theme is created with default values
- [ ] Can modify new theme independently

### Test 8.4: Theme Name Validation
- [ ] Try to create theme with empty name
- [ ] Validation error appears
- [ ] Try to create theme with existing name
- [ ] Validation error appears
- [ ] Error messages are clear

### Test 8.5: Keyboard Shortcut (Ctrl+N)
- [ ] Press Ctrl+N (Cmd+N on Mac)
- [ ] New theme dialog opens
- [ ] Focus is on name input field

**Expected Result:** New themes can be created easily.

---

## 9. Import/Export

### Test 9.1: Export as JSON
- [ ] Click "Export" button in header
- [ ] Dropdown shows "JSON" and "CSS" options
- [ ] Click "JSON"
- [ ] File download starts
- [ ] Downloaded file is valid JSON
- [ ] JSON contains all theme data
- [ ] Filename includes theme name and timestamp

### Test 9.2: Export as CSS
- [ ] Click "Export" button
- [ ] Click "CSS"
- [ ] File download starts
- [ ] Downloaded file is valid CSS
- [ ] CSS contains CSS custom properties
- [ ] CSS variables match theme values

### Test 9.3: Import Valid Theme
- [ ] Click "Import" button
- [ ] File picker opens
- [ ] Select valid theme JSON file
- [ ] Theme imports successfully
- [ ] Success toast appears
- [ ] Imported theme is activated
- [ ] Theme appears in theme selector

### Test 9.4: Import Invalid File
- [ ] Click "Import" button
- [ ] Select invalid JSON file
- [ ] Error toast appears
- [ ] Error message explains the issue
- [ ] Current theme remains active

### Test 9.5: Import Validation
- [ ] Import theme with missing required fields
- [ ] Validation error appears
- [ ] Import theme with invalid color values
- [ ] Validation error appears
- [ ] Error messages are specific

### Test 9.6: Round-Trip Test
- [ ] Export current theme as JSON
- [ ] Import the exported file
- [ ] Theme matches original exactly
- [ ] No data loss

**Expected Result:** Themes can be imported and exported reliably.

---

## 10. Keyboard Shortcuts

### Test 10.1: Shortcuts Modal
- [ ] Press F1
- [ ] Keyboard shortcuts modal opens
- [ ] All shortcuts are listed
- [ ] Shortcuts are organized by category
- [ ] Modal can be closed with Escape

### Test 10.2: Save Shortcut (Ctrl+S)
- [ ] Make changes
- [ ] Press Ctrl+S
- [ ] Theme saves
- [ ] Browser save dialog does NOT appear

### Test 10.3: Undo Shortcut (Ctrl+Z)
- [ ] Make a change
- [ ] Press Ctrl+Z
- [ ] Change is undone

### Test 10.4: Redo Shortcut (Ctrl+Y)
- [ ] Undo a change
- [ ] Press Ctrl+Y
- [ ] Change is redone

### Test 10.5: New Theme Shortcut (Ctrl+N)
- [ ] Press Ctrl+N
- [ ] New theme dialog opens

### Test 10.6: Escape to Close Dialogs
- [ ] Open any dialog
- [ ] Press Escape
- [ ] Dialog closes

### Test 10.7: Shortcuts in Input Fields
- [ ] Focus on a text input
- [ ] Press Ctrl+S
- [ ] Shortcut is disabled (input receives key)
- [ ] Type normally in input

### Test 10.8: Visual Feedback
- [ ] Use any shortcut
- [ ] Visual feedback is provided
- [ ] Toast or animation confirms action

**Expected Result:** All keyboard shortcuts work correctly.

---

## 11. Responsive Layout

### Test 11.1: Desktop (> 1200px)
- [ ] Open designer on large screen
- [ ] Sidebar is visible (280px width)
- [ ] Property panel is visible (320px width)
- [ ] Preview area has adequate space
- [ ] All elements are accessible

### Test 11.2: Tablet (768px - 1200px)
- [ ] Resize browser to ~1000px width
- [ ] Sidebar becomes narrower
- [ ] Property panel adjusts
- [ ] Preview area adjusts
- [ ] No horizontal scrolling
- [ ] All features still accessible

### Test 11.3: Mobile (< 768px)
- [ ] Resize browser to ~600px width
- [ ] Sidebar collapses to overlay mode
- [ ] Toggle button appears for sidebar
- [ ] Click toggle to open sidebar
- [ ] Sidebar appears as overlay
- [ ] Click outside sidebar to close
- [ ] Property panel stacks below preview

### Test 11.4: Sidebar Toggle
- [ ] On small screen, sidebar is collapsed
- [ ] Click hamburger/toggle button
- [ ] Sidebar slides in from left
- [ ] Sidebar overlays main content
- [ ] Click outside sidebar
- [ ] Sidebar closes

### Test 11.5: Touch Interactions (Mobile)
- [ ] Test on actual mobile device or emulator
- [ ] Tap to select wall type
- [ ] Tap to open color picker
- [ ] Swipe to adjust sliders
- [ ] Pinch to zoom preview (if supported)
- [ ] All interactions work smoothly

### Test 11.6: Orientation Changes
- [ ] Rotate device/browser
- [ ] Layout adjusts correctly
- [ ] No content is cut off
- [ ] All features remain accessible

**Expected Result:** Designer Mode works on all screen sizes.

---

## 12. Error Scenarios

### Test 12.1: Backend Offline
- [ ] Stop backend server
- [ ] Try to load theme
- [ ] Error message appears
- [ ] Error message is user-friendly
- [ ] Retry option is available
- [ ] Start backend
- [ ] Retry works

### Test 12.2: Network Timeout
- [ ] Simulate slow network (browser dev tools)
- [ ] Try to save theme
- [ ] Loading indicator appears
- [ ] Timeout error appears after delay
- [ ] Error message is clear

### Test 12.3: Invalid Theme Data
- [ ] Manually edit theme file to be invalid
- [ ] Try to load theme
- [ ] Validation error appears
- [ ] Fallback to default theme
- [ ] Error message explains issue

### Test 12.4: Texture Generation Error
- [ ] Select wall type with invalid texture config
- [ ] Preview shows error state
- [ ] Error message is displayed
- [ ] Can still edit other properties
- [ ] Can fix texture config

### Test 12.5: File System Errors
- [ ] Remove write permissions on themes folder
- [ ] Try to save theme
- [ ] Permission error appears
- [ ] Error message suggests solution
- [ ] Changes remain in UI

### Test 12.6: Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] All features work in all browsers

### Test 12.7: Error Recovery
- [ ] Trigger any error
- [ ] Dismiss error message
- [ ] Continue using designer
- [ ] All features still work
- [ ] No lingering error state

**Expected Result:** Errors are handled gracefully with helpful messages.

---

## 13. Performance Testing

### Test 13.1: Initial Load Time
- [ ] Clear browser cache
- [ ] Load designer
- [ ] Measure load time (should be < 2 seconds)
- [ ] No performance warnings in console

### Test 13.2: Theme Switching Performance
- [ ] Switch between themes rapidly
- [ ] No lag or freezing
- [ ] Transitions are smooth

### Test 13.3: Preview Update Performance
- [ ] Make rapid color changes
- [ ] Preview updates smoothly
- [ ] Debouncing prevents excessive updates
- [ ] No frame drops

### Test 13.4: Large Theme Performance
- [ ] Load theme with many wall types
- [ ] Sidebar renders quickly
- [ ] Scrolling is smooth
- [ ] Selection is responsive

### Test 13.5: Memory Usage
- [ ] Open browser dev tools
- [ ] Monitor memory usage
- [ ] Use designer for 10 minutes
- [ ] Make various changes
- [ ] Memory usage remains stable
- [ ] No memory leaks

### Test 13.6: Texture Cache Performance
- [ ] Select same wall type multiple times
- [ ] Preview loads instantly from cache
- [ ] Cache statistics show hits
- [ ] Cache doesn't grow indefinitely

**Expected Result:** Designer Mode performs well under all conditions.

---

## 14. Accessibility Testing

### Test 14.1: Keyboard Navigation
- [ ] Use only keyboard (no mouse)
- [ ] Tab through all interactive elements
- [ ] Tab order is logical
- [ ] All features are accessible
- [ ] Focus indicators are visible

### Test 14.2: Screen Reader
- [ ] Enable screen reader (NVDA, JAWS, VoiceOver)
- [ ] Navigate through designer
- [ ] All elements are announced
- [ ] Labels are descriptive
- [ ] State changes are announced

### Test 14.3: Focus Management
- [ ] Open dialog
- [ ] Focus moves to dialog
- [ ] Tab stays within dialog
- [ ] Close dialog
- [ ] Focus returns to trigger element

### Test 14.4: ARIA Labels
- [ ] Inspect elements in dev tools
- [ ] All interactive elements have ARIA labels
- [ ] Labels are descriptive
- [ ] Roles are appropriate

### Test 14.5: Color Contrast
- [ ] Use contrast checker tool
- [ ] All text meets WCAG AA (4.5:1)
- [ ] Interactive elements are distinguishable
- [ ] Focus indicators are visible

### Test 14.6: Alternative Text
- [ ] All images have alt text
- [ ] Icons have aria-labels
- [ ] Decorative images are marked as such

**Expected Result:** Designer Mode is fully accessible.

---

## 15. Integration Testing

### Test 15.1: Parallel Execution
- [ ] Start main game (npm run dev)
- [ ] Start level editor (npm run editor)
- [ ] Start designer mode (npm run designer)
- [ ] All three run without conflicts
- [ ] Each accessible on correct port
- [ ] No port conflicts

### Test 15.2: Shared Utilities
- [ ] Changes in designer affect game
- [ ] TextureGenerator works correctly
- [ ] ThemeManager is consistent
- [ ] No conflicts between modes

### Test 15.3: Theme Persistence
- [ ] Create theme in designer
- [ ] Save theme
- [ ] Close designer
- [ ] Reopen designer
- [ ] Theme is still available
- [ ] Changes are persisted

### Test 15.4: Cross-Browser Testing
- [ ] Test in multiple browsers
- [ ] All features work consistently
- [ ] No browser-specific bugs

**Expected Result:** Designer Mode integrates well with the rest of the system.

---

## Test Summary

### Pass Criteria
- [ ] All critical tests pass
- [ ] No blocking bugs
- [ ] Performance is acceptable
- [ ] Accessibility requirements met
- [ ] Error handling is robust

### Known Issues
Document any issues found during testing:

1. Issue: _______________
   Severity: _______________
   Steps to reproduce: _______________

2. Issue: _______________
   Severity: _______________
   Steps to reproduce: _______________

### Test Environment
- Browser: _______________
- OS: _______________
- Screen Size: _______________
- Date: _______________
- Tester: _______________

### Notes
Additional observations or comments:

---

## Automated Test Execution

To run automated tests:

```bash
# Run all designer tests
npm run test -- src/designer/Designer.test.tsx

# Run with coverage
npm run test -- --coverage src/designer/

# Run in watch mode
npm run test -- --watch src/designer/Designer.test.tsx
```

---

## Conclusion

This checklist ensures comprehensive testing of all Designer Mode features. Complete all sections before considering the feature production-ready.
