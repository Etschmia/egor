import { inputSystem } from './inputSystem.ts';
import { ActionType, InputProfileType } from './types.ts';

// Mock Browser Environment
const listeners: Record<string, (event: any) => void> = {};

global.window = {
  addEventListener: (type: string, listener: any) => {
    listeners[type] = listener;
  },
  removeEventListener: (type: string) => {
    delete listeners[type];
  }
} as any;

const localStorageMock: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => localStorageMock[key] || null,
  setItem: (key: string, value: string) => {
    localStorageMock[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageMock[key];
  },
  clear: () => {
    for (const key in localStorageMock) delete localStorageMock[key];
  },
  key: () => null,
  length: 0
};

// Test Runner
async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name} - Error: ${(error as Error).message}`);
      failed++;
    }
  }

  console.log('🧪 Running InputSystem Tests...\n');

  // Reset system before tests
  inputSystem.cleanup();
  global.localStorage.clear();
  
  test('Initialize adds event listeners', () => {
    inputSystem.initialize();
    if (!listeners['keydown'] || !listeners['keyup']) {
      throw new Error('Event listeners not added');
    }
  });

  test('Key state tracking', () => {
    const keyDown = listeners['keydown'];
    const keyUp = listeners['keyup'];

    // Simulate pressing 'w'
    keyDown({ key: 'w' } as KeyboardEvent);
    
    if (!inputSystem.isActionActive(ActionType.MOVE_FORWARD)) {
      throw new Error('Action MOVE_FORWARD should be active when "w" is pressed');
    }

    // Simulate releasing 'w'
    keyUp({ key: 'w' } as KeyboardEvent);

    if (inputSystem.isActionActive(ActionType.MOVE_FORWARD)) {
      throw new Error('Action MOVE_FORWARD should NOT be active when "w" is released');
    }
  });

  test('Profile Switching (Classic)', () => {
    inputSystem.setProfile(InputProfileType.CLASSIC);
    
    const keyDown = listeners['keydown'];
    const keyUp = listeners['keyup'];

    // In Classic, 'w' should do nothing for movement
    keyDown({ key: 'w' } as KeyboardEvent);
    if (inputSystem.isActionActive(ActionType.MOVE_FORWARD)) {
      throw new Error('Action MOVE_FORWARD should NOT be active with "w" in Classic mode');
    }
    keyUp({ key: 'w' } as KeyboardEvent);

    // ArrowUp should work
    keyDown({ key: 'ArrowUp' } as KeyboardEvent);
    if (!inputSystem.isActionActive(ActionType.MOVE_FORWARD)) {
      throw new Error('Action MOVE_FORWARD should be active with "ArrowUp" in Classic mode');
    }
    keyUp({ key: 'ArrowUp' } as KeyboardEvent);
  });

  test('Custom Rebinding', () => {
    inputSystem.setProfile(InputProfileType.CUSTOM);
    inputSystem.resetCustomToDefaults();

    // Remap Forward to 'p'
    inputSystem.remapKey(ActionType.MOVE_FORWARD, 'p');

    const keyDown = listeners['keydown'];
    
    keyDown({ key: 'p' } as KeyboardEvent);
    if (!inputSystem.isActionActive(ActionType.MOVE_FORWARD)) {
      throw new Error('Action MOVE_FORWARD should be active with "p" after remapping');
    }
  });

  test('Conflict Resolution (Auto-Overwrite)', () => {
    inputSystem.setProfile(InputProfileType.CUSTOM);
    inputSystem.resetCustomToDefaults();

    // Bind 'w' (default Forward) to Backward
    // This should remove 'w' from Forward
    inputSystem.remapKey(ActionType.MOVE_BACKWARD, 'w');

    const boundKeysForward = inputSystem.getBoundKeys(ActionType.MOVE_FORWARD);
    if (boundKeysForward.includes('w')) {
      throw new Error('Key "w" should have been removed from MOVE_FORWARD');
    }

    const boundKeysBackward = inputSystem.getBoundKeys(ActionType.MOVE_BACKWARD);
    if (!boundKeysBackward.includes('w')) {
      throw new Error('Key "w" should be bound to MOVE_BACKWARD');
    }
  });

  test('Persistence', () => {
    // Save something
    inputSystem.setProfile(InputProfileType.CLASSIC);
    // Check localStorage
    const saved = global.localStorage.getItem('egor_settings');
    if (!saved || !saved.includes('"activeProfileId":"classic"')) {
      throw new Error('Settings not saved to localStorage');
    }

    // Simulate reload
    inputSystem.cleanup(); // Clear state
    
    // Re-init (should load settings)
    inputSystem.initialize();
    const settings = inputSystem.getSettings();
    if (settings.activeProfileId !== InputProfileType.CLASSIC) {
      throw new Error('Settings not loaded correctly');
    }
  });

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) process.exit(1);
}

runTests();




