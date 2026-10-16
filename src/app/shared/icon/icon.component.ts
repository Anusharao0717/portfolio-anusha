import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BRAND_ICONS, IconName, UI_ICONS } from '../../core/icons';

/**
 * Inline SVG icon. Uses currentColor, so it follows the theme and any parent `color`.
 * Usage: <app-icon name="mail" [size]="18" />
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': '"inline-flex"', '[style.line-height]': '"0"', 'aria-hidden': 'true' },
  template: `
    @if (brandPath(); as d) {
      <svg viewBox="0 0 24 24" fill="currentColor" [attr.width]="size()" [attr.height]="size()"><path [attr.d]="d" /></svg>
    } @else {
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
           stroke-linejoin="round" [attr.width]="size()" [attr.height]="size()" [innerHTML]="uiMarkup()"></svg>
    }
  `
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<IconName>();
  readonly size = input(20);

  protected readonly brandPath = computed(() => (BRAND_ICONS as Record<string, string>)[this.name()] ?? null);

  // The markup comes from our own static icon table (never user input), so trusting it is safe.
  protected readonly uiMarkup = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml((UI_ICONS as Record<string, string>)[this.name()] ?? '')
  );
}
