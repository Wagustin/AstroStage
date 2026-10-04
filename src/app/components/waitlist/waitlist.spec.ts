import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security Test', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpMock: HttpTestingController;

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

  it('should display generic error message on API failure and not leak internal error details', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Respond with a 500 error containing sensitive internal details
    req.flush(
      {
        error: 'Database connection failed at SecretServer:5432',
        details: 'Internal stack trace leak',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorElement = compiled.querySelector('.error-msg');

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(errorElement?.textContent).toContain(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(errorElement?.textContent).not.toContain('Database connection failed');
    expect(errorElement?.textContent).not.toContain('Internal stack trace leak');
  });
});
