import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set generic error message on HTTP error response without exposing detailed backend errors', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpTestingController.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend returning detailed error information
    const sensitiveErrorDetails = {
      error: 'Database connection failed at postgres://user:pass@localhost:5432/db',
      details: 'Stacktrace: at line 42 in db.ts',
    };

    req.flush(sensitiveErrorDetails, { status: 500, statusText: 'Internal Server Error' });

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database connection failed');
    expect(component.errorMessage).not.toContain('Stacktrace');
  });
});
