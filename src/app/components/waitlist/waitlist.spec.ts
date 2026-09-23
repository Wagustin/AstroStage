import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display generic error message on HTTP error and not leak sensitive backend details', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error returning internal details or sensitive server information
    req.flush(
      {
        error: 'Internal Database Connection Failed: Secret SQL Exception at line 42',
        details: 'DB_HOST=secret.internal',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database');
    expect(component.errorMessage).not.toContain('secret');
    expect(component.loading).toBe(false);
  });

  it('should handle successful subscription', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ message: 'Suscripción exitosa, correo enviado.' });

    expect(component.success).toBe(true);
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBe(false);
  });
});
