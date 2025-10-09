# Theme Import - Test Checklist

## Prerequisites
- [ ] Designer Mode is running (`npm run designer`)
- [ ] Designer Backend is running (port 3004)
- [ ] Browser is open to `http://localhost:3002/designer.html`

## Test Cases

### ✅ Test 1: Valid Theme Import
**Steps:**
1. Click the "Import" button (📥) in the header
2. Select `test-theme-import.json` from the project root
3. Wait for processing

**Expected Results:**
- [ ] Success toast appears: "Theme 'Test Import Theme' imported successfully!"
- [ ] Toast has green background with checkmark icon
- [ ] Theme appears in theme selector dropdown
- [ ] Theme is automatically set as active
- [ ] Toast auto-dismisses after 5 seconds

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 2: Invalid File Type
**Steps:**
1. Create a text file: `test.txt`
2. Click the "Import" button
3. Try to select the .txt file

**Expected Results:**
- [ ] File picker filters to .json files only
- [ ] If .txt file is somehow selected, error toast appears
- [ ] Error message: "Invalid file type. Please select a JSON file."
- [ ] Toast has red background with X icon

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 3: Invalid JSON Format
**Steps:**
1. Create file `invalid.json` with content: `{ invalid json }`
2. Click the "Import" button
3. Select the invalid JSON file

**Expected Results:**
- [ ] Error toast appears
- [ ] Error message: "Invalid JSON file. Please check the file format."
- [ ] Toast has red background with X icon
- [ ] No theme is imported

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 4: Missing Required Fields
**Steps:**
1. Create file `incomplete-theme.json`:
```json
{
  "version": "1.0.0",
  "wallTypes": {}
}
```
2. Click the "Import" button
3. Select the incomplete theme file

**Expected Results:**
- [ ] Error toast appears
- [ ] Error message includes validation details
- [ ] Message mentions missing "name" field
- [ ] Message mentions empty wallTypes
- [ ] No theme is imported

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 5: Import Same File Twice
**Steps:**
1. Import `test-theme-import.json` successfully
2. Import the same file again

**Expected Results:**
- [ ] Second import succeeds
- [ ] New theme is created with different ID
- [ ] Both themes appear in theme selector
- [ ] Second theme becomes active
- [ ] Success toast appears for second import

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 6: Toast Interactions
**Steps:**
1. Import a valid theme
2. Observe the success toast
3. Click the X button on the toast

**Expected Results:**
- [ ] Toast appears in top-right corner
- [ ] Toast has close button (X)
- [ ] Clicking X immediately closes toast
- [ ] Toast auto-closes after 5 seconds if not manually closed
- [ ] Multiple toasts stack vertically

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 7: Import During Loading
**Steps:**
1. Import a valid theme
2. Immediately try to import another theme

**Expected Results:**
- [ ] Loading state is shown
- [ ] Second import waits for first to complete
- [ ] Both imports process successfully
- [ ] Appropriate toasts appear for each

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 8: Backend Server Down
**Steps:**
1. Stop the designer backend server
2. Try to import a valid theme

**Expected Results:**
- [ ] Error toast appears
- [ ] Error message: "Unable to connect to the server..."
- [ ] No theme is imported
- [ ] Application remains functional

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 9: Keyboard Accessibility
**Steps:**
1. Use Tab key to navigate to Import button
2. Press Enter or Space to activate
3. Use keyboard to navigate file picker

**Expected Results:**
- [ ] Import button is keyboard accessible
- [ ] Button has visible focus indicator
- [ ] File picker opens on Enter/Space
- [ ] File picker is keyboard navigable

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

### ✅ Test 10: Import After Theme Editing
**Steps:**
1. Load a theme
2. Make some edits (change colors)
3. Import a new theme without saving

**Expected Results:**
- [ ] Import succeeds
- [ ] New theme becomes active
- [ ] Previous unsaved changes are lost (expected behavior)
- [ ] No error occurs

**Actual Results:**
- [ ] Pass / [ ] Fail
- Notes: _______________

---

## Summary

**Total Tests:** 10
**Passed:** ___
**Failed:** ___
**Pass Rate:** ___%

## Issues Found

1. _______________
2. _______________
3. _______________

## Notes

_______________
_______________
_______________

## Sign-off

**Tested By:** _______________
**Date:** _______________
**Version:** _______________
