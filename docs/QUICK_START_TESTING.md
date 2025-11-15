# Designer Mode - Quick Start Testing Guide

## 🚀 Get Started in 3 Steps

### Step 1: Verify Everything is Ready

```bash
node verify-designer-workflow.mjs
```

**Expected:** All 85 checks should pass ✅

---

### Step 2: Start Designer Mode

Open two terminals:

**Terminal 1 - Backend:**
```bash
npm run designer:backend
```
Wait for: `Designer Backend running on http://localhost:3004`

**Terminal 2 - Frontend:**
```bash
npm run designer:frontend
```
Wait for: `Local: http://localhost:3002/`

---

### Step 3: Open and Test

1. **Open Browser:** http://localhost:3002/designer.html

2. **Quick Smoke Test:**
   - ✅ Designer loads without errors
   - ✅ Default theme is displayed
   - ✅ Wall types list shows Brick, Wood, Stone, Door
   - ✅ Click on "Brick Wall" - properties appear
   - ✅ Click on a color - color picker opens
   - ✅ Change a color - preview updates
   - ✅ Press Ctrl+S - theme saves

3. **If all above work:** Designer Mode is functional! 🎉

---

## 📋 Full Testing Options

### Option A: Automated Backend Tests

```bash
# Make sure backend is running first!
node test-designer-workflow.mjs
```

Tests all API endpoints and operations.

### Option B: Manual Testing

Follow the comprehensive checklist:
```bash
open DESIGNER_MODE_TESTING_CHECKLIST.md
```

79 test cases covering all features.

### Option C: Complete Testing Guide

For detailed instructions:
```bash
open DESIGNER_MODE_TESTING_GUIDE.md
```

---

## 🔍 What to Test

### Critical Features (Test First)

1. **Theme Loading** - Does it load?
2. **Wall Type Selection** - Can you select wall types?
3. **Color Changes** - Do colors update the preview?
4. **Save** - Does Ctrl+S save changes?
5. **Undo/Redo** - Does Ctrl+Z/Ctrl+Y work?

### Important Features (Test Next)

6. **Dimensions** - Do sliders work?
7. **Effects** - Do toggles work?
8. **New Theme** - Can you create themes?
9. **Export** - Can you export as JSON/CSS?
10. **Import** - Can you import themes?

### Nice to Have (Test Last)

11. **Keyboard Shortcuts** - Press F1 to see all
12. **Responsive** - Resize browser window
13. **Accessibility** - Try keyboard navigation
14. **Error Handling** - Stop backend, try to save

---

## 🐛 Common Issues

### Backend won't start
```bash
# Check if port is in use
lsof -i :3004
# Kill if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Check if port is in use
lsof -i :3002
# Kill if needed
kill -9 <PID>
```

### Theme not loading
```bash
# Check if default theme exists
ls themes/default.json
# If missing, check backups or recreate
```

### CORS errors
- Make sure backend is running on port 3004
- Make sure frontend is running on port 3002
- Check browser console for specific errors

---

## ✅ Success Criteria

Your testing is successful if:

- [ ] Designer loads without errors
- [ ] Can select and edit wall types
- [ ] Colors update preview in real-time
- [ ] Can save changes (Ctrl+S)
- [ ] Can undo/redo (Ctrl+Z/Ctrl+Y)
- [ ] Can create new themes
- [ ] Can export themes
- [ ] Can import themes
- [ ] Keyboard shortcuts work
- [ ] No critical bugs found

---

## 📊 Test Results

After testing, document your results:

**Date:** _______________  
**Tester:** _______________  
**Browser:** _______________  
**OS:** _______________  

**Critical Features:**
- Theme Loading: ⬜ Pass ⬜ Fail
- Wall Type Selection: ⬜ Pass ⬜ Fail
- Color Changes: ⬜ Pass ⬜ Fail
- Save: ⬜ Pass ⬜ Fail
- Undo/Redo: ⬜ Pass ⬜ Fail

**Issues Found:**
1. _______________
2. _______________
3. _______________

**Overall Status:** ⬜ Ready for Production ⬜ Needs Fixes

---

## 📚 More Information

- **Complete Checklist:** `DESIGNER_MODE_TESTING_CHECKLIST.md`
- **Testing Guide:** `DESIGNER_MODE_TESTING_GUIDE.md`
- **Completion Report:** `TASK_28_TESTING_COMPLETION.md`
- **Requirements:** `.kiro/specs/designer-mode-redesign/requirements.md`
- **Design:** `.kiro/specs/designer-mode-redesign/design.md`

---

## 🎯 Next Steps

1. Run verification: `node verify-designer-workflow.mjs`
2. Start services: `npm run designer`
3. Test critical features (5 items above)
4. If all pass: Test important features
5. If all pass: Test nice-to-have features
6. Document any issues
7. Fix critical issues
8. Re-test
9. Mark as production-ready! 🚀

---

**Happy Testing!** 🧪
