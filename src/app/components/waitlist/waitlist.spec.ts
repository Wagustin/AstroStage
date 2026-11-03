import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';

describe('Waitlist Component', () => {
  let mockHttpClient: { post: ReturnType<typeof vi.fn> };
  let mockAudioService: { registerUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockHttpClient = {
      post: vi.fn(),
    };
    mockAudioService = {
      registerUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: AudioService, useValue: mockAudioService },
      ],
    }).compileComponents();
  });

  it('should display a generic error message when request fails without exposing backend error details', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    // Simulate backend returning sensitive internal error details
    const backendErrorResponse = {
      error: {
        error: 'Database connection failed: postgres://user:secret@internal-db:5432/main',
        details: 'Syntax error at or near SELECT * FROM users',
      },
      message: 'Http failure response for /api/subscribe: 500 Internal Server Error',
    };

    mockHttpClient.post.mockReturnValue(throwError(() => backendErrorResponse));

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database');
    expect(component.errorMessage).not.toContain('postgres');
    expect(component.errorMessage).not.toContain('Syntax error');
    expect(component.errorMessage).not.toContain('Http failure');
  });

  it('should handle successful submission', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    mockHttpClient.post.mockReturnValue(of({ message: 'Success' }));

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.loading).toBe(false);
    expect(component.success).toBe(true);
    expect(component.errorMessage).toBe('');
    expect(mockAudioService.registerUser).toHaveBeenCalled();
  });
});
