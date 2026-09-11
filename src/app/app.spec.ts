import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeAll(() => {
    // Mock IntersectionObserver for JSDOM
    if (!globalThis.IntersectionObserver) {
      globalThis.IntersectionObserver = class IntersectionObserver {
        constructor() {}
        disconnect() {}
        observe() {}
        unobserve() {}
        takeRecords() {
          return [];
        }
      } as unknown as typeof globalThis.IntersectionObserver;
    }

    // Mock HTMLCanvasElement.getContext for JSDOM
    HTMLCanvasElement.prototype.getContext = (() => {
      return {
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
      } as unknown as CanvasRenderingContext2D;
    }) as any;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('La música en sumáxima dimensión');
  });

  it('benchmark mousemove event listener performance', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const iterations = 500000;
    const startUncached = performance.now();
    for (let i = 0; i < iterations; i++) {
      const el = document.getElementById('experiencia');
      if (el) {
        const rect = el.getBoundingClientRect();
        const skip = 200 + (i % 500) < rect.top;
      }
    }
    const endUncached = performance.now();

    let cachedEl: HTMLElement | null = document.getElementById('experiencia');
    let cachedTop = cachedEl ? cachedEl.getBoundingClientRect().top : 0;

    const startCached = performance.now();
    for (let i = 0; i < iterations; i++) {
      if (!cachedEl || !cachedEl.isConnected) {
        cachedEl = document.getElementById('experiencia');
        cachedTop = cachedEl ? cachedEl.getBoundingClientRect().top : 0;
      }
      if (cachedEl) {
        const skip = 200 + (i % 500) < cachedTop;
      }
    }
    const endCached = performance.now();

    const speedup = ((endUncached - startUncached) / (endCached - startCached)).toFixed(1);
    console.log(
      `[BENCHMARK] 500,000 iterations - Uncached: ${(endUncached - startUncached).toFixed(2)} ms vs Cached: ${(endCached - startCached).toFixed(2)} ms (${speedup}x faster)`,
    );
  });
});
