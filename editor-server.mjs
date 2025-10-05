import express from 'express';
import cors from 'cors';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const LEVELS_DIR = resolve(__dirname, 'src/levels');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Security: Validate that path is within src/levels directory
function isPathSafe(requestedPath) {
  const normalizedPath = resolve(requestedPath);
  const relativePath = relative(LEVELS_DIR, normalizedPath);
  return !relativePath.startsWith('..') && !relativePath.includes('..');
}

// Ensure levels directory exists
async function ensureLevelsDir() {
  if (!existsSync(LEVELS_DIR)) {
    await mkdir(LEVELS_DIR, { recursive: true });
  }
}

// Parse level filename to extract level and variant numbers
function parseFilename(filename) {
  const match = filename.match(/^level(\d+)-variant(\d+)\.ts$/);
  if (match) {
    return {
      level: parseInt(match[1], 10),
      variant: parseInt(match[2], 10)
    };
  }
  return null;
}

// Generate TypeScript code for a level file
function generateLevelCode(filename, mapData) {
  const parsed = parseFilename(filename);
  if (!parsed) {
    throw new Error('Invalid filename format. Expected: levelX-variantY.ts');
  }

  const { level, variant } = parsed;
  const constantName = `LEVEL_${level}_VARIANT_${variant}`;

  // Format tiles array
  const tilesStr = mapData.tiles.map(row => 
    `    [${row.join(',')}]`
  ).join(',\n');

  // Format enemies array
  const enemiesStr = mapData.enemies.map(enemy => {
    return `    {
      id: '${enemy.id}',
      type: EnemyType.${enemy.type},
      x: ${enemy.x},
      y: ${enemy.y},
      health: ${enemy.health},
      maxHealth: ${enemy.maxHealth},
      damage: ${enemy.damage},
      speed: ${enemy.speed},
      state: '${enemy.state}',
      isAlive: ${enemy.isAlive !== undefined ? enemy.isAlive : true},
      direction: ${enemy.direction},
      lastAttackTime: ${enemy.lastAttackTime},
      attackCooldown: ${enemy.attackCooldown}
    }`;
  }).join(',\n');

  // Format items array
  const itemsStr = mapData.items.map(item => {
    let itemObj = `    {
      id: '${item.id}',
      type: ItemType.${item.type},
      x: ${item.x},
      y: ${item.y},
      collected: ${item.collected}`;
    
    if (item.value !== undefined) {
      itemObj += `,\n      value: ${item.value}`;
    }
    if (item.weaponType !== undefined) {
      itemObj += `,\n      weaponType: WeaponType.${item.weaponType}`;
    }
    
    itemObj += '\n    }';
    return itemObj;
  }).join(',\n');

  // Format wall pictures array
  const wallPicturesStr = mapData.wallPictures.map(wp => {
    return `    { id: '${wp.id}', x: ${wp.x}, y: ${wp.y}, side: ${wp.side}, offset: ${wp.offset}, type: WallPictureType.${wp.type} }`;
  }).join(',\n');

  // Format decorative objects array
  const decorativeObjectsStr = mapData.decorativeObjects.map(obj => {
    let objStr = `    { id: '${obj.id}', type: DecorativeObjectType.${obj.type}, x: ${obj.x}, y: ${obj.y}, colorVariant: ${obj.colorVariant}, collisionRadius: ${obj.collisionRadius}`;
    
    if (obj.renderHeight !== undefined) {
      objStr += `, renderHeight: ${obj.renderHeight}`;
    }
    if (obj.parentId !== undefined) {
      objStr += `, parentId: '${obj.parentId}'`;
    }
    
    objStr += ' }';
    return objStr;
  }).join(',\n');

  // Generate the complete file content
  const code = `import { type GameMap, EnemyType, ItemType, WallPictureType, DecorativeObjectType, WeaponType } from '../types.ts';

export const ${constantName}: GameMap = {
  width: ${mapData.width},
  height: ${mapData.height},
  tiles: [
${tilesStr}
  ],
  enemies: [
${enemiesStr}
  ],
  items: [
${itemsStr}
  ],
  wallPictures: [
${wallPicturesStr}
  ],
  decorativeObjects: [
${decorativeObjectsStr}
  ],
  playerStartX: ${mapData.playerStartX},
  playerStartY: ${mapData.playerStartY},
  playerStartDirection: ${mapData.playerStartDirection}
};
`;

  return code;
}

// GET /api/levels - List all level files
app.get('/api/levels', async (req, res) => {
  try {
    await ensureLevelsDir();
    
    const files = await readdir(LEVELS_DIR);
    const levelFiles = files
      .filter(file => file.endsWith('.ts') && file.startsWith('level'))
      .map(filename => {
        const parsed = parseFilename(filename);
        return {
          filename,
          level: parsed?.level || 0,
          variant: parsed?.variant || 0
        };
      })
      .filter(file => file.level > 0 && file.variant > 0)
      .sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.variant - b.variant;
      });

    res.json({ success: true, levels: levelFiles });
  } catch (error) {
    console.error('Error listing levels:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list level files',
      message: error.message 
    });
  }
});

// GET /api/levels/:filename - Read a specific level file
app.get('/api/levels/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename format
    if (!parseFilename(filename)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid filename format. Expected: levelX-variantY.ts' 
      });
    }

    const filePath = join(LEVELS_DIR, filename);
    
    // Security check
    if (!isPathSafe(filePath)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied: Path outside of levels directory' 
      });
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Level file not found' 
      });
    }

    const content = await readFile(filePath, 'utf-8');
    
    // Parse the TypeScript file to extract the GameMap object
    // This is a simplified parser - it looks for the exported constant
    const match = content.match(/export const \w+: GameMap = ({[\s\S]*});/);
    
    if (!match) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to parse level file format' 
      });
    }

    // Use eval to parse the object (in a controlled environment)
    // Note: This is safe here because we're only reading our own generated files
    const objectStr = match[1];
    
    // Create a safe evaluation context with the enum types
    const EnemyType = { ZOMBIE: 'ZOMBIE', MONSTER: 'MONSTER', GHOST: 'GHOST', DOG: 'DOG' };
    const ItemType = { HEALTH_SMALL: 'HEALTH_SMALL', HEALTH_LARGE: 'HEALTH_LARGE', TREASURE: 'TREASURE', AMMO: 'AMMO', WEAPON: 'WEAPON' };
    const WallPictureType = { PORTRAIT: 'PORTRAIT', LANDSCAPE: 'LANDSCAPE', ABSTRACT: 'ABSTRACT' };
    const DecorativeObjectType = { 
      CEILING_LIGHT: 'CEILING_LIGHT', VASE: 'VASE', CRATE: 'CRATE', BENCH: 'BENCH', 
      TABLE: 'TABLE', CHAIR: 'CHAIR', WINE_BOTTLE: 'WINE_BOTTLE', SKELETON: 'SKELETON' 
    };
    const WeaponType = {
      KNIFE: 'KNIFE', PISTOL: 'PISTOL', MACHINE_PISTOL: 'MACHINE_PISTOL',
      CHAINSAW: 'CHAINSAW', ASSAULT_RIFLE: 'ASSAULT_RIFLE', HEAVY_MG: 'HEAVY_MG'
    };
    
    const data = eval(`(${objectStr})`);
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error reading level file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to read level file',
      message: error.message 
    });
  }
});

// POST /api/levels - Save or create a level file
app.post('/api/levels', async (req, res) => {
  try {
    const { filename, data } = req.body;
    
    // Validate request body
    if (!filename || !data) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: filename and data' 
      });
    }

    // Validate filename format
    if (!parseFilename(filename)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid filename format. Expected: levelX-variantY.ts' 
      });
    }

    // Validate map data structure
    const requiredFields = ['width', 'height', 'tiles', 'enemies', 'items', 'wallPictures', 'decorativeObjects', 'playerStartX', 'playerStartY', 'playerStartDirection'];
    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: `Missing required field in map data: ${field}` 
        });
      }
    }

    // Validate tiles array dimensions
    if (!Array.isArray(data.tiles) || data.tiles.length !== data.height) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid tiles array: height mismatch' 
      });
    }
    
    for (const row of data.tiles) {
      if (!Array.isArray(row) || row.length !== data.width) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid tiles array: width mismatch' 
        });
      }
    }

    const filePath = join(LEVELS_DIR, filename);
    
    // Security check
    if (!isPathSafe(filePath)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied: Path outside of levels directory' 
      });
    }

    await ensureLevelsDir();

    // Generate TypeScript code
    const code = generateLevelCode(filename, data);
    
    // Write file
    await writeFile(filePath, code, 'utf-8');
    
    res.json({ 
      success: true, 
      message: `Level file ${filename} saved successfully` 
    });
  } catch (error) {
    console.error('Error saving level file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save level file',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Level Editor API server running on http://localhost:${PORT}`);
  console.log(`Serving level files from: ${LEVELS_DIR}`);
});
