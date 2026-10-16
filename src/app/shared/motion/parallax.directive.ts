import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, numberAttribute } from '@angular/core';
import { MotionService } from '../../core/motion.service';

/**
 * Parallax with GSAP ScrollTrigger: while the surrounding <section> scrolls out of view, this element drifts
 * vertically by `appParallax` pixels (positive = lags behind the page, negative = moves faster).
 */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective {
  readonly distance = input(60, { alias: 'appParallax', transform: (v: unknown) => numberAttribute(v, 60) });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      let cleanup: (() => void) | undefined;
      let destroyed = false;
      this.destroyRef.onDestroy(() => {
        destroyed = true;
        cleanup?.();
      });

      this.motion.load().then(libs => {
        if (!libs || destroyed) {
          return;
        }
        const { gsap } = libs;
        const tween = gsap.to(this.element, {
          y: this.distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: this.element.closest('section') ?? this.element,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(this.element, { clearProps: 'transform' });
        };
      });
    });
  }
}
