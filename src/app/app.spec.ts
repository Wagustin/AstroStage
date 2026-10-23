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

  it('should initialize cursor trail and handle mousemove without errors', async () => {
    // Mock getContext for canvas in JSDOM if needed
    const HTMLCanvasElementProto = HTMLCanvasElement.prototype as any;
    const originalGetContext = HTMLCanvasElementProto.getContext;
    HTMLCanvasElementProto.getContext = () => ({
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
    });

    try {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 500,
      });
      window.dispatchEvent(mouseMoveEvent);

      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      expect(fixture.componentInstance).toBeTruthy();
    } finally {
      HTMLCanvasElementProto.getContext = originalGetContext;
    }
  });
});
