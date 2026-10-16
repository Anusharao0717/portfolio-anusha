import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TEXT } from '../../core/content';
import { ContactService } from '../../core/contact.service';
import { SITE } from '../../core/site.config';
import { IconComponent } from '../icon/icon.component';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contact = inject(ContactService);

  readonly text = TEXT;
  readonly email = SITE.email;
  readonly status = signal<Status>('idle');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]]
  });

  /** True once the visitor has interacted with the form and something is still invalid. */
  showError(): boolean {
    return this.form.touched && this.form.invalid;
  }

  invalid(control: 'name' | 'email' | 'message'): boolean {
    const field = this.form.controls[control];
    return field.touched && field.invalid;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.status() === 'sending') {
      return;
    }

    this.status.set('sending');
    try {
      const result = await this.contact.send(this.form.getRawValue());
      this.status.set(result);
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }
}
