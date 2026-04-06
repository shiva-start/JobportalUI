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
    { label: 'Internships', route: '/internships' },
    { label: 'Courses', route: '/courses' },
    { label: 'Career Blog', route: '/blog' },
    { label: 'Resume Builder', route: '/candidate' },
  ];

  employerLinks = [
    { label: 'Post a Job', route: '/employer' },
    { label: 'Browse Candidates', route: '/employer' },
    { label: 'Browse Freelancers', route: '/freelancers' },
    { label: 'Companies', route: '/companies' },
  ];

  companyLinks = [
    { label: 'About Us', route: '/' },
    { label: 'Help & Support', route: '/help' },
    { label: 'Privacy Policy', route: '/' },
    { label: 'Terms of Service', route: '/' },
  ];
  
}
