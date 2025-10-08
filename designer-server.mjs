import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3004;
const THEMES_DIR = path.join(__dirname, 'themes');
const CUSTOM_THEMES_DIR = path.join(THEMES_DIR, 'custom-themes');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Theme validation utilities
function validateTheme(theme) {
  const errors = [];
  
  if (!theme.name || typeof theme.name !== 'string') {
    errors.push('Theme must have a valid name');
  }
  
  if (!theme.version || typeof theme.version !== 'string') {
    errors.push('Theme must have a valid version');
  }
  
  if (!theme.wallTypes || typeof theme.wallTypes !== 'object') {
    errors.push('Theme must have wallTypes object');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// File system utilities
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    return false;
  }
}

async function safeReadTheme(themePath) {
  try {
    const themeData = await fs.readFile(themePath, 'utf-8');
    return JSON.parse(themeData);
  } catch (error) {
    return null;
  }
}

async function safeWriteTheme(themePath, theme) {
  try {
    // Create backup if file exists
    try {
      await fs.access(themePath);
      const backupPath = `${themePath}.backup`;
      await fs.copyFile(themePath, backupPath);
    } catch {
      // File doesn't exist, no backup needed
    }
    
    await fs.writeFile(themePath, JSON.stringify(theme, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing theme to ${themePath}:`, error);
    return false;
  }
}

function sanitizeThemeId(id) {
  // Prevent path traversal attacks
  return id.replace(/[^a-zA-Z0-9-_]/g, '');
}

function generateCSSFromTheme(theme) {
  let css = `/* Theme: ${theme.name} */\n`;
  css += `/* Version: ${theme.version} */\n`;
  css += `/* Generated: ${new Date().toISOString()} */\n\n`;
  css += `:root {\n`;
  
  if (theme.wallTypes) {
    Object.entries(theme.wallTypes).forEach(([wallTypeId, wallType]) => {
      css += `\n  /* ${wallType.displayName || wallTypeId} */\n`;
      
      if (wallType.colors) {
        Object.entries(wallType.colors).forEach(([colorKey, colorProp]) => {
          const varName = `--wall-${wallTypeId}-${colorKey}`;
          css += `  ${varName}: ${colorProp.value};\n`;
        });
      }
      
      if (wallType.dimensions) {
        Object.entries(wallType.dimensions).forEach(([dimKey, dimProp]) => {
          const varName = `--wall-${wallTypeId}-${dimKey}`;
          const unit = dimProp.unit || '';
          css += `  ${varName}: ${dimProp.value}${unit};\n`;
        });
      }
    });
  }
  
  css += `}\n`;
  return css;
}

// Ensure themes directories exist
try {
  await fs.mkdir(THEMES_DIR, { recursive: true });
  await fs.mkdir(CUSTOM_THEMES_DIR, { recursive: true });
  console.log('✓ Themes directories initialized');
} catch (error) {
  console.error('Error creating themes directories:', error);
}

// GET /api/themes - List all available themes
app.get('/api/themes', async (req, res) => {
  try {
    const themes = [];
    
    // Check for default theme
    const defaultThemePath = path.join(THEMES_DIR, 'default.json');
    try {
      const defaultTheme = JSON.parse(await fs.readFile(defaultThemePath, 'utf-8'));
      themes.push({
        id: 'default',
        name: defaultTheme.name || 'Default Theme',
        version: defaultTheme.version || '1.0.0'
      });
    } catch (error) {
      // Default theme doesn't exist yet
    }
    
    // Check for custom themes
    try {
      const customFiles = await fs.readdir(CUSTOM_THEMES_DIR);
      for (const file of customFiles) {
        if (file.endsWith('.json')) {
          const themePath = path.join(CUSTOM_THEMES_DIR, file);
          const theme = JSON.parse(await fs.readFile(themePath, 'utf-8'));
          themes.push({
            id: theme.id || file.replace('.json', ''),
            name: theme.name || file.replace('.json', ''),
            version: theme.version || '1.0.0'
          });
        }
      }
    } catch (error) {
      // No custom themes yet
    }
    
    res.json({ themes });
  } catch (error) {
    console.error('Error listing themes:', error);
    res.status(500).json({ success: false, error: 'Failed to list themes' });
  }
});

// GET /api/themes/:id - Load a specific theme
app.get('/api/themes/:id', async (req, res) => {
  try {
    const id = sanitizeThemeId(req.params.id);
    let themePath;
    
    if (id === 'default') {
      themePath = path.join(THEMES_DIR, 'default.json');
    } else {
      themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    }
    
    const theme = await safeReadTheme(themePath);
    
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    
    res.json({ success: true, theme });
  } catch (error) {
    console.error(`Error loading theme ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to load theme' });
  }
});

// POST /api/themes - Create a new theme
app.post('/api/themes', async (req, res) => {
  try {
    const { name, basedOn, theme } = req.body;
    
    if (!name || !theme) {
      return res.status(400).json({ success: false, error: 'Name and theme data required' });
    }
    
    // Validate theme structure
    const validation = validateTheme(theme);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid theme structure',
        details: validation.errors 
      });
    }
    
    const themeId = `custom-${Date.now()}`;
    const newTheme = {
      ...theme,
      id: themeId,
      name,
      basedOn: basedOn ? sanitizeThemeId(basedOn) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const themePath = path.join(CUSTOM_THEMES_DIR, `${themeId}.json`);
    const success = await safeWriteTheme(themePath, newTheme);
    
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to write theme file' });
    }
    
    res.json({ success: true, theme: newTheme });
  } catch (error) {
    console.error('Error creating theme:', error);
    res.status(500).json({ success: false, error: 'Failed to create theme' });
  }
});

// PUT /api/themes/:id - Update an existing theme
app.put('/api/themes/:id', async (req, res) => {
  try {
    const id = sanitizeThemeId(req.params.id);
    const { theme } = req.body;
    
    if (id === 'default') {
      return res.status(403).json({ success: false, error: 'Cannot modify default theme' });
    }
    
    if (!theme) {
      return res.status(400).json({ success: false, error: 'Theme data required' });
    }
    
    // Validate theme structure
    const validation = validateTheme(theme);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid theme structure',
        details: validation.errors 
      });
    }
    
    const themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    
    // Check if theme exists
    const existingTheme = await safeReadTheme(themePath);
    if (!existingTheme) {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    
    const updatedTheme = {
      ...theme,
      id,
      createdAt: existingTheme.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    const success = await safeWriteTheme(themePath, updatedTheme);
    
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to write theme file' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(`Error updating theme ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to update theme' });
  }
});

// DELETE /api/themes/:id - Delete a theme (with default protection)
app.delete('/api/themes/:id', async (req, res) => {
  try {
    const id = sanitizeThemeId(req.params.id);
    
    if (id === 'default') {
      return res.status(403).json({ success: false, error: 'Cannot delete default theme' });
    }
    
    const themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    
    // Check if theme exists
    try {
      await fs.access(themePath);
    } catch {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    
    await fs.unlink(themePath);
    
    res.json({ success: true });
  } catch (error) {
    console.error(`Error deleting theme ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to delete theme' });
  }
});

// POST /api/themes/:id/export - Export a theme as JSON or CSS
app.post('/api/themes/:id/export', async (req, res) => {
  try {
    const id = sanitizeThemeId(req.params.id);
    const { format } = req.body;
    
    if (!format || !['json', 'css'].includes(format)) {
      return res.status(400).json({ success: false, error: 'Invalid format. Use "json" or "css"' });
    }
    
    let themePath;
    if (id === 'default') {
      themePath = path.join(THEMES_DIR, 'default.json');
    } else {
      themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    }
    
    const theme = await safeReadTheme(themePath);
    
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    
    if (format === 'json') {
      const filename = `${theme.name.replace(/[^a-zA-Z0-9-_]/g, '-')}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(JSON.stringify(theme, null, 2));
    } else if (format === 'css') {
      const css = generateCSSFromTheme(theme);
      const filename = `${theme.name.replace(/[^a-zA-Z0-9-_]/g, '-')}.css`;
      res.setHeader('Content-Type', 'text/css');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(css);
    }
  } catch (error) {
    console.error(`Error exporting theme ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Failed to export theme' });
  }
});

// POST /api/themes/import - Import a theme from JSON
app.post('/api/themes/import', async (req, res) => {
  try {
    const { theme } = req.body;
    
    if (!theme) {
      return res.status(400).json({ success: false, error: 'Theme data required' });
    }
    
    // Validate theme structure
    const validation = validateTheme(theme);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid theme structure',
        details: validation.errors 
      });
    }
    
    const themeId = `custom-${Date.now()}`;
    const importedTheme = {
      ...theme,
      id: themeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const themePath = path.join(CUSTOM_THEMES_DIR, `${themeId}.json`);
    const success = await safeWriteTheme(themePath, importedTheme);
    
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to write theme file' });
    }
    
    res.json({ success: true, theme: importedTheme });
  } catch (error) {
    console.error('Error importing theme:', error);
    res.status(500).json({ success: false, error: 'Failed to import theme' });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Designer Backend running on http://localhost:${PORT}`);
  console.log(`  Themes directory: ${THEMES_DIR}`);
});
