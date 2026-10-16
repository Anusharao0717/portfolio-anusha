import { inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, Router, provideRouter, withPreloading, withRouterConfig, withViewTransitions } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

const pathOf = (url: string) => url.split(/[?#]/)[0];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      // Scrolling (to #sections and to the top of new pages) is handled by MotionService (smooth, Lenis-aware).
      // Lets the nav re-scroll to a section even if its #fragment is already in the URL.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      // Lazy route chunks download in the background after first paint, so navigation feels instant.
      withPreloading(PreloadAllModules),
      // Page transitions (View Transitions API; browsers without it just get the CSS fade).
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition }) => {
          const router = inject(Router);
          const target = router.getCurrentNavigation()?.finalUrl?.toString() ?? router.url;
          // Only animate real page changes — not in-page #section scrolling.
          if (pathOf(target) === pathOf(router.url)) {
            transition.ready.catch(() => undefined); // a skipped transition rejects `ready` by design
            transition.skipTransition();
          }
        }
      })
    )
  ]
}).catch((error) => console.error(error));
