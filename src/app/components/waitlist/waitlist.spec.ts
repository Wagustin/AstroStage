import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display a generic error message and not leak backend error details when HTTP request fails', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpTestingController.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    // Simulate backend error containing sensitive internal details
    req.flush(
      {
        error: 'Internal Database Connection Failed at secret-db-host:5432',
        details: 'Secret stack trace info',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database');
    expect(component.errorMessage).not.toContain('secret-db-host');
  });
});
