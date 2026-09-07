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

  it('should handle mousemove and resize events gracefully', () => {
    const fixture = TestBed.createComponent(App);
    const canvas = fixture.nativeElement.querySelector('canvas#cursor-canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.getContext = (() => ({
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
      })) as unknown as typeof canvas.getContext;
    }
    fixture.detectChanges();
    expect(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
      window.dispatchEvent(new Event('resize'));
    }).not.toThrow();
  });
});
