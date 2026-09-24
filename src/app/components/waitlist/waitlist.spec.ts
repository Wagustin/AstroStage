import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AudioService } from '../../services/audio.service';

describe('Waitlist Component', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AudioService,
          useValue: {
            registerUser: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should display generic error message on HTTP request failure without leaking backend error details', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error response with sensitive internal details
    req.flush(
      { error: 'Internal Database Connection Failed at localhost:5432' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Internal Database Connection Failed');
    expect(component.loading).toBe(false);
  });
});
