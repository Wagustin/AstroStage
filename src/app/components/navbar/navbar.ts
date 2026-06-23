import { Component, HostListener, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLightTheme = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Check saved theme
    const savedTheme = localStorage.getItem('astrostage-theme');
    if (savedTheme === 'light') {
      this.isLightTheme = true;
      document.documentElement.classList.add('light-theme');
    }
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
    if (this.isLightTheme) {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('astrostage-theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('astrostage-theme', 'dark');
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // Fixes scroll lock bugs on mobile browsers
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    this.closeMenu();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    this.closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for fixed navbar (approx 80px)
      const navbarOffset = 80;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarOffset;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800; // 0.8 seconds for a fast but fluid scroll
      let start: number | null = null;

      // EaseInOutCubic for a fluid, natural feel that isn't sluggish
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // Safety unlock: ensure scroll is completely restored after animation finishes
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      };

      requestAnimationFrame(animation);
    }
  }
}
