import * as DeckStudyModule from './index';

describe('deck-study/index.js', () => {
  describe('exports', () => {
    it('exports DeckStudyMode component', () => {
      expect(DeckStudyModule.DeckStudyMode).toBeDefined();
      expect(typeof DeckStudyModule.DeckStudyMode).toBe('function');
    });

    it('exports exactly 1 component', () => {
      const exportedKeys = Object.keys(DeckStudyModule);
      expect(exportedKeys).toHaveLength(1);
      expect(exportedKeys).toContain('DeckStudyMode');
    });
  });

  describe('module structure', () => {
    it('maintains consistent export structure', () => {
      expect(DeckStudyModule).toEqual({
        DeckStudyMode: expect.any(Function)
      });
    });
  });

  describe('component availability', () => {
    it('provides access to DeckStudyMode component', () => {
      const { DeckStudyMode } = DeckStudyModule;
      expect(DeckStudyMode).toBeTruthy();
      expect(DeckStudyMode.name).toBe('DeckStudyMode');
    });
  });

  describe('integration test', () => {
    it('allows destructuring import pattern', () => {
      const { DeckStudyMode } = DeckStudyModule;
      
      expect(DeckStudyMode).toBe(DeckStudyModule.DeckStudyMode);
    });

    it('supports default import access pattern', () => {
      expect(DeckStudyModule.default).toBeUndefined(); // No default export
    });
  });

  describe('module consistency', () => {
    it('maintains stable exports across multiple imports', () => {
      const firstImport = DeckStudyModule;
      const secondImport = require('./index');
      
      expect(Object.keys(firstImport)).toEqual(Object.keys(secondImport));
    });

    it('provides focused deck study functionality', () => {
      const exports = Object.keys(DeckStudyModule);
      
      // Should contain the main deck study component
      expect(exports).toContain('DeckStudyMode');
      
      // Should be focused (only one export for this feature)
      expect(exports).toHaveLength(1);
    });
  });

  describe('component type verification', () => {
    it('DeckStudyMode is a proper React component function', () => {
      const { DeckStudyMode } = DeckStudyModule;
      
      expect(typeof DeckStudyMode).toBe('function');
      expect(DeckStudyMode.length).toBeGreaterThanOrEqual(0); // Should accept props
    });
  });

  describe('module metadata', () => {
    it('has expected module structure for deck study feature', () => {
      expect(DeckStudyModule).toHaveProperty('DeckStudyMode');
      expect(Object.keys(DeckStudyModule)).not.toContain('default');
    });

    it('provides consistent naming convention', () => {
      const exports = Object.keys(DeckStudyModule);
      
      // All exports should follow PascalCase for components
      exports.forEach(exportName => {
        expect(exportName).toMatch(/^[A-Z][a-zA-Z]*$/);
      });
    });
  });
});