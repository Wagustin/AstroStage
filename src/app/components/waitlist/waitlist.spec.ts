import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display generic error message on HTTP error and not leak backend error details', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error with detailed response containing sensitive info
    req.flush(
      {
        error: 'Internal Database Error: Connection Failed',
        details: 'Secret DB connection string',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Internal Database Error');
    expect(component.errorMessage).not.toContain('Secret DB connection string');
    expect(component.loading).toBe(false);
  });
});
