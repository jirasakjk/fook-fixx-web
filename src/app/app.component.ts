import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import { ThemeService } from './services/theme.service';
import { SpinnerExampleComponent } from './components/spinner/spinner-example.component';
import { GlobalSpinnerComponent } from './components/spinner/global-spinner.component';
import { UsersExampleComponent } from './components/users/users-example.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from './components/success-dialog/success-dialog.component';

interface PortfolioProject {
  title: string;
  description: string;
  tech: string;
  type: string;
  link: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerExampleComponent, GlobalSpinnerComponent, UsersExampleComponent, ErrorDialogComponent, SuccessDialogComponent],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fook-fixx-web';
  isMenuOpen = false;
  contract = 'JIRASAK KANKRASANG';
  email = 'jirasak.kankrasang@hotmail.com';

  navItems = [
    { label: 'Home', section: 'home' },
    { label: 'About', section: 'about-me' },
    { label: 'Portfolio', section: 'portfolio' },
    { label: 'Contact', section: 'contact-me' }
  ];
  showHome = true;
  showMainHeader = true;

  skills = [
    'Angular',
    'Vue.js',
    'React',
    'ASP.NET Core',
    'Tailwind CSS',
    'TypeScript',
    'Java',
    'Spring Boot'
  ];

  projects: PortfolioProject[] = [
    {
      title: 'Fook.Fixx Dashboard',
      description: 'A modern admin dashboard with responsive charts, user analytics and workflow automation.',
      tech: 'Angular · Tailwind · ASP.NET Core',
      type: 'Enterprise App',
      link: 'https://github.com/jirasakjk'
    },
    {
      title: 'Creative Studio',
      description: 'A sleek portfolio platform with smooth interactions, mobile-first design and fast load times.',
      tech: 'Vue.js · Tailwind · API Integration',
      type: 'Portfolio Site',
      link: 'https://github.com/jirasakjk'
    },
    {
      title: 'E-commerce UI',
      description: 'A conversion-driven shop experience with product filtering, animated transitions and checkout flows.',
      tech: 'React · Tailwind · Firebase',
      type: 'Web Store',
      link: 'https://github.com/jirasakjk'
    }
  ];

  constructor(private router: Router, public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.loadTheme();
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true
    });

    // control showing the homepage content and app header
    this.updateRouteFlags(this.router.url);
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const u = ev.urlAfterRedirects || ev.url;
        this.updateRouteFlags(u);
      }
    });
  }

  updateRouteFlags(url: string) {
    this.showHome = url === '/' || url === '';
    this.showMainHeader = !url.startsWith('/dashboard');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.closeMenu();
      return;
    }

    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.closeMenu();
        }
      }, 100);
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  clickGithub(event: Event) {
    event.preventDefault();
    this.openLink('https://github.com/jirasakjk');
  }

  clickLinkedin(event: Event) {
    event.preventDefault();
    this.openLink('https://linkedin.com/in/jirasak-kankrasang-b5b0151b2');
  }
}
