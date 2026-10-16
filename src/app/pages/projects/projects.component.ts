import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { TEXT } from '../../core/content';
import { showImageFallback } from '../../core/image-fallback';
import { SITE } from '../../core/site.config';
import { IconComponent } from '../../shared/icon/icon.component';
import { TextRevealDirective } from '../../shared/motion/text-reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

interface Project {
  title: string;
  category: string;
  description: string;
  stack: string[];
  github: string;
  image: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent, RevealDirective, TextRevealDirective, TiltDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  readonly text = TEXT;
  readonly imageFallback = showImageFallback;

  readonly projects: Project[] = [
    { title: 'Planner, Worksheet & Timeline Workflows', category: 'Angular', description: 'Planner, worksheet, timeline and reference-selection workflows with API-driven data and popup interactions.', stack: ['Angular','TypeScript','REST APIs'], github: SITE.github, image: 'images/project-dashboard.webp' },
    { title: 'Real-time Notification System', category: 'Angular', description: 'Notification experiences with real-time updates, unread counts, read/unread state handling and user interactions.', stack: ['Angular','RxJS','REST APIs'], github: SITE.github, image: 'images/project-task.webp' },
    { title: 'Interactive Canvas Application', category: 'Advanced Frontend', description: 'Canvas-based interfaces with draggable objects, stickers, shapes and dynamic application data.', stack: ['Angular','Canvas','TypeScript'], github: SITE.github, image: 'images/project-marketing.webp' },
    { title: 'AI Chat & Messaging Experience', category: 'Advanced Frontend', description: 'AI-enabled chat and messaging interfaces with conversational workflows and frontend API integration.', stack: ['Angular','REST APIs','AI UI'], github: SITE.github, image: 'images/project-dashboard.webp' },
    { title: 'Offline Data & Synchronization', category: 'Advanced Frontend', description: 'Offline application functionality and data synchronization using PouchDB-based data handling.', stack: ['Angular','PouchDB','Sync'], github: SITE.github, image: 'images/project-task.webp' },
    { title: 'Responsive Dashboards & Forms', category: 'React', description: 'Responsive dashboards, forms, tables, filters, status management and role-based UI behavior.', stack: ['React','TypeScript','SCSS'], github: SITE.github, image: 'images/project-marketing.webp' }
  ];

  /** `value` matches Project.category; `label` is the text shown on the button. */
  readonly filters = [
    { value: 'All', label: TEXT.all },
    { value: 'Angular', label: 'Angular' },
    { value: 'React', label: 'React' },
    { value: 'Advanced Frontend', label: TEXT.advancedFilter }
  ];

  // --- RxJS: category (BehaviorSubject) + debounced search (FormControl.valueChanges) -> filtered list ---
  readonly search = new FormControl('', { nonNullable: true });
  private readonly category$ = new BehaviorSubject<string>('All');
  readonly activeFilter = toSignal(this.category$, { initialValue: 'All' });

  private readonly query$ = this.search.valueChanges.pipe(
    map(value => value.trim().toLowerCase()),
    debounceTime(200),
    distinctUntilChanged(),
    startWith('')
  );

  readonly visibleProjects = toSignal(
    combineLatest([this.category$, this.query$]).pipe(
      map(([category, query]) =>
        this.projects.filter(project =>
          (category === 'All' || project.category === category) &&
          (!query || [project.title, project.description, project.category, ...project.stack].join(' ').toLowerCase().includes(query))
        )
      )
    ),
    { initialValue: this.projects }
  );

  setFilter(filter: string): void {
    this.category$.next(filter);
  }

  clearSearch(): void {
    this.search.setValue('');
  }
}
