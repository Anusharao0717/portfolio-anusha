import { Injectable } from '@angular/core';
import { SITE } from './site.config';

export interface ContactMessage { name: string; email: string; message: string; }

/** 'sent' = delivered to your inbox; 'mailto' = no access key configured, visitor's mail app was opened instead. */
export type ContactResult = 'sent' | 'mailto';

@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(message: ContactMessage): Promise<ContactResult> {
    if (!SITE.contactAccessKey) {
      this.openMailApp(message);
      return 'mailto';
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: SITE.contactAccessKey,
        subject: `Portfolio enquiry from ${message.name}`,
        from_name: 'Portfolio website',
        name: message.name,
        email: message.email, // used as the Reply-To address
        message: message.message,
        botcheck: '' // honeypot field: must stay empty
      })
    });

    const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
    if (!response.ok || !result?.success) {
      throw new Error('Contact form request failed');
    }
    return 'sent';
  }

  private openMailApp({ name, email, message }: ContactMessage): void {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  }
}
