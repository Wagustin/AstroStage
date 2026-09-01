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
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('invalid-email');
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should handle backend error without exposing internal error details', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    expect(component.loading).toBe(true);

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate server error returning sensitive details
    req.flush(
      { error: 'Internal database connection string leaked secret', details: 'DB_HOST=127.0.0.1' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('database');
    expect(component.errorMessage).not.toContain('secret');
  });

  it('should show success message on successful subscription', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    req.flush({ message: 'Suscripción exitosa' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
  });
});
