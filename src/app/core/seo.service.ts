import { Injectable, inject, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const DEFAULT_DESCRIPTION =
  'Anusha Pavanraj — Senior Frontend Developer specializing in Angular, React, Vue.js and TypeScript.';

/** Keeps meta description, Open Graph/Twitter tags and the canonical link in sync with the current route. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  /** Title of the current page (also announced to screen readers on navigation). */
  readonly pageTitle = signal(document.title);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.update());
  }

  private update(): void {
    const route = this.deepest(this.router.routerState.snapshot.root);
    const title = route.title ?? document.title;
    const description = (route.data['description'] as string | undefined) ?? DEFAULT_DESCRIPTION;
    const path = this.router.url.split(/[?#]/)[0].replace(/^\//, '');
    const url = new URL(path, document.baseURI).href;

    this.pageTitle.set(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.setCanonical(url);
  }

  private deepest(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = snapshot;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }

  private setCanonical(url: string): void {
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }
}
