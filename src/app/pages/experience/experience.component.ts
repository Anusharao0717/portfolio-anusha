import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEXT } from '../../core/content';

@Component({
  selector: 'app-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  readonly jobs = [{
    role: 'Software Engineer',
    company: 'Bix Bytes Solutions Pvt Ltd, Mangaluru',
    period: 'October 2019 — Present',
    bullets: [
      'Develop and maintain responsive web applications using Angular, TypeScript, JavaScript, HTML and CSS/SCSS with focus on scalability, performance and maintainability.',
      'Work across Angular, React and Vue.js applications based on project requirements and technology stacks.',
      'Translate UI/UX designs and business requirements into responsive, accessible and reusable frontend components.',
      'Integrate frontend applications with REST APIs and collaborate with backend, QA and cross-functional teams to deliver end-to-end features.',
      'Lead frontend development activities across multiple projects including task planning, effort estimation, technical coordination and delivery.',
      'Develop complex business interfaces including dashboards, forms, planners, timelines, notifications, drag-and-drop workflows and interactive UI components.',
      'Implement AI-enabled frontend features and chat-based user experiences, including conversational interfaces and API-integrated messaging workflows.',
      'Work with canvas-based application interfaces, interactive boards, complex user interactions and API-driven data.',
      'Contribute to offline-capable application workflows and synchronization features using PouchDB-based data handling.',
      'Work with media and blob-based frontend workflows, including image/video handling and application data processing.',
      'Perform unit testing, frontend testing, debugging and issue resolution across UI, functional, responsive, cross-browser and performance concerns.',
      'Support application maintenance, enhancements, releases and production issue resolution across multiple client applications.'
    ]
  }];

  readonly text = TEXT;
}