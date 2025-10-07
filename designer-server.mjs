import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Paths
const THEMES_DIR = path.join(__dirname, 'themes');
const CUSTOM_THEMES_DIR = path.join(THEMES_DIR, 'custom-themes');
const MIGRATIONS_DIR = path.join(THEMES_DIR, 'migrations');
const BACKUPS_DIR = path.join(__dirname, 'backups');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(THEMES_DIR, { recursive: true });
    await fs.mkdir(CUSTOM_THEMES_DIR, { recursive: true });
    await fs.mkdir(MIGRATIONS_DIR, { recursive: true });
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Helper functions
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', filePath, error);
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing JSON file:', filePath, error);
    return false;
  }
}

async function generateBackupName(themeId) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${themeId}-backup-${timestamp}.json`;
}

// API Routes

// Get all available themes
app.get('/api/themes', async (req, res) => {
  try {
    const themes = [];
    
    // Read default theme
    const defaultThemePath = path.join(THEMES_DIR, 'default.json');
    const defaultTheme = await readJsonFile(defaultThemePath);
    if (defaultTheme) {
      themes.push({
        ...defaultTheme,
        isDefault: true,
        filePath: defaultThemePath
      });
    }

    // Read custom themes
    const customFiles = await fs.readdir(CUSTOM_THEMES_DIR);
    for (const file of customFiles) {
      if (file.endsWith('.json')) {
        const themePath = path.join(CUSTOM_THEMES_DIR, file);
        const theme = await readJsonFile(themePath);
        if (theme) {
          themes.push({
            ...theme,
            isDefault: false,
            filePath: themePath
          });
        }
      }
    }

    res.json({
      success: true,
      themes: themes,
      count: themes.length
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch themes',
      message: error.message
    });
  }
});

// Get specific theme by ID
app.get('/api/themes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let themePath;

    if (id === 'default') {
      themePath = path.join(THEMES_DIR, 'default.json');
    } else {
      themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    }

    const theme = await readJsonFile(themePath);
    if (!theme) {
      return res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
    }

    res.json({
      success: true,
      theme: {
        ...theme,
        isDefault: id === 'default',
        filePath: themePath
      }
    });
  } catch (error) {
    console.error('Error fetching theme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch theme',
      message: error.message
    });
  }
});

// Create new theme
app.post('/api/themes', async (req, res) => {
  try {
    const themeData = req.body;
    
    // Validate theme data
    if (!themeData.id || !themeData.name || !themeData.wallTypes) {
      return res.status(400).json({
        success: false,
        error: 'Invalid theme data',
        message: 'Theme must have id, name, and wallTypes'
      });
    }

    // Add metadata
    themeData.created = new Date().toISOString();
    themeData.modified = new Date().toISOString();

    const themePath = path.join(CUSTOM_THEMES_DIR, `${themeData.id}.json`);
    
    // Check if theme already exists
    try {
      await fs.access(themePath);
      return res.status(409).json({
        success: false,
        error: 'Theme already exists',
        message: `Theme with id '${themeData.id}' already exists`
      });
    } catch {
      // Theme doesn't exist, which is what we want
    }

    const success = await writeJsonFile(themePath, themeData);
    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save theme'
      });
    }

    res.status(201).json({
      success: true,
      theme: themeData,
      message: 'Theme created successfully'
    });
  } catch (error) {
    console.error('Error creating theme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create theme',
      message: error.message
    });
  }
});

// Update existing theme
app.put('/api/themes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const themeData = req.body;

    if (id === 'default') {
      return res.status(403).json({
        success: false,
        error: 'Cannot modify default theme',
        message: 'The default theme is read-only'
      });
    }

    const themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    
    // Check if theme exists
    const existingTheme = await readJsonFile(themePath);
    if (!existingTheme) {
      return res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
    }

    // Create backup before updating
    const backupName = await generateBackupName(id);
    const backupPath = path.join(BACKUPS_DIR, backupName);
    await writeJsonFile(backupPath, existingTheme);

    // Update theme data
    themeData.id = id; // Ensure ID consistency
    themeData.created = existingTheme.created; // Preserve creation date
    themeData.modified = new Date().toISOString(); // Update modification date

    const success = await writeJsonFile(themePath, themeData);
    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update theme'
      });
    }

    res.json({
      success: true,
      theme: themeData,
      backup: backupName,
      message: 'Theme updated successfully'
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update theme',
      message: error.message
    });
  }
});

// Delete theme
app.delete('/api/themes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'default') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete default theme',
        message: 'The default theme cannot be deleted'
      });
    }

    const themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    
    // Check if theme exists
    const existingTheme = await readJsonFile(themePath);
    if (!existingTheme) {
      return res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
    }

    // Create backup before deleting
    const backupName = await generateBackupName(id);
    const backupPath = path.join(BACKUPS_DIR, backupName);
    await writeJsonFile(backupPath, existingTheme);

    // Delete theme file
    await fs.unlink(themePath);

    res.json({
      success: true,
      backup: backupName,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting theme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete theme',
      message: error.message
    });
  }
});

// Generate preview for theme
app.post('/api/themes/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    const { wallTypeId, width = 256, height = 256 } = req.body;

    // This would integrate with the texture generation system
    // For now, return a placeholder response
    res.json({
      success: true,
      preview: {
        wallTypeId,
        width,
        height,
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQV14nGP4/5+hYQAGGwH/a4sZZQAAAABJRU5ErkJggg==',
        timestamp: new Date().toISOString()
      },
      message: 'Preview generated successfully'
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate preview',
      message: error.message
    });
  }
});

// Export theme
app.get('/api/themes/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;

    let themePath;
    if (id === 'default') {
      themePath = path.join(THEMES_DIR, 'default.json');
    } else {
      themePath = path.join(CUSTOM_THEMES_DIR, `${id}.json`);
    }

    const theme = await readJsonFile(themePath);
    if (!theme) {
      return res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
    }

    switch (format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${id}-theme.json"`);
        res.json(theme);
        break;

      case 'css':
        // Generate CSS custom properties from theme
        const css = generateThemeCSS(theme);
        res.setHeader('Content-Type', 'text/css');
        res.setHeader('Content-Disposition', `attachment; filename="${id}-theme.css"`);
        res.send(css);
        break;

      default:
        res.status(400).json({
          success: false,
          error: 'Unsupported export format',
          message: 'Supported formats: json, css'
        });
    }
  } catch (error) {
    console.error('Error exporting theme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export theme',
      message: error.message
    });
  }
});

// Import theme
app.post('/api/themes/import', async (req, res) => {
  try {
    const { themeData, overwrite = false } = req.body;

    // Validate theme data
    if (!themeData || !themeData.id || !themeData.name || !themeData.wallTypes) {
      return res.status(400).json({
        success: false,
        error: 'Invalid theme data',
        message: 'Theme must have id, name, and wallTypes'
      });
    }

    const themePath = path.join(CUSTOM_THEMES_DIR, `${themeData.id}.json`);
    
    // Check if theme already exists
    const exists = await fs.access(themePath).then(() => true).catch(() => false);
    if (exists && !overwrite) {
      return res.status(409).json({
        success: false,
        error: 'Theme already exists',
        message: `Theme with id '${themeData.id}' already exists. Use overwrite=true to replace it.`
      });
    }

    // Update metadata
    if (exists) {
      const existingTheme = await readJsonFile(themePath);
      themeData.created = existingTheme?.created || new Date().toISOString();
    } else {
      themeData.created = new Date().toISOString();
    }
    themeData.modified = new Date().toISOString();

    const success = await writeJsonFile(themePath, themeData);
    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save imported theme'
      });
    }

    res.status(201).json({
      success: true,
      theme: themeData,
      message: exists ? 'Theme imported and updated successfully' : 'Theme imported successfully'
    });
  } catch (error) {
    console.error('Error importing theme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import theme',
      message: error.message
    });
  }
});

// List backups
app.get('/api/backups', async (req, res) => {
  try {
    const files = await fs.readdir(BACKUPS_DIR);
    const backups = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(BACKUPS_DIR, file);
        const stats = await fs.stat(filePath);
        const backup = await readJsonFile(filePath);
        
        backups.push({
          filename: file,
          themeId: backup?.id || 'unknown',
          themeName: backup?.name || 'Unknown Theme',
          created: stats.birthtime.toISOString(),
          size: stats.size
        });
      }
    }

    res.json({
      success: true,
      backups: backups.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()),
      count: backups.length
    });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list backups',
      message: error.message
    });
  }
});

// Restore from backup
app.post('/api/backups/:filename/restore', async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(BACKUPS_DIR, filename);
    
    const backup = await readJsonFile(backupPath);
    if (!backup) {
      return res.status(404).json({
        success: false,
        error: 'Backup not found'
      });
    }

    const themePath = path.join(CUSTOM_THEMES_DIR, `${backup.id}.json`);
    const success = await writeJsonFile(themePath, backup);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore backup'
      });
    }

    res.json({
      success: true,
      theme: backup,
      message: 'Theme restored from backup successfully'
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore backup',
      message: error.message
    });
  }
});

// Utility function to generate CSS from theme
function generateThemeCSS(theme) {
  let css = `/* Theme: ${theme.name} */\n`;
  css += `/* Generated: ${new Date().toISOString()} */\n\n`;
  css += `:root {\n`;

  for (const [wallTypeId, wallType] of Object.entries(theme.wallTypes)) {
    css += `  /* ${wallType.displayName} */\n`;
    
    // Color properties
    for (const [colorKey, colorProp] of Object.entries(wallType.colors)) {
      css += `  --${wallTypeId}-${colorKey}: ${colorProp.value};\n`;
    }
    
    // Dimension properties
    for (const [dimKey, dimProp] of Object.entries(wallType.dimensions)) {
      css += `  --${wallTypeId}-${dimKey}: ${dimProp.value}${dimProp.unit || 'px'};\n`;
    }
    
    css += `\n`;
  }

  css += `}\n`;
  return css;
}

// Start server
async function startServer() {
  await ensureDirectories();
  
  app.listen(PORT, () => {
    console.log(`🎨 Designer server running on http://localhost:${PORT}`);
    console.log(`📁 Themes directory: ${THEMES_DIR}`);
    console.log(`💾 Backups directory: ${BACKUPS_DIR}`);
  });
}

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

startServer().catch(console.error);

export default app;