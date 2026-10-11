import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
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

  it('should display generic error message when subscription API returns detailed backend error', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    // Simulate backend response with sensitive error details
    const sensitiveError = {
      error: 'Database connection failed: postgres://dbuser:secret@10.0.0.1/db',
      details: 'Stack trace: Secret key undefined at line 42',
    };

    req.flush(sensitiveError, { status: 500, statusText: 'Internal Server Error' });

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('postgres');
    expect(component.errorMessage).not.toContain('Stack trace');
    expect(component.loading).toBe(false);
  });
});
