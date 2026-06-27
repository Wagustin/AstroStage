import { Component, ElementRef, ViewChild, AfterViewInit, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  private mouseMoveListener!: (event: MouseEvent) => void;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngAfterViewInit() {
    if (this.heroVideo) {
      this.heroVideo.nativeElement.muted = true;
      this.heroVideo.nativeElement.play().catch(e => console.log('Autoplay deferred by browser', e));
    }

    this.ngZone.runOutsideAngular(() => {
      this.mouseMoveListener = (event: MouseEvent) => {
        const x = event.clientX;
        const y = event.clientY;
        this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
        this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
      };
      window.addEventListener('mousemove', this.mouseMoveListener, { passive: true });
    });
  }

  ngOnDestroy() {
    if (this.mouseMoveListener) {
      window.removeEventListener('mousemove', this.mouseMoveListener);
    }
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
