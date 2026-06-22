import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  constructor(private el: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarOffset = 80;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarOffset;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let start: number | null = null;

      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  }
}
