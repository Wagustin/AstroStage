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

  it('benchmark mousemove handler performance', async () => {
    // Setup dummy elements required for initCursorTrail
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    document.body.appendChild(canvas);

    const expSection = document.createElement('div');
    expSection.id = 'experiencia';
    // Give expSection some position layout properties in jsdom
    Object.defineProperty(expSection, 'getBoundingClientRect', {
      value: () => ({
        top: 300,
        bottom: 600,
        left: 0,
        right: 100,
        width: 100,
        height: 300,
        x: 0,
        y: 300,
        toJSON: () => {},
      }),
    });
    document.body.appendChild(expSection);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const iterations = 50000;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    }
    const end = performance.now();
    console.log(`[Benchmark] ${iterations} mousemove events took ${end - start} ms`);

    document.body.removeChild(canvas);
    document.body.removeChild(expSection);
  });
});
