import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component', () => {
  let httpMock: HttpTestingController;

  const mockAudioService = {
    registerUser: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist, HttpClientTestingModule],
      providers: [{ provide: AudioService, useValue: mockAudioService }],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    vi.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize with default state', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.waitlistForm.valid).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBe(false);
    expect(component.success).toBe(false);
  });

  it('should handle successful submission', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    expect(component.loading).toBe(true);

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ message: 'Success' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(mockAudioService.registerUser).toHaveBeenCalledTimes(1);
  });

  it('should not leak backend error details on error response', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    const sensitiveBackendDetails =
      'RESEND_API_KEY is missing in production database cluster internal error at line 42';
    req.flush(
      { error: sensitiveBackendDetails, details: 'Stack trace dump' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.success).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain(sensitiveBackendDetails);
    expect(component.errorMessage).not.toContain('Stack trace dump');
  });
});
