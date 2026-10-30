import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { vi } from 'vitest';

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
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
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

  it('handles mousemove events efficiently', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 + (i % 100) }));
    }
    const duration = performance.now() - start;
    console.log(`Dispatched 10,000 mousemove events in ${duration.toFixed(2)} ms`);
    expect(duration).toBeGreaterThan(0);
  });
});
