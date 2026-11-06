import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component', () => {
  let fixture: ComponentFixture<Waitlist>;
  let component: Waitlist;
  let httpMock: HttpTestingController;
  let mockAudioService: { registerUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockAudioService = {
      registerUser: vi.fn(),
    };

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

  it('should initialize with default states', () => {
    expect(component.submitted).toBe(false);
    expect(component.loading).toBe(false);
    expect(component.success).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.waitlistForm.valid).toBe(false);
  });

  it('should show generic error message and NOT expose raw backend error details when request fails', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    expect(component.waitlistForm.valid).toBe(true);

    component.onSubmit();
    expect(component.loading).toBe(true);

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    // Simulate backend error leaking database error or internal stack trace
    const sensitiveBackendError = {
      error:
        'Postgres connection failed: role "admin" password authentication failed at internal/db.ts:42',
      details: 'Sensitive internal system details',
    };

    req.flush(sensitiveBackendError, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(component.loading).toBe(false);
    // Generic user friendly message must be displayed
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    // Ensure sensitive backend errors are NOT reflected
    expect(component.errorMessage).not.toContain('Postgres');
    expect(component.errorMessage).not.toContain('Sensitive internal');
  });

  it('should handle successful subscription correctly', () => {
    component.waitlistForm.controls['email'].setValue('user@domain.com');

    component.onSubmit();
    expect(component.loading).toBe(true);

    const req = httpMock.expectOne('/api/subscribe');
    req.flush({ message: 'Success' }, { status: 200, statusText: 'OK' });

    expect(component.loading).toBe(false);
    expect(component.success).toBe(true);
    expect(component.submitted).toBe(false);
    expect(mockAudioService.registerUser).toHaveBeenCalled();
  });
});
