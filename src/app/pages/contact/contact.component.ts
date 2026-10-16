import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEXT } from '../../core/content';
import { SITE } from '../../core/site.config';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactFormComponent, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly text = TEXT;
  readonly site = SITE;
}
