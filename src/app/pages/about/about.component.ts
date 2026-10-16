import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEXT } from '../../core/content';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly text = TEXT;
}