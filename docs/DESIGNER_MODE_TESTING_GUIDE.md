# Designer Mode Testing Guide

This guide explains how to test the Designer Mode comprehensively.

## Quick Start

### 1. Automated Tests

Run the automated test suite:

```bash
# Run unit tests
npm run test -- src/designer/Designer.test.tsx --run

# Run with coverage
npm run test -- --coverage src/designer/

# Run end-to-end workflow tests
node test-designer-workflow.mjs
```

### 2. Manual Testing

Follow the comprehensive checklist in `DESIGNER_MODE_TESTING_CHECKLIST.md`.

## Test Types

### Unit Tests (`src/designer/Designer.test.tsx`)

Tests individual components and functions:
- Theme management hooks
- Color picker functionality
- Property editors
- Keyboard shortcuts
- Error handling

**Run with:**
```bash
npm run test -- src/designer/Designer.test.tsx --run
```

### Integration Tests (`test-designer-workflow.mjs`)

Tests the complete backend API workflow:
- Theme CRUD operations
- Import/export functionality
- Validation
- Error scenarios
- Performance

**Run with:**
```bash
# Start backend first
npm run designer:backend

# In another terminal
node test-designer-workflow.mjs
```

### Manual Tests (`DESIGNER_MODE_TESTING_CHECKLIST.md`)

Comprehensive manual testing checklist covering:
- UI interactions
- Visual feedback
- Responsive design
- Accessibility
- Cross-browser compatibility

## Testing Workflow

### Step 1: Setup

```bash
# Install dependencies
npm install

# Ensure themes directory exists
mkdir -p themes/custom-themes

# Verify default theme exists
ls themes/default.json
```

### Step 2: Start Services

```bash
# Terminal 1: Backend server
npm run designer:backend

# Terminal 2: Frontend dev server
npm run designer:frontend

# Terminal 3: Run tests
npm run test -- src/designer/ --run
```

### Step 3: Run Automated Tests

```bash
# Unit tests
npm run test -- src/designer/Designer.test.tsx --run

# E2E workflow tests
node test-designer-workflow.mjs

# All designer tests
npm run test -- src/designer/ --run
```

### Step 4: Manual Testing

1. Open browser to `http://localhost:3002/designer.html`
2. Follow checklist in `DESIGNER_MODE_TESTING_CHECKLIST.md`
3. Test each feature systematically
4. Document any issues found

### Step 5: Performance Testing

```bash
# Run performance tests
npm run test -- src/designer/utils/performanceUtils.ts --run

# Monitor in browser
# 1. Open DevTools
# 2. Go to Performance tab
# 3. Record while using designer
# 4. Check for bottlenecks
```

### Step 6: Accessibility Testing

```bash
# Open accessibility test page
open src/designer/accessibility-test.html

# Or use browser tools
# 1. Open DevTools
# 2. Go to Lighthouse tab
# 3. Run accessibility audit
```

## Test Coverage Goals

- **Unit Tests:** > 80% coverage
- **Integration Tests:** All API endpoints
- **Manual Tests:** All user workflows
- **Accessibility:** WCAG AA compliance
- **Performance:** < 2s initial load, < 100ms updates

## Common Issues and Solutions

### Issue: Backend not starting

**Solution:**
```bash
# Check if port 3003 is in use
lsof -i :3003

# Kill process if needed
kill -9 <PID>

# Restart backend
npm run designer:backend
```

### Issue: Tests failing due to missing dependencies

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Theme files not found

**Solution:**
```bash
# Ensure themes directory exists
mkdir -p themes/custom-themes

# Copy default theme if missing
cp themes/default.json.backup themes/default.json
```

### Issue: CORS errors in tests

**Solution:**
- Ensure backend is running on port 3003
- Check CORS configuration in `designer-server.mjs`
- Verify frontend is on port 3002

### Issue: Tests timing out

**Solution:**
```bash
# Increase timeout in test config
npm run test -- --testTimeout=10000 src/designer/
```

## Test Data

### Sample Theme for Testing

Create `test-theme.json`:

```json
{
  "id": "test-theme",
  "name": "Test Theme",
  "version": "1.0.0",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "wallTypes": {
    "brick": {
      "id": "brick",
      "displayName": "Test Brick",
      "description": "Test brick wall",
      "colors": {
        "primary": {
          "value": "#FF0000",
          "displayName": "Primary Color"
        },
        "secondary": {
          "value": "#00FF00",
          "displayName": "Secondary Color"
        }
      },
      "dimensions": {
        "width": {
          "value": 64,
          "min": 32,
          "max": 128,
          "step": 1
        },
        "height": {
          "value": 64,
          "min": 32,
          "max": 128,
          "step": 1
        }
      },
      "texture": {
        "pattern": "BRICK",
        "intensity": {
          "value": 0.8,
          "min": 0,
          "max": 1,
          "step": 0.1
        },
        "blendMode": "NORMAL",
        "procedural": true
      },
      "effects": {
        "shadow": {
          "enabled": true,
          "color": {
            "value": "#000000",
            "displayName": "Shadow Color"
          },
          "offset": {
            "value": 2,
            "min": 0,
            "max": 10,
            "step": 1
          },
          "blur": {
            "value": 4,
            "min": 0,
            "max": 20,
            "step": 1
          }
        },
        "highlight": {
          "enabled": false,
          "color": {
            "value": "#FFFFFF",
            "displayName": "Highlight Color"
          },
          "intensity": {
            "value": 0.5,
            "min": 0,
            "max": 1,
            "step": 0.1
          }
        }
      },
      "legacyMapping": {}
    }
  }
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Designer Mode Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run unit tests
      run: npm run test -- src/designer/ --run
    
    - name: Start backend
      run: npm run designer:backend &
      
    - name: Wait for backend
      run: sleep 5
    
    - name: Run E2E tests
      run: node test-designer-workflow.mjs
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
```

## Performance Benchmarks

Expected performance metrics:

| Metric | Target | Acceptable |
|--------|--------|------------|
| Initial Load | < 1s | < 2s |
| Theme Switch | < 500ms | < 1s |
| Color Change | < 100ms | < 200ms |
| Preview Update | < 100ms | < 200ms |
| Save Operation | < 500ms | < 1s |
| Export | < 1s | < 2s |
| Import | < 1s | < 2s |

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader compatible
- [ ] No keyboard traps
- [ ] Logical tab order

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Reporting Issues

When reporting issues, include:

1. **Environment:**
   - OS and version
   - Browser and version
   - Node.js version
   - Screen size

2. **Steps to Reproduce:**
   - Detailed step-by-step instructions
   - Expected behavior
   - Actual behavior

3. **Evidence:**
   - Screenshots or video
   - Console errors
   - Network logs

4. **Severity:**
   - Critical: Blocks core functionality
   - High: Major feature broken
   - Medium: Minor feature issue
   - Low: Cosmetic issue

## Next Steps

After completing all tests:

1. Review test results
2. Document any issues found
3. Fix critical and high-priority issues
4. Re-test after fixes
5. Update documentation
6. Mark task as complete

## Resources

- [Testing Library Docs](https://testing-library.com/)
- [Vitest Docs](https://vitest.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance](https://web.dev/performance/)

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
