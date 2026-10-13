import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AudioService } from '../../services/audio.service';

describe('Waitlist Component', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpMock: HttpTestingController;

  const mockAudioService = {
    registerUser: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AudioService, useValue: mockAudioService },
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display generic error message on server error without exposing backend details', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Respond with server error containing sensitive details
    req.flush(
      {
        error: 'Internal Database Server Exception: secret_table failure',
        details: 'Stack trace at line 42',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('secret_table');
    expect(component.errorMessage).not.toContain('Stack trace');
  });

  it('should handle successful subscription', () => {
    component.waitlistForm.setValue({ email: 'user@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Success' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });
});
