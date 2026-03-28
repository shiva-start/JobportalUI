import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  seekerLinks = [
    { label: 'Browse Jobs', route: '/jobs' },
    { label: 'Create Profile', route: '/register' },
    { label: 'Candidate Dashboard', route: '/candidate' },
    { label: 'Saved Jobs', route: '/candidate' },
  ];

  employerLinks = [
    { label: 'Post a Job', route: '/employer' },
    { label: 'Employer Dashboard', route: '/employer' },
    { label: 'Manage Applicants', route: '/employer' },
    { label: 'Pricing', route: '/home' },
  ];

  companyLinks = [
    { label: 'About Us', route: '/home' },
    { label: 'Blog', route: '/home' },
    { label: 'Careers', route: '/jobs' },
    { label: 'Contact', route: '/home' },
  ];
}
