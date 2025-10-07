// Basic integration test for Designer Mode
import { themeManager, createDefaultTheme, textureGenerator } from '../src/shared/design-tokens';

console.log('🧪 Running Designer Mode Integration Tests...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => boolean | Promise<boolean>) {
    try {
      const result = typeof fn === 'function' ? fn() : fn;
      const success = result instanceof Promise ? await result : result;
      
      if (success) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error.message}`);
      failed++;
    }
  }

  // Test 1: Theme system initialization
  await test('Theme Manager Initialization', () => {
    const defaultTheme = createDefaultTheme();
    themeManager.registerTheme(defaultTheme);
    return themeManager.getTheme('default') !== null;
  });

  // Test 2: Default theme contains expected wall types
  await test('Default Theme Wall Types', () => {
    const theme = themeManager.getTheme('default');
    if (!theme) return false;
    
    const expectedWallTypes = ['brick', 'wood', 'stone', 'door'];
    return expectedWallTypes.every(type => type in theme.wallTypes);
  });

  // Test 3: Theme validation
  await test('Theme Validation', () => {
    const theme = themeManager.getTheme('default');
    if (!theme) return false;
    
    const validation = themeManager.validateTheme(theme);
    return validation.isValid;
  });

  // Test 4: Token resolution
  await test('Token Resolution', () => {
    const token = themeManager.resolveToken({
      themeId: 'default',
      wallTypeId: 'brick',
      tokenPath: 'colors.primary.value'
    });
    return token !== null && token.value === '#8B4513';
  });

  // Test 5: Texture generation
  await test('Texture Generation', () => {
    try {
      const texture = textureGenerator.generateTexture({
        wallTypeId: 'brick',
        themeId: 'default'
      });
      return texture instanceof HTMLCanvasElement && 
             texture.width === 32 && 
             texture.height === 32;
    } catch {
      return false;
    }
  });

  // Test 6: Multiple wall type textures
  await test('Multiple Wall Type Generation', () => {
    const wallTypes = ['brick', 'wood', 'stone', 'door'];
    try {
      for (const wallType of wallTypes) {
        const texture = textureGenerator.generateTexture({
          wallTypeId: wallType,
          themeId: 'default'
        });
        if (!(texture instanceof HTMLCanvasElement)) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  });

  // Test 7: Color variant application
  await test('Color Variant Application', () => {
    try {
      const baseTexture = textureGenerator.generateTexture({
        wallTypeId: 'brick',
        themeId: 'default'
      });
      const variantTexture = textureGenerator.applyColorVariant(baseTexture, 1);
      return variantTexture instanceof HTMLCanvasElement;
    } catch {
      return false;
    }
  });

  // Test 8: Cache functionality
  await test('Texture Caching', () => {
    const initialCacheSize = textureGenerator.getCacheSize();
    
    // Generate same texture twice
    textureGenerator.generateTexture({ wallTypeId: 'wood', themeId: 'default' });
    textureGenerator.generateTexture({ wallTypeId: 'wood', themeId: 'default' });
    
    const finalCacheSize = textureGenerator.getCacheSize();
    
    // Should only add one entry to cache
    return finalCacheSize === initialCacheSize + 1;
  });

  // Test Results
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Designer Mode is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }

  return failed === 0;
}

// Run tests if this is executed directly
if (typeof window === 'undefined') {
  // Node.js environment - mock DOM elements
  global.HTMLCanvasElement = class MockCanvas {
    width = 32;
    height = 32;
    getContext() {
      return {
        fillStyle: '',
        fillRect: () => {},
        clearRect: () => {},
        createLinearGradient: () => ({
          addColorStop: () => {}
        }),
        createRadialGradient: () => ({
          addColorStop: () => {}
        }),
        getImageData: () => ({ data: new Uint8Array(32 * 32 * 4) }),
        putImageData: () => {},
        drawImage: () => {}
      };
    }
  };

  global.document = {
    createElement: (tag) => {
      if (tag === 'canvas') {
        return new global.HTMLCanvasElement();
      }
      return {};
    }
  };

  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { runTests };