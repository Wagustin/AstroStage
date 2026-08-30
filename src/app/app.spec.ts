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

  it('benchmark mousemove listener execution time', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    document.body.appendChild(canvas);

    const exp = document.createElement('div');
    exp.id = 'experiencia';
    Object.defineProperty(exp, 'getBoundingClientRect', {
      value: () => ({
        top: 500,
        bottom: 1000,
        left: 0,
        right: 100,
        width: 100,
        height: 500,
        x: 0,
        y: 500,
        toJSON: () => {},
      }),
    });
    document.body.appendChild(exp);

    const app = fixture.componentInstance;
    app.initCursorTrail();

    const iterations = 50000;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 600 }));
    }
    const end = performance.now();
    const duration = end - start;
    console.log(`[BENCHMARK] ${iterations} mousemove events took ${duration.toFixed(2)} ms`);

    document.body.removeChild(canvas);
    document.body.removeChild(exp);
  });
});
