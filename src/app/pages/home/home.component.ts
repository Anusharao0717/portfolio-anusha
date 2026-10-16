import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEXT } from '../../core/content';
import { IconName } from '../../core/icons';
import { showImageFallback } from '../../core/image-fallback';
import { SITE } from '../../core/site.config';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

interface Skill { name: string; icon: IconName; className: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ContactFormComponent, RevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly text = TEXT;
  readonly site = SITE;
  readonly imageFallback = showImageFallback;

  readonly skills: Skill[] = [
    { name: 'Angular', icon: 'angular', className: 'angular' },
    { name: 'React', icon: 'react', className: 'react' },
    { name: 'TypeScript', icon: 'typescript', className: 'typescript' },
    { name: 'JavaScript', icon: 'javascript', className: 'javascript' },
    { name: 'HTML5', icon: 'html5', className: 'html' },
    { name: 'CSS3', icon: 'css', className: 'css' },
    { name: 'SCSS', icon: 'sass', className: 'scss' },
    { name: 'Bootstrap', icon: 'bootstrap', className: 'bootstrap' },
    { name: 'Angular Material', icon: 'material', className: 'material' },
    { name: 'REST API', icon: 'arrow-left-right', className: 'api' },
    { name: 'RxJS', icon: 'rxjs', className: 'rxjs' },
    { name: 'Git', icon: 'git', className: 'git' },
    { name: 'Next.js', icon: 'nextjs', className: 'next' },
    { name: 'Figma', icon: 'figma', className: 'figma' },
    { name: 'VS Code', icon: 'code', className: 'vscode' },
    { name: 'Azure DevOps', icon: 'workflow', className: 'azure' }
  ];

  readonly projects = [
    { title: 'Planner & Workflow Apps', tag: 'Angular', image: 'images/project-dashboard.webp', description: 'Planner, worksheet, timeline and reference-selection workflows with API-driven data and reusable UI components.' },
    { title: 'Task & Real-time Workflows', tag: 'React', image: 'images/project-task.webp', description: 'Responsive task-management interfaces with forms, drag-and-drop interactions, notifications and real-time updates.' },
    { title: 'AI & Interactive UI', tag: 'Angular', image: 'images/project-marketing.webp', description: 'Modern frontend experiences combining AI-enabled chat, canvas UI, dynamic data and polished responsive interactions.' }
  ];
}
