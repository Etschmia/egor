#!/usr/bin/env node

/**
 * Designer Mode - Workflow Verification Script
 * 
 * This script verifies that the Designer Mode is working correctly
 * by checking all critical components and functionality.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function logCheck(message, passed) {
  const icon = passed ? '✓' : '✗';
  const color = passed ? 'green' : 'red';
  console.log(`  ${colors[color]}${icon} ${message}${colors.reset}`);
}

let checksPassedCount = 0;
let checksFailedCount = 0;

function check(condition, message) {
  if (condition) {
    checksPassedCount++;
    logCheck(message, true);
  } else {
    checksFailedCount++;
    logCheck(message, false);
  }
  return condition;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function verifyFileStructure() {
  logSection('1. File Structure Verification');
  
  const requiredFiles = [
    'designer.html',
    'designer-server.mjs',
    'vite.designer.config.ts',
    'src/designer/main.tsx',
    'src/designer/Designer.tsx',
    'src/designer/types.ts',
    'src/designer/styles.css',
    'themes/default.json'
  ];
  
  for (const file of requiredFiles) {
    const exists = await fileExists(path.join(__dirname, file));
    check(exists, `${file} exists`);
  }
  
  const requiredDirs = [
    'src/designer/components',
    'src/designer/hooks',
    'src/designer/utils',
    'themes/custom-themes'
  ];
  
  for (const dir of requiredDirs) {
    const exists = await fileExists(path.join(__dirname, dir));
    check(exists, `${dir}/ directory exists`);
  }
}

async function verifyComponents() {
  logSection('2. Component Files Verification');
  
  const components = [
    'Header.tsx',
    'AssetTypeSelector.tsx',
    'Sidebar.tsx',
    'PropertyPanel.tsx',
    'LivePreview.tsx',
    'WallTypeList.tsx',
    'PropertyGroup.tsx',
    'ColorPicker.tsx',
    'NumberSlider.tsx',
    'Toast.tsx',
    'KeyboardShortcuts.tsx',
    'LoadingOverlay.tsx',
    'ErrorBoundary.tsx',
    'NewWallTypeDialog.tsx',
    'WallTypeSelector.tsx',
    'PropertyEditor.tsx'
  ];
  
  for (const component of components) {
    const exists = await fileExists(path.join(__dirname, 'src/designer/components', component));
    check(exists, `${component} exists`);
  }
}

async function verifyHooks() {
  logSection('3. Hooks Verification');
  
  const hooks = [
    'useThemeManager.ts',
    'useApiClient.ts',
    'useToast.ts',
    'useKeyboardShortcuts.ts'
  ];
  
  for (const hook of hooks) {
    const exists = await fileExists(path.join(__dirname, 'src/designer/hooks', hook));
    check(exists, `${hook} exists`);
  }
}

async function verifyUtils() {
  logSection('4. Utilities Verification');
  
  const utils = [
    'themeValidator.ts',
    'exportUtils.ts',
    'performanceUtils.ts'
  ];
  
  for (const util of utils) {
    const exists = await fileExists(path.join(__dirname, 'src/designer/utils', util));
    check(exists, `${util} exists`);
  }
}

async function verifyDefaultTheme() {
  logSection('5. Default Theme Verification');
  
  const themePath = path.join(__dirname, 'themes/default.json');
  const exists = await fileExists(themePath);
  
  if (!check(exists, 'default.json exists')) {
    return;
  }
  
  try {
    const content = await fs.readFile(themePath, 'utf-8');
    const theme = JSON.parse(content);
    
    check(theme.id === 'default', 'Theme has correct id');
    check(!!theme.name, 'Theme has name');
    check(!!theme.version, 'Theme has version');
    check(!!theme.wallTypes, 'Theme has wallTypes');
    check(typeof theme.wallTypes === 'object', 'wallTypes is an object');
    
    const wallTypeCount = Object.keys(theme.wallTypes).length;
    check(wallTypeCount > 0, `Theme has ${wallTypeCount} wall types`);
    
    // Verify wall type structure
    const firstWallType = Object.values(theme.wallTypes)[0];
    if (firstWallType) {
      check(!!firstWallType.colors, 'Wall type has colors');
      check(!!firstWallType.dimensions, 'Wall type has dimensions');
      check(!!firstWallType.texture, 'Wall type has texture');
      check(!!firstWallType.effects, 'Wall type has effects');
    }
    
  } catch (error) {
    check(false, `Failed to parse default.json: ${error.message}`);
  }
}

async function verifyPackageJson() {
  logSection('6. Package.json Scripts Verification');
  
  const packagePath = path.join(__dirname, 'package.json');
  const exists = await fileExists(packagePath);
  
  if (!check(exists, 'package.json exists')) {
    return;
  }
  
  try {
    const content = await fs.readFile(packagePath, 'utf-8');
    const pkg = JSON.parse(content);
    
    check(!!pkg.scripts.designer, 'designer script exists');
    check(!!pkg.scripts['designer:frontend'], 'designer:frontend script exists');
    check(!!pkg.scripts['designer:backend'], 'designer:backend script exists');
    
    check(!!pkg.dependencies.react, 'React dependency exists');
    check(!!pkg.dependencies['react-dom'], 'React DOM dependency exists');
    check(!!pkg.devDependencies.express, 'Express dependency exists');
    check(!!pkg.devDependencies.cors, 'CORS dependency exists');
    check(!!pkg.devDependencies.concurrently, 'Concurrently dependency exists');
    
  } catch (error) {
    check(false, `Failed to parse package.json: ${error.message}`);
  }
}

async function verifyViteConfig() {
  logSection('7. Vite Configuration Verification');
  
  const configPath = path.join(__dirname, 'vite.designer.config.ts');
  const exists = await fileExists(configPath);
  
  if (!check(exists, 'vite.designer.config.ts exists')) {
    return;
  }
  
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    
    check(content.includes('3002'), 'Port 3002 configured');
    check(content.includes('designer.html'), 'designer.html entry point configured');
    check(content.includes('@vitejs/plugin-react'), 'React plugin configured');
    
  } catch (error) {
    check(false, `Failed to read vite config: ${error.message}`);
  }
}

async function verifyBackendServer() {
  logSection('8. Backend Server Verification');
  
  const serverPath = path.join(__dirname, 'designer-server.mjs');
  const exists = await fileExists(serverPath);
  
  if (!check(exists, 'designer-server.mjs exists')) {
    return;
  }
  
  try {
    const content = await fs.readFile(serverPath, 'utf-8');
    
    check(content.includes('3004') || content.includes('3003'), 'Backend port configured');
    check(content.includes('/api/themes'), 'Themes API endpoint exists');
    check(content.includes('GET'), 'GET endpoints exist');
    check(content.includes('POST'), 'POST endpoints exist');
    check(content.includes('PUT'), 'PUT endpoints exist');
    check(content.includes('DELETE'), 'DELETE endpoints exist');
    check(content.includes('cors'), 'CORS configured');
    check(content.includes('express'), 'Express configured');
    
  } catch (error) {
    check(false, `Failed to read server file: ${error.message}`);
  }
}

async function verifyDocumentation() {
  logSection('9. Documentation Verification');
  
  const docs = [
    'DESIGNER_MODE_TESTING_CHECKLIST.md',
    'DESIGNER_MODE_TESTING_GUIDE.md',
    'src/designer/ACCESSIBILITY.md',
    'src/designer/PERFORMANCE_OPTIMIZATIONS.md'
  ];
  
  for (const doc of docs) {
    const exists = await fileExists(path.join(__dirname, doc));
    check(exists, `${doc} exists`);
  }
}

async function verifyTestFiles() {
  logSection('10. Test Files Verification');
  
  const testFiles = [
    'src/designer/Designer.test.tsx',
    'test-designer-workflow.mjs',
    'verify-designer-workflow.mjs'
  ];
  
  for (const testFile of testFiles) {
    const exists = await fileExists(path.join(__dirname, testFile));
    check(exists, `${testFile} exists`);
  }
}

async function verifyAssetTypes() {
  logSection('11. Asset Types Verification');
  
  const assetTypes = [
    'wallTypes.tsx',
    'objects.tsx',
    'pictures.tsx',
    'lights.tsx',
    'enemies.tsx',
    'index.ts'
  ];
  
  for (const assetType of assetTypes) {
    const exists = await fileExists(path.join(__dirname, 'src/designer/asset-types', assetType));
    check(exists, `${assetType} exists`);
  }
}

async function verifySharedUtilities() {
  logSection('12. Shared Utilities Verification');
  
  const sharedFiles = [
    'src/shared/design-tokens/ThemeManager.ts',
    'src/shared/design-tokens/defaultTheme.ts',
    'src/shared/design-tokens/types.ts',
    'src/shared/texture-generation/TextureGenerator.ts'
  ];
  
  for (const file of sharedFiles) {
    const exists = await fileExists(path.join(__dirname, file));
    check(exists, `${file} exists`);
  }
}

async function printSummary() {
  logSection('Verification Summary');
  
  const total = checksPassedCount + checksFailedCount;
  const percentage = total > 0 ? Math.round((checksPassedCount / total) * 100) : 0;
  
  log(`Total Checks: ${total}`, 'cyan');
  log(`Passed: ${checksPassedCount}`, 'green');
  log(`Failed: ${checksFailedCount}`, checksFailedCount > 0 ? 'red' : 'green');
  log(`Success Rate: ${percentage}%`, percentage === 100 ? 'green' : 'yellow');
  
  console.log();
  
  if (checksFailedCount === 0) {
    log('✓ All verification checks passed!', 'green');
    log('✓ Designer Mode is ready for testing', 'green');
    console.log();
    log('Next Steps:', 'cyan');
    log('1. Start the backend: npm run designer:backend', 'reset');
    log('2. Start the frontend: npm run designer:frontend', 'reset');
    log('3. Open browser: http://localhost:3002/designer.html', 'reset');
    log('4. Follow the manual testing checklist', 'reset');
  } else {
    log('✗ Some verification checks failed', 'red');
    log('✗ Please fix the issues before testing', 'red');
    console.log();
    log('Review the failed checks above and:', 'yellow');
    log('- Ensure all required files exist', 'reset');
    log('- Check file contents are correct', 'reset');
    log('- Run npm install if dependencies are missing', 'reset');
  }
  
  console.log();
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║     Designer Mode - Workflow Verification                 ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  
  try {
    await verifyFileStructure();
    await verifyComponents();
    await verifyHooks();
    await verifyUtils();
    await verifyDefaultTheme();
    await verifyPackageJson();
    await verifyViteConfig();
    await verifyBackendServer();
    await verifyDocumentation();
    await verifyTestFiles();
    await verifyAssetTypes();
    await verifySharedUtilities();
    await printSummary();
    
    process.exit(checksFailedCount === 0 ? 0 : 1);
  } catch (error) {
    log(`\n✗ Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
