import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AudioService } from '../../services/audio.service';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('Waitlist', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpTesting: HttpTestingController;

  const mockAudioService = {
    registerUser: vi.fn(),
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
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show generic error message and NOT leak backend details on error response', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Respond with detailed error payload containing sensitive info
    req.flush(
      {
        error: 'Database connection failed at secret-db.internal:5432',
        details: { stack: 'Traceback...' },
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database connection failed');
    expect(component.errorMessage).not.toContain('secret-db.internal');
  });

  it('should handle successful submission', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Success' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(mockAudioService.registerUser).toHaveBeenCalled();
  });
});
