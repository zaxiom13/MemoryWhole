import * as RoutesModule from './index';

describe('routes/index.js', () => {
  describe('exports', () => {
    it('exports HomeRoute component', () => {
      expect(RoutesModule.HomeRoute).toBeDefined();
      expect(typeof RoutesModule.HomeRoute).toBe('function');
    });

    it('exports TutorialRoute component', () => {
      expect(RoutesModule.TutorialRoute).toBeDefined();
      expect(typeof RoutesModule.TutorialRoute).toBe('function');
    });

    it('exports ReferenceConfirmationRoute component', () => {
      expect(RoutesModule.ReferenceConfirmationRoute).toBeDefined();
      expect(typeof RoutesModule.ReferenceConfirmationRoute).toBe('function');
    });

    it('exports ReferenceTypingRoute component', () => {
      expect(RoutesModule.ReferenceTypingRoute).toBeDefined();
      expect(typeof RoutesModule.ReferenceTypingRoute).toBe('function');
    });

    it('exports DeckStudyRoute component', () => {
      expect(RoutesModule.DeckStudyRoute).toBeDefined();
      expect(typeof RoutesModule.DeckStudyRoute).toBe('function');
    });

    it('exports DeckStudyPreviewRoute component', () => {
      expect(RoutesModule.DeckStudyPreviewRoute).toBeDefined();
      expect(typeof RoutesModule.DeckStudyPreviewRoute).toBe('function');
    });

    it('exports BestTimesRoute component', () => {
      expect(RoutesModule.BestTimesRoute).toBeDefined();
      expect(typeof RoutesModule.BestTimesRoute).toBe('function');
    });

    it('exports CompletionRoute component', () => {
      expect(RoutesModule.CompletionRoute).toBeDefined();
      expect(typeof RoutesModule.CompletionRoute).toBe('function');
    });

    it('exports DeckCompletionRoute component', () => {
      expect(RoutesModule.DeckCompletionRoute).toBeDefined();
      expect(typeof RoutesModule.DeckCompletionRoute).toBe('function');
    });

    it('exports exactly 9 route components', () => {
      const exportedKeys = Object.keys(RoutesModule);
      expect(exportedKeys).toHaveLength(9);
      
      const expectedRoutes = [
        'HomeRoute',
        'TutorialRoute', 
        'ReferenceConfirmationRoute',
        'ReferenceTypingRoute',
        'DeckStudyRoute',
        'DeckStudyPreviewRoute',
        'BestTimesRoute',
        'CompletionRoute',
        'DeckCompletionRoute'
      ];
      
      expectedRoutes.forEach(route => {
        expect(exportedKeys).toContain(route);
      });
    });
  });

  describe('module structure', () => {
    it('maintains consistent export structure', () => {
      const expectedStructure = {
        HomeRoute: expect.any(Function),
        TutorialRoute: expect.any(Function),
        ReferenceConfirmationRoute: expect.any(Function),
        ReferenceTypingRoute: expect.any(Function),
        DeckStudyRoute: expect.any(Function),
        DeckStudyPreviewRoute: expect.any(Function),
        BestTimesRoute: expect.any(Function),
        CompletionRoute: expect.any(Function),
        DeckCompletionRoute: expect.any(Function)
      };
      
      expect(RoutesModule).toEqual(expectedStructure);
    });
  });

  describe('route component availability', () => {
    it('provides access to main navigation routes', () => {
      expect(RoutesModule.HomeRoute).toBeTruthy();
      expect(RoutesModule.TutorialRoute).toBeTruthy();
      expect(RoutesModule.BestTimesRoute).toBeTruthy();
    });

    it('provides access to typing workflow routes', () => {
      expect(RoutesModule.ReferenceConfirmationRoute).toBeTruthy();
      expect(RoutesModule.ReferenceTypingRoute).toBeTruthy();
      expect(RoutesModule.CompletionRoute).toBeTruthy();
    });

    it('provides access to deck study routes', () => {
      expect(RoutesModule.DeckStudyRoute).toBeTruthy();
      expect(RoutesModule.DeckStudyPreviewRoute).toBeTruthy();
      expect(RoutesModule.DeckCompletionRoute).toBeTruthy();
    });
  });

  describe('integration test', () => {
    it('allows destructuring import pattern', () => {
      const {
        HomeRoute,
        TutorialRoute,
        ReferenceConfirmationRoute,
        ReferenceTypingRoute,
        DeckStudyRoute,
        DeckStudyPreviewRoute,
        BestTimesRoute,
        CompletionRoute,
        DeckCompletionRoute
      } = RoutesModule;
      
      expect(HomeRoute).toBe(RoutesModule.HomeRoute);
      expect(TutorialRoute).toBe(RoutesModule.TutorialRoute);
      expect(ReferenceConfirmationRoute).toBe(RoutesModule.ReferenceConfirmationRoute);
      expect(ReferenceTypingRoute).toBe(RoutesModule.ReferenceTypingRoute);
      expect(DeckStudyRoute).toBe(RoutesModule.DeckStudyRoute);
      expect(DeckStudyPreviewRoute).toBe(RoutesModule.DeckStudyPreviewRoute);
      expect(BestTimesRoute).toBe(RoutesModule.BestTimesRoute);
      expect(CompletionRoute).toBe(RoutesModule.CompletionRoute);
      expect(DeckCompletionRoute).toBe(RoutesModule.DeckCompletionRoute);
    });

    it('supports default import access pattern', () => {
      expect(RoutesModule.default).toBeUndefined(); // No default export
    });
  });

  describe('module consistency', () => {
    it('maintains stable exports across multiple imports', () => {
      const firstImport = RoutesModule;
      const secondImport = require('./index');
      
      expect(Object.keys(firstImport)).toEqual(Object.keys(secondImport));
    });

    it('provides comprehensive route coverage', () => {
      const exports = Object.keys(RoutesModule);
      
      // Core routes
      expect(exports).toContain('HomeRoute');
      expect(exports).toContain('TutorialRoute');
      
      // Typing workflow
      expect(exports).toContain('ReferenceConfirmationRoute');
      expect(exports).toContain('ReferenceTypingRoute');
      expect(exports).toContain('CompletionRoute');
      
      // Deck study workflow
      expect(exports).toContain('DeckStudyRoute');
      expect(exports).toContain('DeckCompletionRoute');
      
      // Statistics
      expect(exports).toContain('BestTimesRoute');
    });
  });

  describe('naming conventions', () => {
    it('follows consistent Route naming pattern', () => {
      const exports = Object.keys(RoutesModule);
      
      exports.forEach(exportName => {
        expect(exportName).toMatch(/Route$/);
        expect(exportName).toMatch(/^[A-Z][a-zA-Z]*Route$/);
      });
    });

    it('uses descriptive route names', () => {
      const exports = Object.keys(RoutesModule);
      
      // Each route name should be descriptive
      exports.forEach(exportName => {
        expect(exportName.length).toBeGreaterThan(5); // More than just "Route"
        expect(exportName).not.toBe('Route');
      });
    });
  });

  describe('component validation', () => {
    it('all exports are valid React component functions', () => {
      const exports = Object.keys(RoutesModule);
      
      exports.forEach(exportName => {
        const component = RoutesModule[exportName];
        expect(typeof component).toBe('function');
        expect(component.length).toBeGreaterThanOrEqual(0); // Should accept props (or no props)
      });
    });

    it('components have expected React component structure', () => {
      const { HomeRoute, CompletionRoute } = RoutesModule;
      
      // Sample check on a couple components
      expect(HomeRoute.name).toBe('HomeRoute');
      expect(CompletionRoute.name).toBe('CompletionRoute');
    });
  });
});