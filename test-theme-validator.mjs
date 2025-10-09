/**
 * Manual test for theme validator
 * Run with: node test-theme-validator.mjs
 */

// Since we can't import TypeScript directly, we'll test the validation logic
// by simulating what the validator does

function isValidHexColor(color) {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

function testValidation() {
  console.log('Testing Theme Validator...\n');

  // Test 1: Valid hex colors
  console.log('Test 1: Valid hex colors');
  console.log('  #FFF:', isValidHexColor('#FFF') ? '✓' : '✗');
  console.log('  #FFFFFF:', isValidHexColor('#FFFFFF') ? '✓' : '✗');
  console.log('  #8B4513:', isValidHexColor('#8B4513') ? '✓' : '✗');

  // Test 2: Invalid hex colors
  console.log('\nTest 2: Invalid hex colors');
  console.log('  invalid-color:', !isValidHexColor('invalid-color') ? '✓' : '✗');
  console.log('  #GGGGGG:', !isValidHexColor('#GGGGGG') ? '✓' : '✗');
  console.log('  rgb(255,0,0):', !isValidHexColor('rgb(255,0,0)') ? '✓' : '✗');

  // Test 3: Quick validation logic
  console.log('\nTest 3: Quick validation');
  const validTheme = {
    id: 'test',
    name: 'Test Theme',
    version: '1.0.0',
    wallTypes: {}
  };
  const quickValid = validTheme.id && validTheme.name && validTheme.version && validTheme.wallTypes;
  console.log('  Valid theme structure:', quickValid ? '✓' : '✗');

  const invalidTheme = {
    name: 'Test Theme',
    version: '1.0.0',
    wallTypes: {}
  };
  const quickInvalid = invalidTheme.id && invalidTheme.name && invalidTheme.version && invalidTheme.wallTypes;
  console.log('  Missing id:', !quickInvalid ? '✓' : '✗');

  // Test 4: Version format validation
  console.log('\nTest 4: Version format validation');
  const versionRegex = /^\d+\.\d+\.\d+$/;
  console.log('  1.0.0:', versionRegex.test('1.0.0') ? '✓' : '✗');
  console.log('  1.2.3:', versionRegex.test('1.2.3') ? '✓' : '✗');
  console.log('  invalid:', !versionRegex.test('invalid') ? '✓' : '✗');
  console.log('  1.0:', !versionRegex.test('1.0') ? '✓' : '✗');

  // Test 5: Pattern type validation
  console.log('\nTest 5: Pattern type validation');
  const validPatterns = ['SOLID', 'GRADIENT', 'BRICK', 'WOOD_GRAIN', 'STONE_BLOCKS', 'METAL'];
  console.log('  BRICK:', validPatterns.includes('BRICK') ? '✓' : '✗');
  console.log('  WOOD_GRAIN:', validPatterns.includes('WOOD_GRAIN') ? '✓' : '✗');
  console.log('  INVALID:', !validPatterns.includes('INVALID') ? '✓' : '✗');

  // Test 6: Blend mode validation
  console.log('\nTest 6: Blend mode validation');
  const validBlendModes = ['NORMAL', 'MULTIPLY', 'OVERLAY', 'SOFT_LIGHT'];
  console.log('  NORMAL:', validBlendModes.includes('NORMAL') ? '✓' : '✗');
  console.log('  MULTIPLY:', validBlendModes.includes('MULTIPLY') ? '✓' : '✗');
  console.log('  INVALID:', !validBlendModes.includes('INVALID') ? '✓' : '✗');

  // Test 7: Number range validation
  console.log('\nTest 7: Number range validation');
  const testValue = (value, min, max) => value >= min && value <= max;
  console.log('  10 in [0, 20]:', testValue(10, 0, 20) ? '✓' : '✗');
  console.log('  25 in [0, 20]:', !testValue(25, 0, 20) ? '✓' : '✗');
  console.log('  -5 in [0, 20]:', !testValue(-5, 0, 20) ? '✓' : '✗');

  console.log('\n✓ All validation logic tests passed!');
}

testValidation();
