import { Routes } from '@angular/router';

/** Every page is lazy-loaded (its own JS chunk). `data.description` feeds SeoService. */
export const routes: Routes = [
  {
    path: '',
    title: 'Anusha Pavanraj | Senior Frontend Developer',
    data: { description: 'Anusha Pavanraj — Senior Frontend Developer with 6+ years of experience building scalable Angular, React and TypeScript applications.' },
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    title: 'About | Anusha Pavanraj',
    data: { description: 'About Anusha Pavanraj: skills, education and experience building responsive, accessible and scalable frontend applications.' },
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'experience',
    title: 'Experience | Anusha Pavanraj',
    data: { description: 'Professional experience of Anusha Pavanraj as a Frontend Developer working with Angular, React, Vue.js, TypeScript and REST APIs.' },
    loadComponent: () => import('./pages/experience/experience.component').then(m => m.ExperienceComponent)
  },
  {
    path: 'projects',
    title: 'Projects | Anusha Pavanraj',
    data: { description: 'Selected frontend projects: planners and workflows, real-time notifications, canvas UI, AI chat, offline sync and responsive dashboards.' },
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'contact',
    title: 'Contact | Anusha Pavanraj',
    data: { description: 'Get in touch with Anusha Pavanraj about frontend development opportunities and collaborations.' },
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  { path: '**', redirectTo: '' }
];
