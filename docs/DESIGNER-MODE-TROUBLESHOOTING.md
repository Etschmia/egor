# Designer Mode - Troubleshooting Guide

Common issues and solutions for Designer Mode.

## Table of Contents
- [Startup Issues](#startup-issues)
- [Connection Problems](#connection-problems)
- [Theme Loading Issues](#theme-loading-issues)
- [Preview Problems](#preview-problems)
- [Save/Export Issues](#save-export-issues)
- [Performance Issues](#performance-issues)
- [UI/UX Issues](#uiux-issues)
- [Browser Compatibility](#browser-compatibility)

---

## Startup Issues

### Designer Mode Won't Start

**Symptoms:**
- `npm run designer` fails
- Port already in use error
- Server won't start

**Solutions:**

1. **Check if ports are already in use:**
   ```bash
   # Check port 3002 (frontend)
   lsof -i :3002
   
   # Check port 3003 (backend)
   lsof -i :3003
   ```

2. **Kill processes using the ports:**
   ```bash
   # Kill process on port 3002
   kill -9 $(lsof -t -i:3002)
   
   # Kill process on port 3003
   kill -9 $(lsof -t -i:3003)
   ```

3. **Start frontend and backend separately:**
   ```bash
   # Terminal 1
   npm run designer:frontend
   
   # Terminal 2
   npm run designer:backend
   ```

4. **Check for missing dependencies:**
   ```bash
   npm install
   ```

### "Cannot find module" Error

**Symptoms:**
- Import errors in console
- Module not found errors

**Solutions:**

1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check TypeScript compilation:**
   ```bash
   npm run build
   ```

3. **Verify file paths in imports**

### Vite Configuration Error

**Symptoms:**
- Vite fails to start
- Configuration errors

**Solutions:**

1. **Verify vite.designer.config.ts exists**
2. **Check for syntax errors in config file**
3. **Ensure React plugin is installed:**
   ```bash
   npm install @vitejs/plugin-react --save-dev
   ```

---

## Connection Problems

### Backend API Not Responding

**Symptoms:**
- "Failed to fetch" errors
- Network errors in console
- Themes won't load

**Solutions:**

1. **Verify backend is running:**
   ```bash
   # Should show "Designer Backend running on http://localhost:3003"
   npm run designer:backend
   ```

2. **Check CORS configuration:**
   - Backend should allow requests from `http://localhost:3002`
   - Check `designer-server.mjs` CORS settings

3. **Test API directly:**
   ```bash
   curl http://localhost:3003/api/themes
   ```

4. **Check firewall settings:**
   - Ensure ports 3002 and 3003 are not blocked

### CORS Errors

**Symptoms:**
- "CORS policy" errors in console
- Requests blocked by browser

**Solutions:**

1. **Verify CORS middleware in backend:**
   ```javascript
   app.use(cors({
     origin: 'http://localhost:3002',
     credentials: true
   }));
   ```

2. **Check request origin:**
   - Ensure accessing from `http://localhost:3002`
   - Not `127.0.0.1` or other variations

3. **Restart backend server after changes**

---

## Theme Loading Issues

### Default Theme Not Found

**Symptoms:**
- "Theme not found" error on startup
- Empty theme list

**Solutions:**

1. **Verify themes directory exists:**
   ```bash
   mkdir -p themes/custom-themes
   ```

2. **Check default.json exists:**
   ```bash
   ls -la themes/default.json
   ```

3. **Restore default theme:**
   - Copy from backup or repository
   - Ensure proper JSON format

4. **Check file permissions:**
   ```bash
   chmod 644 themes/default.json
   ```

### Theme Won't Load

**Symptoms:**
- Selected theme doesn't load
- Validation errors
- Corrupted theme data

**Solutions:**

1. **Validate theme JSON:**
   ```bash
   # Use jq or online JSON validator
   cat themes/my-theme.json | jq .
   ```

2. **Check theme structure:**
   - Verify all required fields present
   - Check color format (must be hex)
   - Verify number ranges

3. **Check console for validation errors:**
   - Open browser DevTools
   - Look for specific validation messages

4. **Try loading default theme:**
   - If default works, custom theme has issues
   - Compare structures

### Theme List Empty

**Symptoms:**
- No themes shown in dropdown
- "No themes available" message

**Solutions:**

1. **Check backend logs:**
   - Look for file system errors
   - Check directory permissions

2. **Verify themes directory structure:**
   ```
   themes/
   ├── default.json
   └── custom-themes/
   ```

3. **Check API response:**
   ```bash
   curl http://localhost:3003/api/themes
   ```

---

## Preview Problems

### Preview Not Updating

**Symptoms:**
- Changes don't reflect in preview
- Preview frozen
- Old texture shown

**Solutions:**

1. **Check browser console for errors**

2. **Verify TextureGenerator is working:**
   - Look for generation errors
   - Check performance stats

3. **Clear texture cache:**
   - Refresh page (F5)
   - Hard refresh (Ctrl+Shift+R)

4. **Check debounce timing:**
   - Wait 300ms after change
   - Multiple rapid changes may be debounced

### Preview Shows Error

**Symptoms:**
- "Failed to generate texture" message
- Red error box in preview
- Canvas rendering error

**Solutions:**

1. **Check color values:**
   - Must be valid hex codes
   - Format: #RRGGBB or #RGB

2. **Check dimension values:**
   - Must be within min/max range
   - Must be positive numbers

3. **Verify pattern type:**
   - Must be valid PatternType
   - Check for typos

4. **Check browser canvas support:**
   - Ensure canvas API available
   - Try different browser

### Preview Performance Issues

**Symptoms:**
- Slow preview updates
- Browser lag
- High CPU usage

**Solutions:**

1. **Reduce texture complexity:**
   - Lower intensity values
   - Simplify patterns
   - Reduce dimensions

2. **Check cache status:**
   - Verify cache is working
   - Look at cache hit rate

3. **Close other browser tabs**

4. **Check performance stats:**
   - Generation time should be < 100ms
   - Render time should be < 50ms

---

## Save/Export Issues

### Can't Save Theme

**Symptoms:**
- Save button doesn't work
- "Failed to save" error
- Changes not persisted

**Solutions:**

1. **Check file permissions:**
   ```bash
   # Themes directory must be writable
   chmod 755 themes
   chmod 755 themes/custom-themes
   ```

2. **Verify disk space:**
   ```bash
   df -h
   ```

3. **Check backend logs:**
   - Look for file system errors
   - Check for path issues

4. **Try saving as new theme:**
   - Use "New Theme" instead
   - May be permission issue with existing file

### Export Fails

**Symptoms:**
- Export button doesn't work
- No file downloaded
- Export error message

**Solutions:**

1. **Check browser download settings:**
   - Ensure downloads not blocked
   - Check download location permissions

2. **Try different export format:**
   - If JSON fails, try CSS
   - If CSS fails, try JSON

3. **Check theme validity:**
   - Invalid themes can't be exported
   - Validate before exporting

4. **Check browser console:**
   - Look for JavaScript errors
   - Check for blob creation errors

### Import Fails

**Symptoms:**
- Import doesn't work
- "Invalid theme file" error
- Theme not added to list

**Solutions:**

1. **Verify file format:**
   - Must be valid JSON
   - Check for syntax errors

2. **Validate theme structure:**
   - Must have all required fields
   - Check against theme format spec

3. **Check file size:**
   - Very large files may fail
   - Keep themes under 1MB

4. **Try importing default theme:**
   - Export default theme
   - Try importing it back
   - If works, original file has issues

---

## Performance Issues

### Slow UI Response

**Symptoms:**
- Laggy interface
- Delayed property updates
- Slow typing in inputs

**Solutions:**

1. **Check browser performance:**
   - Open DevTools Performance tab
   - Look for long tasks
   - Check memory usage

2. **Reduce open property groups:**
   - Collapse unused groups
   - Only expand what you need

3. **Clear browser cache:**
   ```
   Ctrl+Shift+Delete
   ```

4. **Restart Designer Mode:**
   - Stop and restart servers
   - Refresh browser

### High Memory Usage

**Symptoms:**
- Browser using lots of RAM
- System slowdown
- Browser warnings

**Solutions:**

1. **Check texture cache size:**
   - Should be max 50 textures
   - Verify LRU eviction working

2. **Reduce history size:**
   - Undo/redo limited to 50 entries
   - Should auto-trim

3. **Close unused tabs**

4. **Restart browser**

### Slow Texture Generation

**Symptoms:**
- Generation time > 200ms
- Preview updates slowly
- Performance stats show high times

**Solutions:**

1. **Reduce texture complexity:**
   - Lower dimensions
   - Reduce intensity
   - Simplify patterns

2. **Check system resources:**
   - CPU usage
   - Available RAM

3. **Update browser:**
   - Newer versions have better canvas performance

4. **Try different pattern:**
   - Some patterns more complex than others

---

## UI/UX Issues

### Sidebar Won't Collapse

**Symptoms:**
- Toggle button doesn't work
- Sidebar stuck open/closed

**Solutions:**

1. **Check browser console for errors**

2. **Try keyboard shortcut:**
   - Ctrl+B to toggle

3. **Refresh page**

4. **Check responsive breakpoints:**
   - May be CSS issue at certain widths

### Property Panel Not Showing

**Symptoms:**
- Right panel empty
- Properties not visible
- No controls shown

**Solutions:**

1. **Select an asset:**
   - Click wall type in sidebar
   - Properties only show when asset selected

2. **Check panel width:**
   - May be collapsed
   - Try resizing window

3. **Verify asset has properties:**
   - Check theme structure
   - Ensure properties defined

### Color Picker Won't Open

**Symptoms:**
- Clicking color preview does nothing
- No dialog appears

**Solutions:**

1. **Check for modal already open:**
   - Close other dialogs first
   - Press Escape

2. **Check browser console for errors**

3. **Try different color property**

4. **Refresh page**

### Keyboard Shortcuts Not Working

**Symptoms:**
- Ctrl+S doesn't save
- Shortcuts ignored

**Solutions:**

1. **Check if in input field:**
   - Shortcuts disabled in inputs
   - Click outside input first

2. **Check browser shortcut conflicts:**
   - Some browsers override shortcuts
   - Use UI buttons instead

3. **Verify focus:**
   - Click in Designer Mode window
   - Ensure window has focus

4. **Check keyboard layout:**
   - Some layouts may have issues

---

## Browser Compatibility

### Supported Browsers

Designer Mode is tested and supported on:
- **Chrome/Edge**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+

### Known Issues

#### Safari
- Canvas performance may be slower
- Some CSS features may differ
- Use Chrome/Firefox for best experience

#### Firefox
- Color picker may look different
- Performance generally good

#### Chrome/Edge
- Best performance
- Full feature support
- Recommended browser

### Browser-Specific Solutions

#### Safari Issues
1. **Enable Developer Mode:**
   - Safari > Preferences > Advanced
   - Check "Show Develop menu"

2. **Clear Website Data:**
   - Develop > Empty Caches

3. **Disable Extensions:**
   - May interfere with Designer Mode

#### Firefox Issues
1. **Check Enhanced Tracking Protection:**
   - May block localhost requests
   - Add exception for localhost

2. **Clear Site Data:**
   - Developer Tools > Storage
   - Clear All

#### Chrome/Edge Issues
1. **Disable Extensions:**
   - Try incognito mode
   - Extensions may interfere

2. **Clear Site Data:**
   - DevTools > Application > Clear Storage

---

## Getting Help

### Before Asking for Help

1. **Check browser console:**
   - Press F12
   - Look for error messages
   - Note exact error text

2. **Check backend logs:**
   - Look at terminal running backend
   - Note any error messages

3. **Try basic troubleshooting:**
   - Refresh page
   - Restart servers
   - Clear cache

4. **Gather information:**
   - Browser version
   - Operating system
   - Node.js version
   - Exact steps to reproduce

### Reporting Issues

When reporting issues, include:

1. **Environment:**
   ```
   - OS: macOS 13.0
   - Browser: Chrome 120
   - Node.js: v18.0.0
   - npm: 9.0.0
   ```

2. **Steps to reproduce:**
   ```
   1. Start Designer Mode
   2. Select brick wall type
   3. Change primary color
   4. Click save
   5. Error appears
   ```

3. **Expected behavior:**
   ```
   Theme should save successfully
   ```

4. **Actual behavior:**
   ```
   "Failed to save theme" error shown
   ```

5. **Console errors:**
   ```
   TypeError: Cannot read property 'value' of undefined
   at saveTheme (Designer.tsx:123)
   ```

6. **Screenshots:**
   - Include relevant screenshots
   - Show error messages
   - Show console output

### Debug Mode

Enable debug mode for more information:

1. **Frontend debug:**
   ```javascript
   // In browser console
   localStorage.setItem('designer-debug', 'true');
   location.reload();
   ```

2. **Backend debug:**
   ```bash
   # Set environment variable
   DEBUG=designer:* npm run designer:backend
   ```

3. **Check debug output:**
   - More verbose logging
   - Detailed error messages
   - Performance metrics

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Theme not found" | Theme file missing | Check themes directory |
| "Invalid theme format" | JSON structure wrong | Validate JSON |
| "Failed to generate texture" | Texture generation error | Check property values |
| "Network error" | Backend not responding | Check backend running |
| "Permission denied" | File system access issue | Check file permissions |
| "Validation failed" | Theme validation error | Check theme structure |

---

## Preventive Measures

### Regular Maintenance

1. **Backup themes regularly:**
   ```bash
   cp -r themes themes-backup-$(date +%Y%m%d)
   ```

2. **Keep dependencies updated:**
   ```bash
   npm update
   ```

3. **Clear cache periodically:**
   - Browser cache
   - Texture cache
   - Node modules cache

### Best Practices

1. **Save frequently:**
   - Use Ctrl+S often
   - Export important themes

2. **Test changes:**
   - Preview before saving
   - Use undo if needed

3. **Validate themes:**
   - Check validation messages
   - Fix issues promptly

4. **Monitor performance:**
   - Watch performance stats
   - Optimize if needed

---

## Related Documentation
- [Designer Mode README](DESIGNER-MODE-README.md)
- [Keyboard Shortcuts](DESIGNER-MODE-KEYBOARD-SHORTCUTS.md)
- [Theme File Format](DESIGNER-MODE-THEME-FORMAT.md)
