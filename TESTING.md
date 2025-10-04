# Testing Guide

## Backward Compatibility Tests

This project includes comprehensive backward compatibility tests to ensure that the maps-and-objects feature doesn't break existing functionality.

### Quick Start

#### Option 1: Browser Tests (Recommended)
```bash
# Start the dev server
npm run dev

# Open in browser
open http://localhost:5173/backward-compatibility-test.html
```

The tests will run automatically when the page loads.

#### Option 2: CLI Tests
```bash
# Run tests in Node.js
node run-compatibility-tests.mjs
```

### What Gets Tested

The backward compatibility test suite validates:

1. **LEVELS Array Compatibility** (Req 10.2, 10.5)
   - All 7 levels have 5 variants
   - First variant accessible for old code
   - Map structure is valid

2. **Map History Persistence** (Req 10.3)
   - History saves to LocalStorage
   - History loads correctly
   - Data persists across sessions

3. **Corrupted Data Handling** (Req 10.4)
   - Invalid JSON handled gracefully
   - Invalid data structures cleaned
   - System never crashes

4. **Old Savegame Compatibility** (Req 10.1)
   - Old savegames load without errors
   - Game state preserved
   - Missing fields handled

5. **Empty History Initialization** (Req 10.3)
   - First-time players handled correctly
   - Random variant selection works
   - No crashes with empty data

6. **Map Variant Selection Logic** (Req 10.2)
   - Unplayed variants prioritized
   - Oldest variant selected when all played
   - Level-specific history tracking

7. **LocalStorage Error Handling** (Req 10.4)
   - Falls back to in-memory storage
   - Game remains playable
   - No unhandled exceptions

### Test Files

- `src/backwardCompatibilityTests.ts` - Test implementation
- `backward-compatibility-test.html` - Browser test runner
- `run-compatibility-tests.mjs` - CLI test runner
- `.kiro/specs/maps-and-objects/backward-compatibility-test-report.md` - Detailed test report

### Expected Results

All tests should pass:
```
✅ Map Structure Validation
✅ Map History Persistence
✅ Corrupted Data Handling
✅ Empty History Initialization
✅ Old Savegame Compatibility
✅ Map Variant Selection Logic
✅ LocalStorage Error Handling

Total: 7 tests
Passed: 7
Failed: 0
Success Rate: 100%
```

### Manual Testing

In addition to automated tests, you should manually verify:

1. **Load an old savegame** - Should work without errors
2. **Play through a level** - Different variant should appear on replay
3. **Check LocalStorage** - History should be saved
4. **Corrupt the history** - Game should handle it gracefully
5. **Disable LocalStorage** - Game should still work

### Troubleshooting

**Tests fail in browser:**
- Check browser console for errors
- Ensure dev server is running
- Try clearing LocalStorage and reloading

**Tests fail in CLI:**
- Ensure Node.js version is 14+
- Check that all dependencies are installed
- Review error messages in console output

**LocalStorage tests fail:**
- Some browsers restrict LocalStorage in certain modes
- Try a different browser or normal browsing mode
- CLI tests use a mock LocalStorage that always works

### CI/CD Integration

To add these tests to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Backward Compatibility Tests
  run: node run-compatibility-tests.mjs
```

The CLI test runner exits with code 0 on success, 1 on failure.

### Adding New Tests

To add a new backward compatibility test:

1. Add test function to `src/backwardCompatibilityTests.ts`
2. Follow the pattern: `export function testYourFeature(): { success: boolean; message: string }`
3. Add to `runAllBackwardCompatibilityTests()` function
4. Update this guide with the new test description

### Support

For issues or questions about testing:
- Check the detailed test report in `.kiro/specs/maps-and-objects/backward-compatibility-test-report.md`
- Review test implementation in `src/backwardCompatibilityTests.ts`
- Check browser console for detailed error messages
