import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component', () => {
  let fixture: ComponentFixture<Waitlist>;
  let component: Waitlist;
  let httpMock: HttpTestingController;

  beforeAll(() => {
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
      imports: [Waitlist],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should display a generic error message and not leak backend error details when subscription fails', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error with detailed response body
    req.flush(
      { error: 'Sensitive Database Error Details', details: 'Stack trace info' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Sensitive Database Error Details');
    expect(component.errorMessage).not.toContain('Stack trace info');
  });
});
