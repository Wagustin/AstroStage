import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should display generic error message when API returns backend error details', () => {
    component.waitlistForm.setValue({ email: 'user@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error with sensitive internal details
    const sensitiveErrorMessage = {
      error: 'SQLITE_ERROR: table users column secret_key does not exist',
      details: 'Internal Server Error at database.ts:123',
    };

    req.flush(sensitiveErrorMessage, { status: 500, statusText: 'Internal Server Error' });

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('SQLITE_ERROR');
    expect(component.errorMessage).not.toContain('database.ts');
    expect(component.loading).toBe(false);
  });
});
