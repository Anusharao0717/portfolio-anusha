import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';

/**
 * Word-by-word text animation: every word slides up out of a mask, one after another.
 *  <h1 appTextReveal="load">   plays immediately (hero)
 *  <h2 appTextReveal>          plays when the heading scrolls into view
 * Nested elements (e.g. a gradient <span class="grad">) are kept. Screen readers get the full text via aria-label.
 * Does nothing when the visitor prefers reduced motion — the text is simply shown.
 */
@Directive({
  selector: '[appTextReveal]',
  standalone: true,
  host: { '[class.tr]': 'split()', '[class.tr-on]': 'on()' }
})
export class TextRevealDirective {
  readonly mode = input<'load' | 'scroll', unknown>('scroll', { alias: 'appTextReveal', transform: (v: unknown) => (v === 'load' ? 'load' : 'scroll') });

  protected readonly split = signal(false);
  protected readonly on = signal(false);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        return;
      }
      this.splitWords();
      this.split.set(true);

      if (this.mode() === 'load' || !('IntersectionObserver' in window)) {
        // one frame later so the hidden state is painted first and the transition actually runs
        requestAnimationFrame(() => this.on.set(true));
        return;
      }
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.on.set(true);
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(this.element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private splitWords(): void {
    let index = 0;
    this.element.setAttribute('aria-label', (this.element.textContent ?? '').replace(/\s+/g, ' ').trim());

    const walk = (node: Node): void => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
          continue;
        }
        if (child.nodeType !== Node.TEXT_NODE) {
          continue;
        }
        const fragment = document.createDocumentFragment();
        for (const part of (child.textContent ?? '').split(/(\s+)/)) {
          if (!part) {
            continue;
          }
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            continue;
          }
          const word = document.createElement('span');
          word.className = 'tr-word';
          word.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = 'tr-inner';
          inner.style.setProperty('--i', String(index++));
          inner.textContent = part;
          word.append(inner);
          fragment.append(word);
        }
        child.replaceWith(fragment);
      }
    };
    walk(this.element);
  }
}
