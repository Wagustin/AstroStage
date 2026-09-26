import { TestBed } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

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

  it('should display a generic error message when backend returns an error', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTestingController.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    // Respond with detailed error payload containing sensitive/internal backend message
    req.flush(
      { error: 'Internal Database Connection Failed: postgres://db_user:secret@localhost/db' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('postgres');
    expect(component.errorMessage).not.toContain('Database');
  });
});
