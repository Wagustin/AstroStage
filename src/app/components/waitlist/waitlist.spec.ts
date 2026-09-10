import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('Waitlist Component', () => {
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

  it('should display generic error message when subscription API returns an error', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Respond with a detailed backend error payload
    req.flush(
      { error: 'Sensitive DB Error details', details: { table: 'users', query: 'SELECT *' } },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Sensitive DB Error');
    expect(component.loading).toBe(false);
  });
});
