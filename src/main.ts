import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      // Lets the nav re-scroll to a section even if its #fragment is already in the URL.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      // Lazy route chunks download in the background after first paint, so navigation feels instant.
      withPreloading(PreloadAllModules)
    )
  ]
}).catch((error) => console.error(error));
