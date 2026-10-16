import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { auditTime, distinctUntilChanged, filter, fromEvent, map, merge, of, shareReplay, startWith, switchMap, timer } from 'rxjs';

export const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

const HEADER_OFFSET = 120;
const pathOf = (url: string) => url.split(/[?#]/)[0];

/**
 * RxJS-driven scroll tracking.
 *  - `active`  : which home-page section is currently in view (drives the highlighted nav link + aria-current)
 *  - `showTop` : whether the "back to top" button should be visible
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly router = inject(Router);

  /** Throttled scroll position stream, shared by every subscriber. */
  private readonly scrollY$ = fromEvent(window, 'scroll', { passive: true }).pipe(
    auditTime(100),
    map(() => window.scrollY),
    startWith(window.scrollY),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /** Emits true while the router is on the home page (where the sections live). */
  private readonly onHome$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => pathOf(event.urlAfterRedirects) === '/'),
    startWith(pathOf(this.router.url) === '/'),
    distinctUntilChanged()
  );

  readonly active = toSignal(
    this.onHome$.pipe(
      // timer(250): re-check once after the page has rendered, because the first value can be computed before the sections exist.
      switchMap(onHome => (onHome ? merge(this.scrollY$, timer(250)).pipe(map(() => this.currentSection())) : of<SectionId | null>(null))),
      distinctUntilChanged()
    ),
    { initialValue: null as SectionId | null }
  );

  readonly showTop = toSignal(
    this.scrollY$.pipe(map(y => y > 600), distinctUntilChanged()),
    { initialValue: false }
  );

  private currentSection(): SectionId {
    const scrollable = document.documentElement.scrollHeight > window.innerHeight + 50;
    const atBottom = scrollable && window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) {
      return 'contact';
    }
    let current: SectionId = 'home';
    for (const id of SECTION_IDS) {
      const element = document.getElementById(id);
      if (element && element.getBoundingClientRect().top <= HEADER_OFFSET) {
        current = id;
      }
    }
    return current;
  }
}
