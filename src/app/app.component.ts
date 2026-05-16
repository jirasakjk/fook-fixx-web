import { Component, OnInit } from '@angular/core';
import AOS from 'aos';

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
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fook-fixx-web';
  isMenuOpen = false;
  isDarkMode = true;
  contract = 'JIRASAK KANKRASANG';
  email = 'jirasak.kankrasang@hotmail.com';

  navItems = [
    { label: 'Home', section: 'home' },
    { label: 'About', section: 'about-me' },
    { label: 'Portfolio', section: 'portfolio' },
    { label: 'Contact', section: 'contact-me' }
  ];

  skills = [
    'Angular',
    'Vue.js',
    'React',
    'ASP.NET Core',
    'Tailwind CSS',
    'TypeScript'
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

  ngOnInit() {
    this.loadTheme();
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true
    });
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    document.body.classList.toggle('light-mode', !this.isDarkMode);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
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
    }
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
