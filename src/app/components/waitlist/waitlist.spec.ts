import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Waitlist } from './waitlist';

describe('Waitlist Component', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpTestingController: HttpTestingController;

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
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should display generic error message on HTTP failure without leaking backend details', () => {
    component.waitlistForm.controls['email'].setValue('user@example.com');
    component.onSubmit();

    const req = httpTestingController.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    const backendErrorPayload = {
      error: 'DB_CONNECTION_FAILED: Connection timeout to database 10.0.0.5',
      details: 'Sensitive internal stack trace details',
    };

    req.flush(backendErrorPayload, { status: 500, statusText: 'Internal Server Error' });

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('DB_CONNECTION_FAILED');
    expect(component.errorMessage).not.toContain('Sensitive internal stack trace details');
    expect(component.loading).toBe(false);
  });
});
