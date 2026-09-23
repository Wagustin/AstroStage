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

  it('benchmark mousemove event listener', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      window.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 100 + (i % 100),
          clientY: 200 + (i % 100),
        }),
      );
    }
    const duration = performance.now() - start;
    console.log(`[Benchmark] 10,000 mousemove events took: ${duration.toFixed(2)}ms`);
  });
});
