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
    { label: 'Career Advice', route: '/register' },
    { label: 'Resume Builder', route: '/candidate' },
    { label: 'Salary Guide', route: '/candidate' },
  ];

  employerLinks = [
    { label: 'Post a Job', route: '/employer' },
    { label: 'Browse Candidates', route: '/employer' },
    { label: 'Pricing', route: '/employer' },
    { label: 'Resources', route: '/home' },
  ];

  companyLinks = [
    { label: 'About Us', route: '/home' },
    { label: 'Contact', route: '/home' },
    { label: 'Privacy Policy', route: '/home' },
    { label: 'Terms of Service', route: '/home' },
  ];
  
}
