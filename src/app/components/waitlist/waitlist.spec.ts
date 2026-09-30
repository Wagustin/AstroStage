import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

describe('Waitlist Component Security', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist, HttpClientTestingModule],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set generic error message on HTTP error and not leak backend error details', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpTestingController.expectOne('/api/subscribe');
    expect(req.request.method).toEqual('POST');

    // Simulate backend returning detailed internal error payload
    req.flush(
      { error: 'Sensitive DB details', details: 'Secret stack trace' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Sensitive DB details');
    expect(component.errorMessage).not.toContain('Secret stack trace');
    expect(component.loading).toBe(false);
  });
});
