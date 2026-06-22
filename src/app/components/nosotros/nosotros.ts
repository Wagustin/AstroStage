import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  template: `
    <section class="nosotros-section" id="nosotros">
      <h2 class="section-title">AstroStage 3D</h2>
      <p class="section-desc">
        Somos pioneros en la revolución del entretenimiento inmersivo desde Lima, Perú.
        Nuestra misión es llevar la energía del escenario en vivo directamente a tu casa, 
        borrando las fronteras entre el artista y la audiencia a través de la realidad extendida.
      </p>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      padding: 6rem 2rem;
      --mouse-x: 50%;
      --mouse-y: 50%;
    }
    .nosotros-section {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    .section-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 2rem;
      position: relative;
      display: inline-block;
      color: var(--text-primary);
    }
    :host::after {
      content: '';
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: radial-gradient(circle 300px at var(--mouse-x) var(--mouse-y), rgba(0, 242, 254, 0.25), transparent 70%);
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
      z-index: -1;
    }
    :host:has(.section-title:hover)::after { opacity: 1; }
    .section-desc {
      color: var(--text-secondary);
      font-size: 1.2rem;
      line-height: 1.8;
    }
  `]
})
export class Nosotros {
  constructor(private el: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }
}
