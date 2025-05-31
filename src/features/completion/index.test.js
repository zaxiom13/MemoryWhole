import * as CompletionModule from './index';

describe('completion/index.js', () => {
  describe('exports', () => {
    it('exports CompletionPage', () => {
      expect(CompletionModule.CompletionPage).toBeDefined();
      expect(typeof CompletionModule.CompletionPage).toBe('function');
    });

    it('exports DeckCompletionPage', () => {
      expect(CompletionModule.DeckCompletionPage).toBeDefined();
      expect(typeof CompletionModule.DeckCompletionPage).toBe('function');
    });

    it('exports exactly 2 components', () => {
      const exportedKeys = Object.keys(CompletionModule);
      expect(exportedKeys).toHaveLength(2);
      expect(exportedKeys).toContain('CompletionPage');
      expect(exportedKeys).toContain('DeckCompletionPage');
    });
  });

  describe('module structure', () => {
    it('maintains consistent export structure', () => {
      expect(CompletionModule).toEqual({
        CompletionPage: expect.any(Function),
        DeckCompletionPage: expect.any(Function)
      });
    });
  });

  describe('component availability', () => {
    it('provides access to CompletionPage component', () => {
      const { CompletionPage } = CompletionModule;
      expect(CompletionPage).toBeTruthy();
      expect(CompletionPage.name).toBe('CompletionPage');
    });

    it('provides access to DeckCompletionPage component', () => {
      const { DeckCompletionPage } = CompletionModule;
      expect(DeckCompletionPage).toBeTruthy();
      expect(DeckCompletionPage.name).toBe('DeckCompletionPage');
    });
  });
});