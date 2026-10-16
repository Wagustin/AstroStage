import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security & Functionality', () => {
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

  it('should create the waitlist component', () => {
    expect(component).toBeTruthy();
  });

  it('should not expose raw backend error details when API call fails', () => {
    component.waitlistForm.controls['email'].setValue('user@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error returning internal details
    const sensitiveBackendError = {
      error: 'Database connection failed: Password123 secret leak at server.ts:42',
      details: 'Stack trace: Error at db.connect()',
    };

    req.flush(sensitiveBackendError, { status: 500, statusText: 'Internal Server Error' });

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database connection failed');
    expect(component.errorMessage).not.toContain('Password123');
  });

  it('should handle successful subscription correctly', () => {
    component.waitlistForm.controls['email'].setValue('user@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Suscripción exitosa' });

    expect(component.loading).toBe(false);
    expect(component.success).toBe(true);
    expect(component.errorMessage).toBe('');
  });
});
