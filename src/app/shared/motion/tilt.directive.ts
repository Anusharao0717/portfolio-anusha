import { Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';
import { MotionService } from '../../core/motion.service';

/**
 * 3D hover effect: the element lifts and tilts toward the mouse (CSS perspective transform).
 * Styles live in styles.scss (`.tilt`). Only active for real mouse pointers and when motion is allowed.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
  host: {
    class: 'tilt',
    '(pointerenter)': 'enter($event)',
    '(pointermove)': 'move($event)',
    '(pointerleave)': 'leave()'
  }
})
export class TiltDirective {
  /** Maximum tilt in degrees. */
  readonly max = input(7, { alias: 'appTilt', transform: (v: unknown) => numberAttribute(v, 7) });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly enabled = (() => {
    const motion = inject(MotionService);
    return !motion.reduced && motion.finePointer;
  })();
  private frame = 0;

  enter(event: PointerEvent): void {
    if (this.enabled && event.pointerType === 'mouse') {
      this.element.classList.add('is-tilting');
    }
  }

  move(event: PointerEvent): void {
    if (!this.enabled || event.pointerType !== 'mouse') {
      return;
    }
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const rect = this.element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      this.element.style.setProperty('--ry', `${(x * this.max() * 2).toFixed(2)}deg`);
      this.element.style.setProperty('--rx', `${(-y * this.max() * 2).toFixed(2)}deg`);
    });
  }

  leave(): void {
    cancelAnimationFrame(this.frame);
    this.element.classList.remove('is-tilting');
    this.element.style.removeProperty('--rx');
    this.element.style.removeProperty('--ry');
  }
}
