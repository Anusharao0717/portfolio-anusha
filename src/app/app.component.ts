import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { distinctUntilChanged, filter, map, skip } from 'rxjs';
import { MotionService } from './core/motion.service';
import { ScrollSpyService } from './core/scroll-spy.service';
import { SeoService } from './core/seo.service';
import { ThemeService } from './core/theme.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { IconComponent } from './shared/icon/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, IconComponent],
  template: `
    <a class="skip-link" href="#main" (click)="skipToMain($event)">Skip to main content</a>
    <app-header />
    <main id="main" #main tabindex="-1"><router-outlet /></main>
    <app-footer />

    @if (spy.showTop()) {
      <button class="to-top" type="button" animate.enter="fade-in" aria-label="Back to top" (click)="scrollTop()">
        <app-icon name="arrow-up" [size]="20" />
      </button>
    }

    <!-- Announces page changes to screen readers (SPA navigation does not reload the page) -->
    <div class="sr-only" role="status" aria-live="polite">{{ announcement() }}</div>
  `
})
export class AppComponent {
  readonly spy = inject(ScrollSpyService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly motion = inject(MotionService);

  // Instantiated here so the saved theme is applied as soon as the app starts.
  private readonly theme = inject(ThemeService);

  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');
  protected readonly announcement = signal('');

  constructor() {
    // Smooth scrolling (Lenis) + GSAP load after first paint, so they never delay the initial render.
    afterNextRender(() => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      idle ? idle(() => void this.motion.load()) : setTimeout(() => void this.motion.load(), 200);
    });

    // Move keyboard/screen-reader focus to the new page's content after a real page change
    // (not for in-page #section links, and not on first load).
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(event => event.urlAfterRedirects.split(/[?#]/)[0]),
        distinctUntilChanged(),
        skip(1),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.announcement.set(this.seo.pageTitle());
        this.main().nativeElement.focus({ preventScroll: true });
      });
  }

  skipToMain(event: Event): void {
    // A plain href="#main" would resolve against <base href> and reload the page.
    event.preventDefault();
    this.main().nativeElement.focus();
    this.main().nativeElement.scrollIntoView();
  }

  scrollTop(): void {
    this.motion.scrollTop();
  }
}
