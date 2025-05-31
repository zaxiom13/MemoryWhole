import * as StatisticsModule from './index';

describe('statistics/index.js', () => {
  describe('exports', () => {
    it('exports useStatistics hook', () => {
      expect(StatisticsModule.useStatistics).toBeDefined();
      expect(typeof StatisticsModule.useStatistics).toBe('function');
    });

    it('exports BestTimesPage component', () => {
      expect(StatisticsModule.BestTimesPage).toBeDefined();
      expect(typeof StatisticsModule.BestTimesPage).toBe('function');
    });

    it('exports exactly 2 items', () => {
      const exportedKeys = Object.keys(StatisticsModule);
      expect(exportedKeys).toHaveLength(2);
      expect(exportedKeys).toContain('useStatistics');
      expect(exportedKeys).toContain('BestTimesPage');
    });
  });

  describe('module structure', () => {
    it('maintains consistent export structure', () => {
      expect(StatisticsModule).toEqual({
        useStatistics: expect.any(Function),
        BestTimesPage: expect.any(Function)
      });
    });
  });

  describe('hook availability', () => {
    it('provides access to useStatistics hook', () => {
      const { useStatistics } = StatisticsModule;
      expect(useStatistics).toBeTruthy();
      expect(useStatistics.name).toBe('useStatistics');
    });
  });

  describe('component availability', () => {
    it('provides access to BestTimesPage component', () => {
      const { BestTimesPage } = StatisticsModule;
      expect(BestTimesPage).toBeTruthy();
      expect(BestTimesPage.name).toBe('BestTimesPage');
    });
  });

  describe('integration test', () => {
    it('allows destructuring import pattern', () => {
      const { useStatistics, BestTimesPage } = StatisticsModule;
      
      expect(useStatistics).toBe(StatisticsModule.useStatistics);
      expect(BestTimesPage).toBe(StatisticsModule.BestTimesPage);
    });

    it('supports default import access pattern', () => {
      expect(StatisticsModule.default).toBeUndefined(); // No default export
    });
  });
});