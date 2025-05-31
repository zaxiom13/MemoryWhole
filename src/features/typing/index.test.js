import * as TypingModule from './index';

describe('typing/index.js', () => {
  describe('exports', () => {
    it('exports useTyping hook', () => {
      expect(TypingModule.useTyping).toBeDefined();
      expect(typeof TypingModule.useTyping).toBe('function');
    });

    it('exports ReferenceConfirmation component', () => {
      expect(TypingModule.ReferenceConfirmation).toBeDefined();
      expect(typeof TypingModule.ReferenceConfirmation).toBe('function');
    });

    it('exports ReferenceTyping component', () => {
      expect(TypingModule.ReferenceTyping).toBeDefined();
      expect(typeof TypingModule.ReferenceTyping).toBe('function');
    });

    it('exports useReferenceTypingUI hook', () => {
      expect(TypingModule.useReferenceTypingUI).toBeDefined();
      expect(typeof TypingModule.useReferenceTypingUI).toBe('function');
    });

    it('exports exactly 4 items', () => {
      const exportedKeys = Object.keys(TypingModule);
      expect(exportedKeys).toHaveLength(4);
      expect(exportedKeys).toContain('useTyping');
      expect(exportedKeys).toContain('ReferenceConfirmation');
      expect(exportedKeys).toContain('ReferenceTyping');
      expect(exportedKeys).toContain('useReferenceTypingUI');
    });
  });

  describe('module structure', () => {
    it('maintains consistent export structure', () => {
      expect(TypingModule).toEqual({
        useTyping: expect.any(Function),
        ReferenceConfirmation: expect.any(Function),
        ReferenceTyping: expect.any(Function),
        useReferenceTypingUI: expect.any(Function)
      });
    });
  });

  describe('hook availability', () => {
    it('provides access to useTyping hook', () => {
      const { useTyping } = TypingModule;
      expect(useTyping).toBeTruthy();
      expect(useTyping.name).toBe('useTyping');
    });

    it('provides access to useReferenceTypingUI hook', () => {
      const { useReferenceTypingUI } = TypingModule;
      expect(useReferenceTypingUI).toBeTruthy();
      expect(useReferenceTypingUI.name).toBe('useReferenceTypingUI');
    });
  });

  describe('component availability', () => {
    it('provides access to ReferenceConfirmation component', () => {
      const { ReferenceConfirmation } = TypingModule;
      expect(ReferenceConfirmation).toBeTruthy();
      expect(ReferenceConfirmation.name).toBe('ReferenceConfirmation');
    });

    it('provides access to ReferenceTyping component', () => {
      const { ReferenceTyping } = TypingModule;
      expect(ReferenceTyping).toBeTruthy();
      expect(ReferenceTyping.name).toBe('ReferenceTyping');
    });
  });

  describe('integration test', () => {
    it('allows destructuring import pattern', () => {
      const { useTyping, ReferenceConfirmation, ReferenceTyping, useReferenceTypingUI } = TypingModule;
      
      expect(useTyping).toBe(TypingModule.useTyping);
      expect(ReferenceConfirmation).toBe(TypingModule.ReferenceConfirmation);
      expect(ReferenceTyping).toBe(TypingModule.ReferenceTyping);
      expect(useReferenceTypingUI).toBe(TypingModule.useReferenceTypingUI);
    });

    it('supports default import access pattern', () => {
      expect(TypingModule.default).toBeUndefined(); // No default export
    });
  });

  describe('module consistency', () => {
    it('maintains stable exports across multiple imports', () => {
      const firstImport = TypingModule;
      const secondImport = require('./index');
      
      expect(Object.keys(firstImport)).toEqual(Object.keys(secondImport));
    });

    it('provides all expected typing-related exports', () => {
      const exports = Object.keys(TypingModule);
      
      // Should contain main typing hook
      expect(exports).toContain('useTyping');
      
      // Should contain UI-related hook
      expect(exports).toContain('useReferenceTypingUI');
      
      // Should contain main typing components
      expect(exports).toContain('ReferenceConfirmation');
      expect(exports).toContain('ReferenceTyping');
    });
  });
});