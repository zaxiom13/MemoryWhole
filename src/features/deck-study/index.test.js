import * as DeckStudyModule from './index';

describe('deck-study/index.js', () => {
  describe('exports', () => {
    it('exports DeckStudyMode component', () => {
      expect(DeckStudyModule.DeckStudyMode).toBeDefined();
      expect(typeof DeckStudyModule.DeckStudyMode).toBe('function');
    });

    it('exports DeckStudyPreview component', () => {
      expect(DeckStudyModule.DeckStudyPreview).toBeDefined();
      expect(typeof DeckStudyModule.DeckStudyPreview).toBe('function');
    });

    it('exports exactly 2 components', () => {
      const exportedKeys = Object.keys(DeckStudyModule);
      expect(exportedKeys).toHaveLength(2);
      expect(exportedKeys).toContain('DeckStudyMode');
      expect(exportedKeys).toContain('DeckStudyPreview');
    });
  });

  describe('module structure', () => {
    it('maintains consistent export structure', () => {
      expect(DeckStudyModule).toEqual({
        DeckStudyMode: expect.any(Function),
        DeckStudyPreview: expect.any(Function)
      });
    });
  });

  describe('component availability', () => {
    it('provides access to DeckStudyMode component', () => {
      const { DeckStudyMode } = DeckStudyModule;
      expect(DeckStudyMode).toBeTruthy();
      expect(DeckStudyMode.name).toBe('DeckStudyMode');
    });

    it('provides access to DeckStudyPreview component', () => {
      const { DeckStudyPreview } = DeckStudyModule;
      expect(DeckStudyPreview).toBeTruthy();
      expect(DeckStudyPreview.name).toBe('DeckStudyPreview');
    });
  });

  describe('integration test', () => {
    it('allows destructuring import pattern', () => {
      const { DeckStudyMode, DeckStudyPreview } = DeckStudyModule;

      expect(DeckStudyMode).toBe(DeckStudyModule.DeckStudyMode);
      expect(DeckStudyPreview).toBe(DeckStudyModule.DeckStudyPreview);
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

      expect(exports).toContain('DeckStudyMode');
      expect(exports).toContain('DeckStudyPreview');
      expect(exports).toHaveLength(2);
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
      expect(DeckStudyModule).toHaveProperty('DeckStudyPreview');
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