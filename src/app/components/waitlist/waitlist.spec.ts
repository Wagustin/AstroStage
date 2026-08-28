import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component', () => {
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

  it('should create waitlist component', () => {
    expect(component).toBeTruthy();
  });

  it('should display generic error message on HTTP error and NOT leak backend error details', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Respond with a 500 error containing sensitive backend error details
    req.flush(
      { error: 'Internal Database Server Exception at line 42', details: 'Secret API Key failed' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    fixture.detectChanges();

    const genericMsg =
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.';
    expect(component.errorMessage).toBe(genericMsg);
    expect(component.errorMessage).not.toContain('Database');
    expect(component.errorMessage).not.toContain('Secret API Key');
    expect(component.loading).toBe(false);
  });
});
