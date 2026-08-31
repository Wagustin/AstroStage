import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle successful subscription', () => {
    component.waitlistForm.controls['email'].setValue('user@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@example.com' });

    req.flush({ message: 'Success' });

    expect(component.success).toBe(true);
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBe(false);
  });

  it('should display a generic error message when request fails, masking backend error details', () => {
    component.waitlistForm.controls['email'].setValue('user@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    // Simulate backend 500 internal server error leaking sensitive details
    req.flush(
      { error: 'Internal database connection string leaked: postgres://admin:secret@db:5432/app' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('postgres');
    expect(component.errorMessage).not.toContain('Internal database');
  });
});
