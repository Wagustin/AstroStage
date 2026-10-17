import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
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

  it('should create the waitlist component', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set generic error message when endpoint returns an error', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTestingController.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    // Simulate backend sending detailed error details/stack
    req.flush(
      { error: 'Internal DB Error', details: 'Database connection failed at 10.0.0.1' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Internal DB Error');
    expect(component.errorMessage).not.toContain('10.0.0.1');
    expect(component.loading).toBe(false);
  });

  it('should handle successful subscription', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.setValue({ email: 'pioneer@example.com' });
    component.onSubmit();

    const req = httpTestingController.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email: 'pioneer@example.com' });

    req.flush({ message: 'Suscripción exitosa' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });
});
