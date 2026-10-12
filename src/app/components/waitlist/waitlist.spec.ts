import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Waitlist } from './waitlist';

describe('Waitlist', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set generic error message on HTTP error and not leak internal error details', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Respond with detailed backend error
    const backendErrorPayload = {
      error: 'Database connection failed: secret_db_pass@10.0.0.1',
      details: 'Stack trace details...',
    };
    req.flush(backendErrorPayload, { status: 500, statusText: 'Internal Server Error' });

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database connection failed');
    expect(component.errorMessage).not.toContain('secret_db_pass');
    expect(component.loading).toBe(false);
  });
});
