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

  it('benchmark mousemove performance', async () => {
    // Create canvas element so cursor-canvas exists in JSDOM
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    document.body.appendChild(canvas);

    // Create experiencia section
    const expSection = document.createElement('div');
    expSection.id = 'experiencia';
    Object.defineProperty(expSection, 'getBoundingClientRect', {
      value: () => ({ top: 500, bottom: 1000, left: 0, right: 100, width: 100, height: 500 }),
    });
    document.body.appendChild(expSection);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const start = performance.now();
    const iterations = 10000;
    for (let i = 0; i < iterations; i++) {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 600 }));
    }
    const duration = performance.now() - start;
    console.log(
      `[Benchmark] 10,000 mousemove events took ${duration.toFixed(2)} ms (${((duration / iterations) * 1000).toFixed(4)} µs/op)`,
    );

    document.body.removeChild(canvas);
    document.body.removeChild(expSection);
  });
});
