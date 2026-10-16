import { Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';
import { MotionService } from '../../core/motion.service';

/** Magnetic button: while the mouse is over it, the element drifts slightly toward the cursor. */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
  host: { class: 'magnetic', '(pointermove)': 'move($event)', '(pointerleave)': 'leave()' }
})
export class MagneticDirective {
  /** 0–1: how far the element follows the cursor. */
  readonly strength = input(0.3, { alias: 'appMagnetic', transform: (v: unknown) => numberAttribute(v, 0.3) });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly enabled = (() => {
    const motion = inject(MotionService);
    return !motion.reduced && motion.finePointer;
  })();

  move(event: PointerEvent): void {
    if (!this.enabled || event.pointerType !== 'mouse') {
      return;
    }
    const rect = this.element.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    this.element.style.translate = `${(dx * this.strength()).toFixed(1)}px ${(dy * this.strength()).toFixed(1)}px`;
  }

  leave(): void {
    this.element.style.translate = '';
  }
}
