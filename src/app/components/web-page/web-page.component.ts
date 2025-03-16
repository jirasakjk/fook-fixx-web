import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import AOS from 'aos';
@Component({
  selector: 'app-web-page',
  standalone: false,
  templateUrl: './web-page.component.html',
  styleUrl: './web-page.component.css',
  animations: [
    trigger('menuFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WebPageComponent {

  public isMenuOpen: boolean = false;
  public contract: string = `JIRASAK KANKRASANG`
  public email: string = `jirasak.kankrasang@hotmail.com`

  ngOnInit() {
    AOS.init();
  }

  public scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.isMenuOpen = false;
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  public scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.isMenuOpen = false;
  }

  public clickGithub(event: Event) {
    event.preventDefault(); // Prevent default navigation
    window.open('https://github.com/jirasakjk', '_blank');
  }

  clickLinkedin(event: Event) {
    event.preventDefault(); // Prevent default navigation
    window.open('https://linkedin.com/in/jirasak-kankrasang-b5b0151b2', '_blank');
  }
}
