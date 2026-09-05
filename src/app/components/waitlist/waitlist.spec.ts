import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security Test', () => {
  let fixture: ComponentFixture<Waitlist>;
  let component: Waitlist;
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

  it('should display generic error message when backend returns detailed error', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend returning detailed system error
    const sensitiveBackendError = {
      error: 'DATABASE_CONNECTION_FAILED: Secret server info leaked at line 42',
      details: 'Stacktrace: internal_server_error_database_unreachable',
    };
    req.flush(sensitiveBackendError, { status: 500, statusText: 'Internal Server Error' });

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('DATABASE_CONNECTION_FAILED');
    expect(component.errorMessage).not.toContain('Secret server info');
    expect(component.loading).toBe(false);
  });
});
