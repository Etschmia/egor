#!/usr/bin/env node

/**
 * Test script to verify the editor can load all existing level files
 * 
 * This script:
 * 1. Reads all level files from src/levels/
 * 2. Attempts to parse each file
 * 3. Validates the structure matches GameMap interface
 * 4. Reports any issues found
 */

import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LEVELS_DIR = join(__dirname, '..', 'src', 'levels');

// Required fields in a GameMap
const REQUIRED_FIELDS = [
  'width',
  'height',
  'tiles',
  'enemies',
  'items',
  'wallPictures',
  'decorativeObjects',
  'playerStartX',
  'playerStartY',
  'playerStartDirection'
];

async function testLevelFile(filename) {
  const filePath = join(LEVELS_DIR, filename);
  
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Check if file has the expected export pattern
    const exportMatch = content.match(/export const (\w+): GameMap = ({[\s\S]*});/);
    
    if (!exportMatch) {
      return {
        filename,
        success: false,
        error: 'Could not find GameMap export pattern'
      };
    }
    
    const constantName = exportMatch[1];
    const objectStr = exportMatch[2];
    
    // Create evaluation context with enum types
    const EnemyType = { ZOMBIE: 'ZOMBIE', MONSTER: 'MONSTER', GHOST: 'GHOST', DOG: 'DOG' };
    const ItemType = { 
      HEALTH_SMALL: 'HEALTH_SMALL', 
      HEALTH_LARGE: 'HEALTH_LARGE', 
      TREASURE: 'TREASURE', 
      AMMO: 'AMMO', 
      WEAPON: 'WEAPON' 
    };
    const WallPictureType = { PORTRAIT: 'PORTRAIT', LANDSCAPE: 'LANDSCAPE', ABSTRACT: 'ABSTRACT' };
    const DecorativeObjectType = { 
      CEILING_LIGHT: 'CEILING_LIGHT', 
      VASE: 'VASE', 
      CRATE: 'CRATE', 
      BENCH: 'BENCH', 
      TABLE: 'TABLE', 
      CHAIR: 'CHAIR', 
      WINE_BOTTLE: 'WINE_BOTTLE', 
      SKELETON: 'SKELETON' 
    };
    const WeaponType = {
      KNIFE: 'KNIFE',
      PISTOL: 'PISTOL',
      MACHINE_PISTOL: 'MACHINE_PISTOL',
      CHAINSAW: 'CHAINSAW',
      ASSAULT_RIFLE: 'ASSAULT_RIFLE',
      HEAVY_MG: 'HEAVY_MG'
    };
    
    // Parse the object
    const data = eval(`(${objectStr})`);
    
    // Validate required fields
    const missingFields = REQUIRED_FIELDS.filter(field => data[field] === undefined);
    
    if (missingFields.length > 0) {
      return {
        filename,
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      };
    }
    
    // Validate tiles array dimensions
    if (!Array.isArray(data.tiles) || data.tiles.length !== data.height) {
      return {
        filename,
        success: false,
        error: `Tiles array height mismatch: expected ${data.height}, got ${data.tiles.length}`
      };
    }
    
    for (let i = 0; i < data.tiles.length; i++) {
      if (!Array.isArray(data.tiles[i]) || data.tiles[i].length !== data.width) {
        return {
          filename,
          success: false,
          error: `Tiles array width mismatch at row ${i}: expected ${data.width}, got ${data.tiles[i].length}`
        };
      }
    }
    
    // Validate arrays
    if (!Array.isArray(data.enemies)) {
      return { filename, success: false, error: 'enemies is not an array' };
    }
    if (!Array.isArray(data.items)) {
      return { filename, success: false, error: 'items is not an array' };
    }
    if (!Array.isArray(data.wallPictures)) {
      return { filename, success: false, error: 'wallPictures is not an array' };
    }
    if (!Array.isArray(data.decorativeObjects)) {
      return { filename, success: false, error: 'decorativeObjects is not an array' };
    }
    
    return {
      filename,
      success: true,
      constantName,
      stats: {
        dimensions: `${data.width}x${data.height}`,
        enemies: data.enemies.length,
        items: data.items.length,
        wallPictures: data.wallPictures.length,
        decorativeObjects: data.decorativeObjects.length
      }
    };
    
  } catch (error) {
    return {
      filename,
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('Testing Level Editor compatibility with existing level files...\n');
  
  try {
    const files = await readdir(LEVELS_DIR);
    const levelFiles = files.filter(file => 
      file.endsWith('.ts') && 
      file.startsWith('level') && 
      file !== 'index.ts'
    );
    
    console.log(`Found ${levelFiles.length} level files\n`);
    
    const results = await Promise.all(
      levelFiles.map(filename => testLevelFile(filename))
    );
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    // Print successful results
    if (successful.length > 0) {
      console.log('✓ Successfully parsed files:');
      console.log('─'.repeat(80));
      successful.forEach(result => {
        console.log(`  ${result.filename.padEnd(25)} ${result.constantName.padEnd(20)} ${result.stats.dimensions.padEnd(8)} E:${result.stats.enemies} I:${result.stats.items} W:${result.stats.wallPictures} D:${result.stats.decorativeObjects}`);
      });
      console.log('');
    }
    
    // Print failed results
    if (failed.length > 0) {
      console.log('✗ Failed to parse files:');
      console.log('─'.repeat(80));
      failed.forEach(result => {
        console.log(`  ${result.filename}`);
        console.log(`    Error: ${result.error}`);
      });
      console.log('');
    }
    
    // Summary
    console.log('─'.repeat(80));
    console.log(`Summary: ${successful.length}/${results.length} files passed`);
    
    if (failed.length === 0) {
      console.log('\n✓ All level files are compatible with the editor!');
      process.exit(0);
    } else {
      console.log(`\n✗ ${failed.length} file(s) need attention`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();
