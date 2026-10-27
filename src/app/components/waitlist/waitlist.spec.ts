import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security', () => {
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

  it('should display generic error message on HTTP error and not leak backend error details', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error with sensitive information
    req.flush(
      { error: 'Internal Database Connection Failed at 10.0.0.1:5432' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database');
    expect(component.errorMessage).not.toContain('10.0.0.1');

    const compiled = fixture.nativeElement as HTMLElement;
    const errorElement = compiled.querySelector('.error-msg');
    expect(errorElement?.textContent?.trim()).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
  });
});
