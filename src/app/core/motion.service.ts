import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface MotionLibs {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
}

/** Sticky header height + a little breathing room, so sections land just below the header. */
const HEADER_OFFSET = 86;

/**
 * Central place for motion:
 *  - lazily loads GSAP + ScrollTrigger and Lenis (separate chunks, never part of the first paint)
 *  - Lenis gives buttery smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
 *  - handles #section navigation and scroll-to-top on page changes (smooth, or instant for new pages)
 * Everything is skipped when the visitor prefers reduced motion.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly router = inject(Router);

  readonly reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  /** Hover-style effects (tilt, magnetic) only make sense with a real mouse. */
  readonly finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

  private libs?: Promise<MotionLibs | null>;
  private lenis: import('lenis').default | null = null;
  private lastPath: string | null = null;

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.onNavigation(event.urlAfterRedirects));
  }

  /** Loads the animation libraries once. Resolves to null when motion is reduced or loading fails. */
  load(): Promise<MotionLibs | null> {
    if (this.reduced) {
      return Promise.resolve(null);
    }
    return (this.libs ??= this.init());
  }

  private async init(): Promise<MotionLibs | null> {
    try {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis')
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      this.lenis = lenis;

      return { gsap, ScrollTrigger };
    } catch {
      return null; // the site works fine without animation libraries
    }
  }

  /** Smoothly scrolls to a section id on the current page ('home' = top of page). */
  scrollToId(id: string, immediate = false, allowCorrection = true): void {
    const element = id === 'home' ? null : document.getElementById(id);
    if (id !== 'home' && !element) {
      return;
    }
    if (this.lenis) {
      // The page may be taller/shorter than when Lenis last measured it (e.g. after a route change).
      this.lenis.resize();
      // No manual offset: Lenis already honours `scroll-padding-top` (the sticky header) from styles.scss.
      this.lenis.scrollTo(element ?? 0, {
        immediate,
        duration: 1.2,
        onComplete: () => allowCorrection && element && this.correct(id)
      });
      return;
    }
    const top = element ? element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 8 : 0;
    window.scrollTo({ top, behavior: immediate || this.reduced ? 'auto' : 'smooth' });
  }

  /** Deferred sections can change the page height while we scroll; re-aim once if we ended up far off. */
  private correct(id: string): void {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element && Math.abs(element.getBoundingClientRect().top - HEADER_OFFSET) > 60) {
        this.scrollToId(id, false, false);
      }
    }, 120);
  }

  scrollTop(): void {
    this.scrollToId('home');
  }

  private onNavigation(url: string): void {
    const [withoutFragment, fragment] = url.split('#');
    const path = withoutFragment.split('?')[0];
    const pageChanged = path !== this.lastPath;
    this.lastPath = path;

    // Wait for the routed component to be in the DOM before scrolling.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (fragment) {
          this.scrollToId(fragment, pageChanged);
        } else if (pageChanged) {
          this.scrollToId('home', true);
        }
      })
    );
  }
}
