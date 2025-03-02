import { Component } from '@angular/core';

import AOS from 'aos';
@Component({
  selector: 'app-web-page',
  standalone: false,
  templateUrl: './web-page.component.html',
  styleUrl: './web-page.component.css'
})
export class WebPageComponent {

  public isMenuOpen: boolean = false;
  public contract: string = ` Mr. JIRASAK KANKRASANG`
  public email: string = `jirasak.kankrasang@hotmail.com`

  ngOnInit() {
    AOS.init();
  }

  public scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.isMenuOpen = false;
    }
  }

  public toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu() {
    this.isMenuOpen = false;
  }

  public scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.isMenuOpen = false;
  }
}
