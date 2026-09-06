import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security Test', () => {
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

  it('should display generic error message on API failure without disclosing backend error details', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    // Simulate backend error with sensitive information details
    const backendErrorResponse = {
      error: 'DB connection failed at 10.0.0.5:5432 with password redacts',
      details: 'Stack trace: Error at processQuery (/app/db.js:42)',
    };

    req.flush(backendErrorResponse, { status: 500, statusText: 'Internal Server Error' });

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('DB connection');
    expect(component.errorMessage).not.toContain('Stack trace');
    expect(component.loading).toBe(false);
  });
});
