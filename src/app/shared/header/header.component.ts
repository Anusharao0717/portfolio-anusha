import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEXT } from '../../core/content';
import { ScrollSpyService } from '../../core/scroll-spy.service';
import { SITE } from '../../core/site.config';
import { ThemeService } from '../../core/theme.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  readonly spy = inject(ScrollSpyService);
  readonly text = TEXT;
  readonly resumeUrl = SITE.resume;

  readonly menuOpen = signal(false);
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Escape closes the mobile menu and returns focus to its button. */
  onEscape(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      this.menuButton().nativeElement.focus();
    }
  }
}
