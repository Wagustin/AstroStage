import { Component, AfterViewInit } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { Simulator } from './components/simulator/simulator';
import { Features } from './components/features/features';
import { Alquiler } from './components/alquiler/alquiler';
import { Waitlist } from './components/waitlist/waitlist';
import { Nosotros } from './components/nosotros/nosotros';
import { Footer } from './components/footer/footer';
import { Legal } from './pages/legal/legal';
import { AudioService } from './services/audio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, Hero, Simulator, Features, Alquiler, Waitlist, Nosotros, Footer, Legal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  constructor(
    private audioService: AudioService,
    public router: Router,
  ) {}

  ngAfterViewInit() {
    // Scroll Reveal Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // Cursor Trail (Canvas)
    this.initCursorTrail();
  }

  initCursorTrail() {
    const canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles: {
      x: number;
      y: number;
      life: number;
      size: number;
      vx: number;
      vy: number;
    }[] = [];

    let mouseX = -100;
    let mouseY = -100;

    let expSection: HTMLElement | null = document.getElementById('experiencia');
    let expTopPage = Infinity;

    const updateExpPosition = () => {
      if (!expSection) {
        expSection = document.getElementById('experiencia');
      }
      if (expSection) {
        const rect = expSection.getBoundingClientRect();
        expTopPage = rect.top + window.scrollY;
      }
    };

    updateExpPosition();

    window.addEventListener('resize', updateExpPosition);
    window.addEventListener('scroll', updateExpPosition, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!expSection) {
        updateExpPosition();
      }

      if (expSection) {
        const currentExpTop = expTopPage - window.scrollY;
        // Skip emitting particles if mouse is vertically above the top of the Experiencia section
        if (mouseY < currentExpTop) {
          return;
        }
      }

      // Emit a single, softer particle per move for a diffused look
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 4,
        y: mouseY + (Math.random() - 0.5) * 4,
        life: 1,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2 + 0.1,
      });
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Setup blur and glowing effect for the elegant risograph/stardust look
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(0, 255, 255, 0.4)';
      ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015; // fade slightly slower

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.globalAlpha = p.life * 0.5; // lower max opacity for elegance
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    draw();
  }
}
