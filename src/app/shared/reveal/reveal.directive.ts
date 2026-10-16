import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, numberAttribute, signal } from '@angular/core';

/**
 * Scroll-reveal animation: fades/slides the element in the first time it enters the viewport.
 * Usage: <section appReveal> or <article [appReveal]="120"> (value = stagger delay in ms).
 * Visible immediately when the visitor prefers reduced motion or IntersectionObserver is missing.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'reveal',
    '[class.is-visible]': 'visible()',
    '[style.--reveal-delay]': 'delay() + "ms"'
  }
})
export class RevealDirective {
  readonly delay = input(0, { alias: 'appReveal', transform: (value: unknown) => numberAttribute(value, 0) });
  protected readonly visible = signal(false);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || !('IntersectionObserver' in window)) {
        this.visible.set(true);
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.visible.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );
      observer.observe(this.element.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
