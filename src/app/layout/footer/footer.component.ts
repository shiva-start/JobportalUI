import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  seekerLinks = [
    { labelKey: 'FOOTER.LINKS.SEEKERS.BROWSE_JOBS', route: '/jobs' },
    { labelKey: 'FOOTER.LINKS.SEEKERS.INTERNSHIPS', route: '/internships' },
    { labelKey: 'FOOTER.LINKS.SEEKERS.COURSES', route: '/courses' },
    { labelKey: 'FOOTER.LINKS.SEEKERS.CAREER_BLOG', route: '/blog' },
    { labelKey: 'FOOTER.LINKS.SEEKERS.RESUME_BUILDER', route: '/candidate' },
  ];

  employerLinks = [
    { labelKey: 'FOOTER.LINKS.EMPLOYERS.POST_A_JOB', route: '/employer' },
    { labelKey: 'FOOTER.LINKS.EMPLOYERS.BROWSE_CANDIDATES', route: '/employer' },
    { labelKey: 'FOOTER.LINKS.EMPLOYERS.BROWSE_FREELANCERS', route: '/freelancers' },
    { labelKey: 'FOOTER.LINKS.EMPLOYERS.COMPANIES', route: '/companies' },
  ];

  companyLinks = [
    { labelKey: 'FOOTER.LINKS.COMPANY.ABOUT_US', route: '/' },
    { labelKey: 'FOOTER.LINKS.COMPANY.HELP_SUPPORT', route: '/help' },
    { labelKey: 'FOOTER.LINKS.COMPANY.PRIVACY_POLICY', route: '/' },
    { labelKey: 'FOOTER.LINKS.COMPANY.TERMS_OF_SERVICE', route: '/' },
  ];
  
}
