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

    // Mock Canvas getContext for JSDOM
    HTMLCanvasElement.prototype.getContext = function (type: string) {
      if (type === '2d') {
        return {
          clearRect: () => {},
          beginPath: () => {},
          arc: () => {},
          fill: () => {},
          shadowBlur: 0,
          shadowColor: '',
          fillStyle: '',
          globalAlpha: 1,
        } as unknown as CanvasRenderingContext2D;
      }
      return null;
    } as any;
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

  it('benchmark: measures mousemove event handling performance', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const iterations = 50000;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 100 + (i % 100), clientY: 500 + (i % 100) }),
      );
    }
    const duration = performance.now() - start;
    console.log(`[BENCHMARK] ${iterations} mousemove events took ${duration.toFixed(2)}ms`);
    expect(duration).toBeGreaterThanOrEqual(0);
  });
});
