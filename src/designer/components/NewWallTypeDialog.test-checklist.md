# NewWallTypeDialog Test Checklist

## Manual Testing Checklist

### Dialog Display
- [ ] Dialog opens when clicking "Add New Wall Type" button in sidebar
- [ ] Dialog displays with proper styling (Level Editor theme)
- [ ] Dialog is centered on screen
- [ ] Backdrop is visible and semi-transparent
- [ ] Dialog has proper shadow and border

### Name Input Field
- [ ] Name input field is focused when dialog opens
- [ ] Placeholder text is visible ("e.g., Metal, Glass, Marble")
- [ ] Required indicator (*) is shown
- [ ] Hint text is displayed below input
- [ ] Input accepts text input
- [ ] Input shows hover effect on hover
- [ ] Input shows focus effect when focused

### Name Validation
- [ ] Error shown when name is empty and form submitted
- [ ] Error shown when name is less than 2 characters
- [ ] Error shown when name is more than 50 characters
- [ ] Error shown when name already exists (case-insensitive)
- [ ] Error clears when user starts typing
- [ ] Error message is displayed in red below input
- [ ] Input border turns red when error is present

### Based On Selector
- [ ] Dropdown shows "Start from scratch" as default option
- [ ] Dropdown lists all existing wall types from active theme
- [ ] Dropdown shows proper styling (Level Editor theme)
- [ ] Dropdown arrow icon is visible
- [ ] Hint text is displayed below dropdown
- [ ] Selection changes when option is clicked

### Create Button
- [ ] Create button is disabled when name is empty
- [ ] Create button is enabled when name has valid text
- [ ] Create button has primary styling (green)
- [ ] Create button shows hover effect
- [ ] Clicking create button calls onCreate handler
- [ ] Dialog closes after successful creation

### Cancel Button
- [ ] Cancel button is visible
- [ ] Cancel button has default styling
- [ ] Cancel button shows hover effect
- [ ] Clicking cancel button closes dialog without creating
- [ ] Dialog state is reset when cancelled

### Keyboard Interactions
- [ ] Tab key moves focus through form fields
- [ ] Enter key submits form when in name input
- [ ] Escape key closes dialog
- [ ] Escape key works from any focused element
- [ ] Focus indicators are visible

### Integration with Theme Manager
- [ ] New wall type is added to active theme
- [ ] New wall type has correct name
- [ ] New wall type has default properties when created from scratch
- [ ] New wall type copies properties when based on existing type
- [ ] Theme is marked as dirty after creation
- [ ] New wall type appears in sidebar list
- [ ] Undo/redo works with wall type creation

### Responsive Design
- [ ] Dialog is responsive on smaller screens
- [ ] Dialog width adjusts on mobile (95% width)
- [ ] Buttons stack vertically on mobile
- [ ] Dialog remains centered on all screen sizes

### Accessibility
- [ ] Dialog has proper ARIA attributes (role="dialog", aria-modal="true")
- [ ] Dialog title has proper ID and aria-labelledby
- [ ] Close button has aria-label
- [ ] Form fields have proper labels
- [ ] Required field has aria-required
- [ ] Error messages have role="alert"
- [ ] Error messages are associated with input via aria-describedby
- [ ] Focus is trapped within dialog when open

## Test Scenarios

### Scenario 1: Create wall type from scratch
1. Open designer mode
2. Load default theme
3. Click "Add New Wall Type" button
4. Enter name "Metal"
5. Leave "Based On" as "Start from scratch"
6. Click "Create Wall Type"
7. Verify new wall type appears in list with default gray colors

### Scenario 2: Create wall type based on existing
1. Open designer mode
2. Load default theme
3. Click "Add New Wall Type" button
4. Enter name "Dark Brick"
5. Select "Brick Wall" from "Based On" dropdown
6. Click "Create Wall Type"
7. Verify new wall type appears with brick-like colors

### Scenario 3: Validation - Empty name
1. Open dialog
2. Leave name empty
3. Click "Create Wall Type"
4. Verify error message "Name is required" appears
5. Verify input border is red

### Scenario 4: Validation - Duplicate name
1. Open dialog
2. Enter name "Brick Wall" (existing wall type)
3. Click "Create Wall Type"
4. Verify error message "A wall type with this name already exists"

### Scenario 5: Cancel operation
1. Open dialog
2. Enter name "Test"
3. Click "Cancel"
4. Verify dialog closes
5. Verify no new wall type was created
6. Open dialog again
7. Verify form is reset (name is empty)

### Scenario 6: Keyboard navigation
1. Open dialog
2. Verify name input is focused
3. Press Tab to move to "Based On" dropdown
4. Press Tab to move to "Cancel" button
5. Press Tab to move to "Create" button
6. Press Shift+Tab to move backwards
7. Press Escape to close dialog

### Scenario 7: Escape key closes dialog
1. Open dialog
2. Press Escape key
3. Verify dialog closes
4. Verify no wall type was created

## Known Issues
- None at this time

## Notes
- Dialog uses Level Editor color scheme consistently
- All animations are smooth and performant (< 300ms)
- Form validation is immediate and user-friendly
- Dialog is fully accessible via keyboard
