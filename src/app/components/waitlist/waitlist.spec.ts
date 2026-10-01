import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security & Functionality', () => {
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

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should display generic error message and mask backend internal error details when submit fails', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    // Simulate backend returning a 500 error with sensitive internal information
    const sensitiveResponseBody = {
      error: 'Database connection failed at postgres://user:secretpass@127.0.0.1:5432/prod',
      details: 'Stack trace: Error at db.ts:42',
    };
    req.flush(sensitiveResponseBody, { status: 500, statusText: 'Internal Server Error' });

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toEqual(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database connection failed');
    expect(component.errorMessage).not.toContain('secretpass');
  });

  it('should set success state when subscription succeeds', () => {
    component.waitlistForm.setValue({ email: 'user@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    req.flush({ message: 'Subscribed' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });
});
